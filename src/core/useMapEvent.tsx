import { useEffect } from "react";
import { useMapContext } from "./MapProvider";
import type { MapMouseEvent } from "mapbox-gl";

export function useMapEvent<T extends keyof mapboxgl.MapEventType>(
  event: T,
  handler: (ev: mapboxgl.MapEventType[T] | MapMouseEvent) => void
) {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;
    map.on(event as string, handler);
    return () => {
      map.off(event as string, handler);
    };
  }, [map, event, handler]);
}
