import { useEffect, useRef, useCallback } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Map } from "mapbox-gl";
import { DrawCircleMode, DrawRectangleMode } from "../utils/customDraw";

type DrawType = "polygon" | "line" | "point" | "circle" | "rectangle";

export function useDraw({
  map,
  onCreate,
  onUpdate,
  onDelete,
}: {
  map: Map | null;
  onCreate?: (feature: any) => void;
  onUpdate?: (feature: any) => void;
  onDelete?: (id: string) => void;
}) {
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!map || drawRef.current) return;

    const initDraw = () => {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        modes: {
          ...MapboxDraw.modes,
          draw_circle: DrawCircleMode,
          draw_rectangle: DrawRectangleMode,
        },
      });
      drawRef.current = draw;
      map.addControl(draw);

      const handleCreate = (e: any) => e.features.forEach((f: any) => onCreate?.(f));
      const handleUpdate = (e: any) => e.features.forEach((f: any) => onUpdate?.(f));
      const handleDelete = (e: any) => e.features.forEach((f: { id: string }) => onDelete?.(f.id));

      map.on("draw.create", handleCreate);
      map.on("draw.update", handleUpdate);
      map.on("draw.delete", handleDelete);

      return () => {
        map.off("draw.create", handleCreate);
        map.off("draw.update", handleUpdate);
        map.off("draw.delete", handleDelete);
      };
    };

    if (!map.isStyleLoaded()) {
      map.once("load", initDraw);
    } else {
      const cleanup = initDraw();
      return cleanup;
    }

    return () => {
      if (!drawRef.current) return;
      map.removeControl(drawRef.current);
      drawRef.current = null;
    };
  }, [map, onCreate, onUpdate, onDelete]);

  const startDraw = useCallback((type: DrawType) => {
    if (!drawRef.current) return;
    switch (type) {
      case "circle": drawRef.current.changeMode("draw_circle"); break;
      case "rectangle": drawRef.current.changeMode("draw_rectangle"); break;
      case "line": drawRef.current.changeMode("draw_line_string"); break;
      default: drawRef.current.changeMode(`draw_${type}`);
    }
  }, []);

  const clearAll = useCallback(() => {
    drawRef.current?.deleteAll();
  }, []);

  return { startDraw, clearAll, drawRef };
}
