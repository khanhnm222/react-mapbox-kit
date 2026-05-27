import { FC } from "react";
import { DrawMode } from "../../types";
import React from "react";

interface DrawControlsProps {
  setMode: (mode: DrawMode) => void;
}

export const DrawControls: FC<DrawControlsProps> = ({ setMode }) => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded shadow p-2 flex gap-2">
      <button
        onClick={() => setMode("draw_polygon")}
        className="px-2 py-1 border rounded hover:bg-gray-100"
      >
        Polygon
      </button>
      <button
        onClick={() => setMode("draw_line_string")}
        className="px-2 py-1 border rounded hover:bg-gray-100"
      >
        Line
      </button>
      <button
        onClick={() => setMode("simple_select")}
        className="px-2 py-1 border rounded hover:bg-gray-100"
      >
        Select
      </button>
    </div>
  );
};
