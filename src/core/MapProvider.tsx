import { createContext, useContext, useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from 'mapbox-gl';
import React from "react";

type MapContextType = { map: Map | null };
const MapContext = createContext<MapContextType>({ map: null });

export const MapProvider: React.FC<{
  children: React.ReactNode;
  accessToken: string;
  style?: string;
}> = ({ children, accessToken, style = "mapbox://styles/mapbox/light-v12" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    if (containerRef.current && !map) {
      const m = new mapboxgl.Map({
        container: containerRef.current,
        style,
        center: [105.8, 21.0],
        zoom: 5,
      });
      setMap(m);
    }
  }, [accessToken, style, map]);

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }} />
      {map && children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
