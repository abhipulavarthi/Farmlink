import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapPicker({ initialLocation, onLocationSelect }) {
    const [position, setPosition] = useState(initialLocation || null);

    // Default center (India)
    const center = initialLocation || { lat: 20.5937, lng: 78.9629 };
    const zoom = initialLocation ? 13 : 5;

    useEffect(() => {
        if (initialLocation) {
            setPosition(initialLocation);
        }
    }, [initialLocation]);

    useEffect(() => {
        if (position && onLocationSelect) {
            onLocationSelect(position);
        }
    }, [position]);

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
            <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-xs rounded shadow z-[400]">
                Click to set location
            </div>
        </div>
    );
}
