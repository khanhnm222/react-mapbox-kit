import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useDraw } from "@react-mapbox-kit/core";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function MapContent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const { startDraw, clearAll } = useDraw({
    map,
    onCreate: feature => console.log("Created:", feature),
    onUpdate: feature => console.log("Updated:", feature),
    onDelete: id => console.log("Deleted:", id),
  });

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
      <div className="absolute top-4 left-4 bg-white shadow-md rounded-lg p-2 space-x-2">
        <button
          onClick={() => startDraw("polygon")}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
        >
          Polygon
        </button>
        <button
          onClick={() => startDraw("line")}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
        >
          Line
        </button>
        <button
          onClick={() => startDraw("point")}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-400"
        >
          Point
        </button>
        <button
          onClick={() => startDraw("circle")}
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-400"
        >
          Circle
        </button>
        <button
          onClick={() => startDraw("rectangle")}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400"
        >
          Rectangle
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-400"
        >
          Clear All
        </button>{" "}
      </div>

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

