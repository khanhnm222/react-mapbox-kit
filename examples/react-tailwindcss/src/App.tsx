import { MapProvider, PolygonLayer } from "react-mapbox-kit";

const samplePolygon: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[[105, 20], [106, 20], [106, 21], [105, 21], [105, 20]]],
      },
      properties: {},
    },
  ],
};

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapProvider accessToken="YOUR_MAPBOX_TOKEN">
        <PolygonLayer id="test" data={samplePolygon} />
      </MapProvider>
    </div>
  );
}

export default App;
