import { useEffect } from "react";
import { useMapContext } from "./MapProvider";
import type { AnySourceData } from "mapbox-gl";

export function useSource(id: string, source: AnySourceData) {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;
    if (!map.getSource(id)) {
      map.addSource(id, source);
    }

    return () => {
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, [map, id, source]);
}
