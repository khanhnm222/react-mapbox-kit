import React, { createContext, useContext } from "react";
import { Map as MbMap } from "mapbox-gl";

export type MapContextType = { map: MbMap | null };
export const MapContext = createContext<MapContextType>({ map: null });

export const useMapContext = () => useContext(MapContext);
