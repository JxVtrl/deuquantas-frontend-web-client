import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';

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

interface Props {
    initialCenter: { lat: number; lng: number };
    estabelecimentos: Estabelecimento[];
}

const containerStyle = {
    width: '100vw',
    height: '100vh',
};

export default function MapaEstabelecimentosGoogle({ initialCenter, estabelecimentos }: Props) {
    const [selected, setSelected] = useState<Estabelecimento | null>(null);

    // Substitua pela sua chave de API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    if (!isLoaded) return <div>Carregando mapa...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={initialCenter}
            zoom={13}
        >
            {estabelecimentos
                .filter(est => est.latitude && est.longitude)
                .map(est => (
                    <Marker
                        key={est.id}
                        position={{ lat: est.latitude!, lng: est.longitude! }}
                        onClick={() => setSelected(est)}
                    />
                ))}
            {selected && (
                <InfoWindow
                    position={{ lat: selected.latitude!, lng: selected.longitude! }}
                    onCloseClick={() => setSelected(null)}
                >
                    <div>
                        <strong>{selected.nome}</strong><br />
                        {selected.endereco}, {selected.numero}<br />
                        {selected.complemento && <>{selected.complemento}<br /></>}
                        {selected.cep}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}