import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface UseMarkerProps {
  map: mapboxgl.Map | null;
  lngLat: [number, number];
  popupText?: string;
}

export function useMarker({ map, lngLat, popupText }: UseMarkerProps) {
  useEffect(() => {
    if (!map) return;

    const marker = new mapboxgl.Marker().setLngLat(lngLat);

    if (popupText) {
      const popup = new mapboxgl.Popup().setText(popupText);
      marker.setPopup(popup);
    }

    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, lngLat[0], lngLat[1], popupText]);
}
