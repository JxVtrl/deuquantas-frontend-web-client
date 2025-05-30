import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getEstabelecimentos } from '../../services/estabelecimento.service';
import Layout from '@/layout';
import { geocodeEndereco } from '@/utils/geocode';

const MapaEstabelecimentosGoogle = dynamic(
  () => import('../../components/MapaEstabelecimentos'),
  { ssr: false },
);

type Estabelecimento = {
  id: string;
  nome: string;
  endereco: string;
  numero: string;
  complemento?: string;
  cep: string;
  lat?: number;
  lng?: number;
};

type EstabelecimentoComCoord = Estabelecimento & {
  lat: number;
  lng: number;
};

export default function Locais() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>(
    [],
  );
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    async function fetchAndGeocode() {
      const lista = await getEstabelecimentos();
      const estabelecimentosComCoord: EstabelecimentoComCoord[] = [];
      for (const est of lista) {
        // Se já tiver lat/lng, usa, senão busca
        if (est.lat && est.lng) {
          estabelecimentosComCoord.push({
            ...est,
            lat: est.lat,
            lng: est.lng,
          });
        } else {
          const enderecoCompleto = `${est.endereco}, ${est.numero}, ${est.cep}`;
          const coord = await geocodeEndereco(enderecoCompleto);
          if (coord) {
            estabelecimentosComCoord.push({
              ...est,
              lat: coord.lat,
              lng: coord.lng,
            });
          }
        }
      }
      setEstabelecimentos(estabelecimentosComCoord);
    }

    fetchAndGeocode();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setCenter({ lat: -23.55052, lng: -46.633308 });
        },
      );
    } else {
      setCenter({ lat: -23.55052, lng: -46.633308 });
    }
  }, []);

  if (!center) return <div>Carregando mapa...</div>;

  return (
    <Layout>
      <MapaEstabelecimentosGoogle
        initialCenter={center}
        estabelecimentos={estabelecimentos}
      />
    </Layout>
  );
}
