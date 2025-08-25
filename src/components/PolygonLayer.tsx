import React from "react";
import { useSource } from "../core/useSource";
import { useLayer } from "../core/useLayer";

interface Props {
  id: string;
  data: GeoJSON.FeatureCollection;
  color?: string;
}

export const PolygonLayer: React.FC<Props> = ({ id, data, color = "#FF0000" }) => {
  useSource(id, {
    type: "geojson",
    data,
  });

  useLayer({
    id: `${id}-fill`,
    type: "fill",
    source: id,
    paint: {
      "fill-color": color,
      "fill-opacity": 0.4,
    },
  });

  return null;
};
