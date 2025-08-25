import * as turf from "@turf/turf";

export const measureArea = (polygon: GeoJSON.Polygon | GeoJSON.MultiPolygon) => {
  return turf.area(turf.feature(polygon));
};

export const measureDistance = (line: GeoJSON.LineString) => {
  return turf.length(turf.feature(line), { units: "kilometers" });
};
