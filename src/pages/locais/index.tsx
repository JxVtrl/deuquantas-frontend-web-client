import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getEstabelecimentos } from '../../services/estabelecimento.service';
import Layout from '@/layout';

const MapaEstabelecimentosGoogle = dynamic(
    () => import('../../components/MapaEstabelecimentos'),
    { ssr: false }
);

type Estabelecimento = {
    id: string;
    nome: string;
    endereco: string;
    numero: string;
    complemento?: string;
    cep: string;
    latitude?: number;
    longitude?: number;
};

export default function Locais() {
    const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        getEstabelecimentos().then(setEstabelecimentos);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                () => {
                    setCenter({ lat: -23.55052, lng: -46.633308 });
                }
            );
        } else {
            setCenter({ lat: -23.55052, lng: -46.633308 });
        }
    }, []);

    if (!center) return <div>Carregando mapa...</div>;

    return (
        <Layout>
            <MapaEstabelecimentosGoogle initialCenter={center} estabelecimentos={estabelecimentos} />
        </Layout>
    );
}