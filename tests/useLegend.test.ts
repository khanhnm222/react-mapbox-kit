import { renderHook } from "@testing-library/react";
import { useLegend } from "../src/hooks/useLegend";

describe("useLegend", () => {
  it("should add legend to map container", () => {
    const container = document.createElement("div");
    const map = {
      getContainer: () => container,
    } as any;

    renderHook(() =>
      useLegend({ map, items: [{ color: "red", label: "Test" }] })
    );

    expect(container.querySelector(".map-legend")).not.toBeNull();
  });
});
