import { useRef, useEffect, useCallback } from "react";
import type { Map, GeoJSONSource } from "mapbox-gl";
import MapboxDraw, { DrawMode, DrawCustomMode } from "@mapbox/mapbox-gl-draw";

// Custom Rectangle Mode
const DrawRectangle: DrawCustomMode = {
  ...MapboxDraw.modes.draw_polygon,
  onSetup(this: any) {
    const polygon = this.newFeature({
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [[]] },
    });
    this.addFeature(polygon);
    this.currentRectangle = polygon; // <-- as any kiểu TS
    return { polygon };
  },
  onClick(this: any, e: any) {
    const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    this.currentRectangle.geometry.coordinates[0].push(coords);
    const src = this.map.getSource(this.currentRectangle.id) as GeoJSONSource;
    src?.setData(this.currentRectangle);
  },
  onStop(this: any) {
    this.map.fire("draw.create", { features: [this.currentRectangle] });
  },
};

// Custom Circle Mode
const DrawCircle: DrawCustomMode = {
  ...MapboxDraw.modes.draw_polygon,
  onSetup(this: any) {
    const circle = this.newFeature({
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [[]] },
    });
    this.addFeature(circle);
    this.center = null;
    this.currentCircle = circle;
    return { circle };
  },
  onClick(this: any, e: any) {
    if (!this.center) {
      this.center = [e.lngLat.lng, e.lngLat.lat];
      this.currentCircle.geometry.coordinates = [[this.center]];
    } else {
      const edge: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      const radius = Math.hypot(edge[0]-this.center[0], edge[1]-this.center[1]);
      const points: [number, number][] = [];
      const steps = 64;
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        points.push([this.center[0]+radius*Math.cos(angle), this.center[1]+radius*Math.sin(angle)]);
      }
      points.push(points[0]);
      this.currentCircle.geometry.coordinates = [points];
      const src = this.map.getSource(this.currentCircle.id) as GeoJSONSource;
      src?.setData(this.currentCircle);
      this.map.fire("draw.create", { features: [this.currentCircle] });
      this.changeMode("simple_select");
    }
  },
};


export interface UseDrawOptions {
  map: Map | null;
  onCreate?: (features: GeoJSON.Feature[]) => void;
  onUpdate?: (features: GeoJSON.Feature[]) => void;
  onDelete?: (features: GeoJSON.Feature[]) => void;
}

export function useDrawControls({ map, onCreate, onUpdate, onDelete }: UseDrawOptions) {
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!map) return;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle: DrawRectangle,
        draw_circle: DrawCircle,
      },
    });

    drawRef.current = draw;
    map.addControl(draw);

    if (onCreate) map.on("draw.create", (e: any) => onCreate(e.features));
    if (onUpdate) map.on("draw.update", (e: any) => onUpdate(e.features));
    if (onDelete) map.on("draw.delete", (e: any) => onDelete(e.features));

    return () => {
      map.removeControl(draw);
    };
  }, [map, onCreate, onUpdate, onDelete]);

  // ========== API ==========
  const drawPolygon = useCallback(() => drawRef.current?.changeMode("draw_polygon" as any), []);
  const drawLine = useCallback(() => drawRef.current?.changeMode("draw_line_string" as any), []);
  const drawPoint = useCallback(() => drawRef.current?.changeMode("draw_point" as any), []);
  const drawRectangle = useCallback(() => drawRef.current?.changeMode("draw_rectangle"), []);
  const drawCircle = useCallback(() => drawRef.current?.changeMode("draw_circle"), []);
  const selectMode = useCallback(() => drawRef.current?.changeMode("simple_select" as any), []);
  const deleteSelected = useCallback(() => drawRef.current?.trash(), []);
  const deleteAll = useCallback(() => drawRef.current?.deleteAll(), []);
  const getAll = useCallback(() => drawRef.current?.getAll().features ?? [], []);

  return {
    drawRef,
    drawPolygon,
    drawLine,
    drawPoint,
    drawRectangle,
    drawCircle,
    selectMode,
    deleteSelected,
    deleteAll,
    getAll,
  };
}
