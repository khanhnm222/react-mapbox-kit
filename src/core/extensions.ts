/**
 * Mapbox-GL plugin - layer group
 *
 * Reference from https://github.com/mapbox/mapbox-gl-layer-groups
 */
import mapboxgl, { CustomLayerInterface } from "mapbox-gl";

/**
 * see doc: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/
 *
 * @interface LayerDefinition
 */
interface LayerDefinition {
  [p: string]: unknown;
}

// Augment mapbox-gl with our extra methods
declare module "mapbox-gl" {
  interface Map {
    addLayerGroup(groupId: string, options?: { beforeId?: string }): void;
    removeLayerGroup(groupId: string): void;
    getLayerGroupFirstLayerId(groupId: string): string | undefined;
    getLayerGroupLastLayerId(groupId: string): string | undefined;
    addLayerToGroup(
      groupId: string,
      layer: LayerDefinition | CustomLayerInterface,
      beforeId?: string
    ): void;
    getLayerGroupLayersId(groupId: string): string[];
    moveLayerGroup(groupId: string, beforeId?: string): void;
  }
}

function getLayerGroupPlaceholderLayerId(groupId: string): string {
  return `${groupId}^placeholder`;
}

function isLayer(map: mapboxgl.Map, id: string): boolean {
  return !!map.getLayer(id);
}

function getLayerGroupId(map: mapboxgl.Map, layerId: string): string | undefined {
  return (map.getLayer(layerId) as any)?.metadata?.group;
}

function getLayerIdFromIndex(map: mapboxgl.Map, index: number): string | undefined {
  if (index === -1) return undefined;
  const layers = map.getStyle().layers || [];
  return layers[index]?.id;
}

function normalizeBeforeId(
  map: mapboxgl.Map,
  beforeId: string | undefined
): string | undefined {
  if (beforeId && !isLayer(map, beforeId)) {
    return map.getLayerGroupFirstLayerId(beforeId);
  } else if (beforeId && getLayerGroupId(map, beforeId)) {
    return map.getLayerGroupFirstLayerId(getLayerGroupId(map, beforeId)!);
  } else {
    return beforeId;
  }
}

function getLayerGroupFirstLayerIndex(map: mapboxgl.Map, groupId: string): number {
  const layers = map.getStyle().layers || [];
  for (let i = 0; i < layers.length; i++) {
    if ((layers[i] as any).metadata?.group === groupId) {
      return i;
    }
  }
  return -1;
}

function getLayerGroupLastLayerIndex(map: mapboxgl.Map, groupId: string): number {
  const layers = map.getStyle().layers || [];
  let i = getLayerGroupFirstLayerIndex(map, groupId);
  if (i === -1) return -1;
  while (i < layers.length && (layers[i] as any).metadata?.group === groupId) i++;
  return i - 1;
}

/**
 * Add a layer group
 */
function addLayerGroup(
  this: mapboxgl.Map,
  groupId: string,
  { beforeId }: { beforeId?: string } = {}
): void {
  if (isLayer(this, getLayerGroupPlaceholderLayerId(groupId))) {
    throw new Error('"groupId" already exists!');
  }

  const beforeLayerId = normalizeBeforeId(this, beforeId);
  if (beforeId && !beforeLayerId) {
    throw new Error('"beforeId" is not a layer id nor a layer group id!');
  }

  const groupPlaceholderLayer = {
    id: getLayerGroupPlaceholderLayerId(groupId),
    type: "background",
    layout: { visibility: "none" },
    metadata: { group: groupId },
  };

  this.addLayer(groupPlaceholderLayer as any, beforeLayerId);
}
mapboxgl.Map.prototype.addLayerGroup = addLayerGroup;

/**
 * Remove a layer group and all its layers
 */
function removeLayerGroup(this: mapboxgl.Map, groupId: string): void {
  if (!isLayer(this, getLayerGroupPlaceholderLayerId(groupId))) {
    throw new Error('"groupId" does not exists!');
  }

  const layers = this.getStyle().layers || [];
  for (let i = 0; i < layers.length; i++) {
    if ((layers[i] as any).metadata?.group === groupId) {
      this.removeLayer(layers[i].id);
    }
  }
}
mapboxgl.Map.prototype.removeLayerGroup = removeLayerGroup;

/**
 * Get the id of the first layer in a group
 */
function getLayerGroupFirstLayerId(
  this: mapboxgl.Map,
  groupId: string
): string | undefined {
  return getLayerIdFromIndex(this, getLayerGroupFirstLayerIndex(this, groupId));
}
mapboxgl.Map.prototype.getLayerGroupFirstLayerId = getLayerGroupFirstLayerId;

/**
 * Get the id of the last layer in a group
 */
function getLayerGroupLastLayerId(
  this: mapboxgl.Map,
  groupId: string
): string | undefined {
  return getLayerIdFromIndex(this, getLayerGroupLastLayerIndex(this, groupId));
}
mapboxgl.Map.prototype.getLayerGroupLastLayerId = getLayerGroupLastLayerId;

/**
 * Add a layer to a group
 */
function addLayerToGroup(
  this: mapboxgl.Map,
  groupId: string,
  layer: LayerDefinition | CustomLayerInterface,
  beforeId?: string
): void {
  if (
    beforeId &&
    (!isLayer(this, beforeId) || getLayerGroupId(this, beforeId) !== groupId)
  ) {
    throw new Error('"beforeId" must be the id of a layer within the same group');
  } else if (!beforeId) {
    const lastLayerIndex = getLayerGroupLastLayerIndex(this, groupId);
    if (lastLayerIndex === -1) {
      throw new Error(`the "${groupId}" layer group does not exist!`);
    }
    beforeId = getLayerIdFromIndex(this, lastLayerIndex + 1);
  }

  this.addLayer(
    {
      ...layer,
      metadata: {
        ...(layer as any).metadata,
        group: groupId,
      },
    } as any,
    beforeId
  );
}
mapboxgl.Map.prototype.addLayerToGroup = addLayerToGroup;

/**
 * Get all layer ids in a group
 */
function getLayerGroupLayersId(this: mapboxgl.Map, groupId: string): string[] {
  const ids: string[] = [];
  const layers = this.getStyle().layers || [];
  layers.forEach((layer) => {
    if ((layer as any).metadata?.group === groupId) {
      ids.push(layer.id);
    }
  });
  return ids;
}
mapboxgl.Map.prototype.getLayerGroupLayersId = getLayerGroupLayersId;

/**
 * Move a layer group before another layer (or group)
 */
function moveLayerGroup(
  this: mapboxgl.Map,
  groupId: string,
  beforeId?: string
): void {
  const beforeLayerId = normalizeBeforeId(this, beforeId);
  const layers = this.getStyle().layers || [];
  for (let i = 0; i < layers.length; i++) {
    if ((layers[i] as any).metadata?.group === groupId) {
      this.moveLayer(layers[i].id, beforeLayerId);
    }
  }
}
mapboxgl.Map.prototype.moveLayerGroup = moveLayerGroup;
