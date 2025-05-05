import { GoogleMap, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';

interface Props {
    initialPosition: { lat: number; lng: number };
    onPositionChange: (pos: { lat: number; lng: number }) => void;
}

const containerStyle = {
    width: '100%',
    height: '300px',
};

export default function MapaLocalizacaoEstabelecimento({ initialPosition, onPositionChange }: Props) {
    const [position, setPosition] = useState(initialPosition);

    const handleDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            setPosition(newPos);
            onPositionChange(newPos);
        }
    }, [onPositionChange]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={16}
        >
            <Marker
                position={position}
                draggable
                onDragEnd={handleDragEnd}
            />
        </GoogleMap>
    );
} 