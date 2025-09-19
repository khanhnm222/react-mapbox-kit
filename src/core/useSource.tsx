import { useEffect } from "react";
import { useMapContext } from "./MapProvider";
import type { SourceSpecification, CustomSourceInterface } from "mapbox-gl";

export function useSource(id: string, source: SourceSpecification | CustomSourceInterface<unknown>) {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;

    function add() {
      if (map?.getSource(id)) {
        map.addSource(id, source);
      }
    }

    if (map.isStyleLoaded()) {
      add();
    } else {
      map.once("load", add);
    }

    return () => {
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, [map, id, source]);
}
