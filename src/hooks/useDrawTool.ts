import { useRef, useState, useCallback, useEffect } from "react";
import { Map } from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { DrawCircleMode, DrawRectangleMode } from "../utils/customDraw";

const DRAW_EVENTS = {
  CREATE: 'draw.create',
  UPDATE: 'draw.update',
  DELETE: 'draw.delete',
};

export type DrawMode =
  | "idle"
  | "draw_polygon"
  | "draw_line_string"
  | "draw_point"
  | "draw_circle"
  | "draw_rectangle"
  | "select"
  | "edit";

export interface UseDrawOptions {
  map: Map | null;
  defaultMode?: DrawMode;
  onCreate?: (features: any[]) => void;
  onUpdate?: (features: any[]) => void;
  onDelete?: (features: any[]) => void;
}

export function useDrawTool({ map, defaultMode = "idle", onCreate, onUpdate, onDelete }: UseDrawOptions) {
  const [mode, setModeState] = useState<DrawMode>(defaultMode);
  const featuresRef = useRef<any[]>([]);
  const drawRef = useRef<MapboxDraw | null>(null);
  const createListenerRef = useRef<(e: any) => void | null>(null);
  const updateListenerRef = useRef<(e: any) => void | null>(null);
  const deleteListenerRef = useRef<(e: any) => void | null>(null);

  useEffect(() => {
    if (!map) return;

    const modes = {
      ...MapboxDraw.modes,
      draw_rectangle: DrawRectangleMode,
      draw_circle: DrawCircleMode,
    };

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      modes,
    });

    map.addControl(draw);
    drawRef.current = draw;

    const updateFeatures = () => {
      featuresRef.current = draw.getAll()?.features || [];
    };

    createListenerRef.current = (e: any) => {
      onCreate?.(e.features);
      updateFeatures();
    };
    updateListenerRef.current = (e: any) => {
      onUpdate?.(e.features);
      updateFeatures();
    };
    deleteListenerRef.current = (e: any) => {
      onDelete?.(e.features);
      updateFeatures();
    };

    // Sử dụng hằng số từ DRAW_EVENTS
    map.on(DRAW_EVENTS.CREATE, createListenerRef.current);
    map.on(DRAW_EVENTS.UPDATE, updateListenerRef.current);
    map.on(DRAW_EVENTS.DELETE, deleteListenerRef.current);

    draw.changeMode('simple_select');

    return () => {
      if (drawRef.current) {
        map.removeControl(draw);
      }
      if (createListenerRef.current) {
        map.off(DRAW_EVENTS.CREATE, createListenerRef.current);
      }
      if (updateListenerRef.current) {
        map.off(DRAW_EVENTS.UPDATE, updateListenerRef.current);
      }
      if (deleteListenerRef.current) {
        map.off(DRAW_EVENTS.DELETE, deleteListenerRef.current);
      }
    };
  }, [map, onCreate, onUpdate, onDelete]);

  const mapModeToDrawMode = (m: DrawMode): string => {
    if (m === 'idle' || m === 'select') return 'simple_select';
    if (m === 'edit') return 'direct_select';
    return m;
  };

  const setMode = useCallback((newMode: DrawMode | null) => {
    const effectiveMode = newMode ?? "idle";
    setModeState(effectiveMode);
    if (drawRef.current) {
      drawRef.current.changeMode(mapModeToDrawMode(effectiveMode));
    }
  }, []);

  const createFeature = useCallback((feature: any) => {
    if (drawRef.current) {
      drawRef.current.add(feature);
    }
  }, []);

  const updateFeature = useCallback((feature: any) => {
    if (drawRef.current) {
      drawRef.current.add(feature);
    }
  }, []);

  const deleteFeature = useCallback((featureId: string) => {
    if (drawRef.current) {
      drawRef.current.delete(featureId);
    }
  }, []);

  const getAll = useCallback(() => {
    return drawRef.current ? drawRef.current.getAll().features : [];
  }, []);

  const deleteAll = useCallback(() => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
    }
  }, []);

  const getSelected = useCallback(() => {
    return drawRef.current ? drawRef.current.getSelected().features : [];
  }, []);

  const deleteSelected = useCallback(() => {
    if (drawRef.current) {
      drawRef.current.delete(drawRef.current.getSelectedIds());
    }
  }, []);

  return {
    mode,
    setMode,
    createFeature,
    updateFeature,
    deleteFeature,
    getAll,
    deleteAll,
    getSelected,
    deleteSelected,
    modes: {
      idle: "idle" as DrawMode,
      draw_polygon: "draw_polygon" as DrawMode,
      draw_line_string: "draw_line_string" as DrawMode,
      draw_point: "draw_point" as DrawMode,
      draw_circle: "draw_circle" as DrawMode,
      draw_rectangle: "draw_rectangle" as DrawMode,
      select: "select" as DrawMode,
      edit: "edit" as DrawMode,
    },
  };
}