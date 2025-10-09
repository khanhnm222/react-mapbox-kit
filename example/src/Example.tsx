import { MapLayer, MapSource, useDraw, useMapContext, Map } from "@react-mapbox-kit/core";

const samplePolygon: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [105, 20],
            [106, 20],
            [106, 21],
            [105, 21],
            [105, 20],
          ],
        ],
      },
      properties: {},
    },
  ],
};

function MapContent() {
  const { map } = useMapContext();
  const { startDraw, clearAll } = useDraw({
    map,
    onCreate: (f) => console.log("Created", f),
    onUpdate: (f) => console.log("Updated", f),
    onDelete: (id) => console.log("Deleted", id),
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 10,
          background: "white",
          padding: 8,
          display: "flex",
          gap: "16px",
        }}
      >
        <button className="px-3 py-1" onClick={() => startDraw("polygon")}>Polygon</button>
        <button className="px-3 py-1" onClick={() => startDraw("line")}>Line</button>
        <button className="px-3 py-1" onClick={() => startDraw("point")}>Point</button>
        <button className="px-3 py-1" onClick={() => startDraw("circle")}>Circle</button>
        <button className="px-3 py-1" onClick={() => startDraw("rectangle")}>Rectangle</button>
        <button className="px-3 py-1" onClick={clearAll}>Clear All</button>
      </div>

      <MapSource id="sample" source={{ type: "geojson", data: samplePolygon }}>
        <MapLayer
          id="sample-fill"
          type="fill"
          source="sample"
          paint={{ "fill-color": "#00F", "fill-opacity": 0.3 }}
        />
        <MapLayer
          id="sample-line"
          type="line"
          source="sample"
          paint={{ "line-color": "#00F", "line-width": 2 }}
        />
      </MapSource>
    </>
  );
}

function Example() {
  const token = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map accessToken={token ?? ''} center={[105.8, 21.0]} zoom={5}>
        <MapContent />
      </Map>
    </div>
  );
}

export default Example;