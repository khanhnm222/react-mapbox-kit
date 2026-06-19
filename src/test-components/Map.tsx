import React, { useRef, useState, useEffect } from "react";
import mapboxgl, { Map as MbMap } from "mapbox-gl";
import { MapContext } from "./MapContext";

interface MapProps {
  accessToken: string;
  style?: string;
  children?: React.ReactNode;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export const Map: React.FC<MapProps> = ({
  accessToken,
  style = "mapbox://styles/mapbox/streets-v11",
  children,
  center = [0, 0],
  zoom = 0,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MbMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = accessToken;

    const m = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center,
      zoom,
    });

    setMap(m);

    return () => {
      m.remove();
      setMap(null);
    };
  }, [accessToken, style, center?.[0], center?.[1], zoom]);


  return (
    <MapContext.Provider value={{ map }}>
      <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} />
      {map && children}
    </MapContext.Provider>
  );
};
