import { useEffect } from "react";
import { useMapContext } from "../core/MapProvider";
import { LayerSpecification } from "mapbox-gl";

export function useLayer(layer: LayerSpecification, beforeId?: string) {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;
    const id = layer.id;

    function add() {
      // ⚡ Ensure layer source is existed before adding layer
      if (layer.source && !map?.getSource(layer.source as string)) {
        console.warn(`Source "${layer.source}" not found for layer "${id}".`);
        return;
      }

      if (!map?.getLayer(id)) {
        try {
          map?.addLayer(layer, beforeId);
        } catch (err) {
          console.error("Error adding layer", err);
        }
      }
    }

    if (map.isStyleLoaded()) {
      add();
    } else {
      map.once("load", add);
    }

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (layer.source && map.getSource(layer.source as string)) {
        try {
          map.removeSource(layer.source as string);
        } catch {}
      }
    };
  }, [map, layer, beforeId]);
}
