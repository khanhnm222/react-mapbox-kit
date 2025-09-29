// useDraw.test.ts
import { renderHook } from "@testing-library/react";
import { useDraw } from "../src/hooks/useDraw";

// Mock Mapbox GL
const mockOn = jest.fn();
const mockAddControl = jest.fn();
const mockRemoveControl = jest.fn();

const mockMap = {
  addControl: jest.fn(),
  removeControl: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
} as unknown as mapboxgl.Map;

jest.mock("mapbox-gl", () => ({
  Map: jest.fn().mockImplementation(() => ({
    on: mockOn,
    addControl: mockAddControl,
    removeControl: mockRemoveControl,
  })),
}));

// Mock MapboxDraw
const mockChangeMode = jest.fn();
const mockGetMode = jest.fn().mockReturnValue("simple_select");
jest.mock("@mapbox/mapbox-gl-draw", () =>
  jest.fn().mockImplementation(() => ({
    changeMode: mockChangeMode,
    getMode: mockGetMode,
  }))
);

describe("useDraw hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register draw.create, draw.update, draw.delete events", () => {
    const onCreate = jest.fn();
    const onUpdate = jest.fn();
    const onDelete = jest.fn();

    const options = {
      onCreate,
      onUpdate,
      onDelete,
      map: mockMap
    };

    const { result } = renderHook(() => useDraw(options));

    const draw = result.current;
    expect(draw).toBeDefined();

    // Kiểm tra map.on được gọi đúng 3 lần
    expect(mockOn).toHaveBeenCalledWith(
      "draw.create",
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith(
      "draw.update",
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith(
      "draw.delete",
      expect.any(Function)
    );
  });

  it("should call onCreate when draw.create fires", () => {
    const onCreate = jest.fn();
    renderHook(() => useDraw({  map: mockMap, onCreate }));

    // Lấy callback mà mockOn gắn vào
    const createHandler = mockOn.mock.calls.find(
      (c) => c[0] === "draw.create"
    )?.[1];

    const fakeEvent = {
      features: [{ id: "1", type: "Feature", geometry: { type: "Polygon", coordinates: [] } }],
    };

    createHandler(fakeEvent);
    expect(onCreate).toHaveBeenCalledWith(fakeEvent.features);
  });

  it("should call onUpdate when draw.update fires", () => {
    const onUpdate = jest.fn();
    renderHook(() => useDraw({  map: mockMap, onUpdate }));

    const updateHandler = mockOn.mock.calls.find(
      (c) => c[0] === "draw.update"
    )?.[1];

    const fakeEvent = {
      features: [{ id: "2", type: "Feature", geometry: { type: "Point", coordinates: [0, 0] } }],
    };

    updateHandler(fakeEvent);
    expect(onUpdate).toHaveBeenCalledWith(fakeEvent.features);
  });

  it("should call onDelete when draw.delete fires", () => {
    const onDelete = jest.fn();
    renderHook(() => useDraw({  map: mockMap, onDelete }));

    const deleteHandler = mockOn.mock.calls.find(
      (c) => c[0] === "draw.delete"
    )?.[1];

    const fakeEvent = {
      features: [{ id: "3", type: "Feature", geometry: { type: "LineString", coordinates: [[0, 0], [1, 1]] } }],
    };

    deleteHandler(fakeEvent);
    expect(onDelete).toHaveBeenCalledWith(fakeEvent.features);
  });
});