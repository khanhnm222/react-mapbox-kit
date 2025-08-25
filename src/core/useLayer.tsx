import { useEffect } from "react";
import { useMapContext } from "./MapProvider";
import type { AnyLayer } from "mapbox-gl";

export function useLayer(layer: AnyLayer) {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;

    if (!map.getLayer(layer.id)) {
      map.addLayer(layer);
    }

    return () => {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
    };
  }, [map, layer]);
}
