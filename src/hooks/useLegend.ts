import { useEffect } from "react";

interface LegendItem {
  color: string;
  label: string;
}

interface UseLegendProps {
  map: mapboxgl.Map | null;
  items: LegendItem[];
}

export function useLegend({ map, items }: UseLegendProps) {
  useEffect(() => {
    if (!map) return;

    const legend = document.createElement("div");
    legend.className = "map-legend";
    legend.style.position = "absolute";
    legend.style.bottom = "10px";
    legend.style.left = "10px";
    legend.style.background = "white";
    legend.style.padding = "6px";
    legend.style.borderRadius = "4px";

    items.forEach(({ color, label }) => {
      const item = document.createElement("div");
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.innerHTML = `<span style="width:12px;height:12px;background:${color};margin-right:6px;display:inline-block"></span>${label}`;
      legend.appendChild(item);
    });

    map.getContainer().appendChild(legend);

    return () => {
      legend.remove();
    };
  }, [map, items]);
}
