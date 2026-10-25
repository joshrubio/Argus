"use client";

import { useEffect, useRef } from "react";
import { Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { AssetSnapshot } from "@/lib/types";
import { AO_CENTER, AO_ZOOM, PATROL_RINGS, SENSOR_POSITIONS } from "@/lib/simulation";
import { circleRingCoords } from "@/lib/geo";
import { STATUS_VAR } from "@/lib/status";

// Known MapLibre + Turbopack bug: the library's default worker loading
// breaks under Turbopack in both dev and production, so the worker
// script is vendored into /public and wired up here, at module scope,
// before the first Map is constructed.
setWorkerUrl("/maplibre-gl-worker.mjs");

// Free, keyless, open basemap tiles — no Mapbox token required. The map
// stays dark regardless of the site's light/dark toggle, the same way a
// radar or sonar scope would: it's an operational display, not a themed
// page panel. Attribution per CARTO's terms is left enabled below.
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

interface MapViewProps {
  assets: AssetSnapshot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ assets, selectedId, onSelect }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, { marker: Marker; el: HTMLDivElement }>>(
    new globalThis.Map()
  );
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [AO_CENTER.lng, AO_CENTER.lat],
      zoom: AO_ZOOM,
    });
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => addRings(map));

    return () => {
      // Remove tracked markers in the SAME cleanup that removes the map —
      // otherwise React 18 StrictMode's double-invoked effect in dev
      // orphans the first set of marker DOM nodes. This deliberately reads
      // markersRef.current at cleanup time (populated by the separate
      // marker-sync effect below), not at mount time, so disable the
      // "capture a snapshot" suggestion here.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      for (const { marker } of markersRef.current.values()) marker.remove();
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const asset of assets) {
      let entry = markersRef.current.get(asset.id);
      if (!entry) {
        const el = document.createElement("div");
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current(asset.id);
        });
        const marker = new Marker({ element: el, anchor: "center" })
          .setLngLat([asset.lng, asset.lat])
          .addTo(map);
        entry = { marker, el };
        markersRef.current.set(asset.id, entry);
      } else {
        entry.marker.setLngLat([asset.lng, asset.lat]);
      }
      renderMarkerEl(entry.el, asset, asset.id === selectedId);
    }
  }, [assets, selectedId]);

  return <div ref={containerRef} className="h-full w-full" />;
}

function addRings(map: MapLibreMap) {
  const patrolFeatures = PATROL_RINGS.map((r) => ({
    type: "Feature" as const,
    properties: { sector: r.sector },
    geometry: { type: "LineString" as const, coordinates: circleRingCoords(r, r.radiusKm) },
  }));
  map.addSource("patrol-rings", {
    type: "geojson",
    data: { type: "FeatureCollection", features: patrolFeatures },
  });
  map.addLayer({
    id: "patrol-rings-line",
    type: "line",
    source: "patrol-rings",
    paint: {
      "line-color": "#f2622e",
      "line-width": 1,
      "line-opacity": 0.35,
      "line-dasharray": [2, 3],
    },
  });

  const sensorFeatures = SENSOR_POSITIONS.map((s) => ({
    type: "Feature" as const,
    properties: { sector: s.sector },
    geometry: { type: "LineString" as const, coordinates: circleRingCoords(s, 0.6) },
  }));
  map.addSource("sensor-rings", {
    type: "geojson",
    data: { type: "FeatureCollection", features: sensorFeatures },
  });
  map.addLayer({
    id: "sensor-rings-line",
    type: "line",
    source: "sensor-rings",
    paint: { "line-color": "#5b8def", "line-width": 1, "line-opacity": 0.3 },
  });
}

function renderMarkerEl(el: HTMLDivElement, asset: AssetSnapshot, selected: boolean) {
  const color = STATUS_VAR[asset.status];
  el.style.position = "relative";
  el.style.width = "18px";
  el.style.height = "18px";
  el.style.cursor = "pointer";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.borderRadius = selected ? "999px" : "0";
  el.style.outline = selected ? `2px solid ${color}` : "none";
  el.style.outlineOffset = "4px";
  el.title = `${asset.callsign} — ${asset.status}`;

  if (asset.kind === "uav") {
    el.innerHTML = `<div style="
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 12px solid ${color};
      transform: rotate(${asset.heading}deg);
      filter: drop-shadow(0 0 3px ${color});
    "></div>`;
  } else {
    el.innerHTML = `<div style="
      width: 12px; height: 12px;
      background: ${color};
      border-radius: 3px;
      box-shadow: 0 0 0 2px rgba(0,0,0,0.35), 0 0 6px ${color};
    "></div>`;
  }
}
