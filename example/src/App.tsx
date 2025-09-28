import { useEffect, useRef, useState } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function MapContent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.66, 10.77],
      zoom: 12,
    });

    setMap(mapInstance);
    return () => mapInstance.remove();
  }, []);

  return (
    <>
      {/* Sample polygon layer */}
      {/* <PolygonLayer id="sample-polygon" data={samplePolygon} color="#FF0000" /> */}
      <div ref={mapContainer} className="h-full w-full" />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapContent />
    </div>
  );
}

