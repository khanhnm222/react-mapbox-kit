import MapboxDraw, { DrawCustomMode, DrawCustomModeThis } from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import type { MapMouseEvent } from "mapbox-gl";

// ---- Circle Mode ----
const DrawCircleMode: DrawCustomMode = {
  ...MapboxDraw.modes.draw_polygon,

  onSetup(this: DrawCustomModeThis) {
    const polygon = this.newFeature({
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [[]] },
    });

    this.addFeature(polygon);
    return { polygon, startPoint: null as [number, number] | null };
  },

  onClick(this: DrawCustomModeThis, state: any, e: MapMouseEvent) {
    if (!state.startPoint) {
      state.startPoint = [e.lngLat.lng, e.lngLat.lat];
    } else {
      const radius = turf.distance(state.startPoint, [e.lngLat.lng, e.lngLat.lat], { units: "kilometers" });
      const circle = turf.circle(state.startPoint, radius, { steps: 64, units: "kilometers" });
      state.polygon.setCoordinates(circle.geometry.coordinates);
      this.changeMode("simple_select", { featureIds: [state.polygon.id] });
    }
  },

  onMouseMove(this: DrawCustomModeThis, state: any, e: MapMouseEvent) {
    if (!state.startPoint) return;
    const radius = turf.distance(state.startPoint, [e.lngLat.lng, e.lngLat.lat], { units: "kilometers" });
    const circle = turf.circle(state.startPoint, radius, { steps: 64, units: "kilometers" });
    state.polygon.setCoordinates(circle.geometry.coordinates);
  },
};

// ---- Rectangle Mode ----
const DrawRectangleMode: DrawCustomMode = {
  ...MapboxDraw.modes.draw_polygon,

  onSetup(this: DrawCustomModeThis) {
    const polygon = this.newFeature({
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [[]] },
    });
    this.addFeature(polygon);
    return { polygon, startPoint: null as [number, number] | null };
  },

  onClick(this: DrawCustomModeThis, state: any, e: MapMouseEvent) {
    if (!state.startPoint) {
      state.startPoint = [e.lngLat.lng, e.lngLat.lat];
    } else {
      const [x1, y1] = state.startPoint;
      const [x2, y2] = [e.lngLat.lng, e.lngLat.lat];
      const rectangleCoords = [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
        [x1, y1],
      ];
      state.polygon.setCoordinates([rectangleCoords]);
      this.changeMode("simple_select", { featureIds: [state.polygon.id] });
    }
  },

  onMouseMove(this: DrawCustomModeThis, state: any, e: MapMouseEvent) {
    if (!state.startPoint) return;
    const [x1, y1] = state.startPoint;
    const [x2, y2] = [e.lngLat.lng, e.lngLat.lat];
    const rectangleCoords = [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
      [x1, y1],
    ];
    state.polygon.setCoordinates([rectangleCoords]);
  },
};

export { DrawCircleMode, DrawRectangleMode };
