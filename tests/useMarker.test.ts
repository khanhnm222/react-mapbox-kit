import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useMarker } from "../src/hooks/useMarker";

vi.mock("mapbox-gl", () => {
  return {
    default: {
      Marker: vi.fn().mockImplementation(() => ({
        setLngLat: vi.fn().mockReturnThis(),
        setPopup: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
        remove: vi.fn(),
      })),
      Popup: vi.fn().mockImplementation(() => ({
        setText: vi.fn().mockReturnThis(),
      })),
    },
  };
});

describe("useMarker", () => {
  it("should add marker to map", () => {
    const map = {} as any;
    const { unmount } = renderHook(() =>
      useMarker({ map, lngLat: [0, 0], popupText: "Hello" })
    );
    unmount();
  });
});
