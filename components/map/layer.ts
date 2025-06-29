import type { LayerProps } from "react-map-gl/mapbox";
// components/map/layers.ts
export const fillLayer:LayerProps = {
    id: "zone-fills",
    type: "fill",
    source: "zones",
    paint: {
      "fill-color": [
        "match",
        ["get", "category"],
        "home", "#4CAF50",
        "danger", "#F44336",
        "WS", "#2196F3",
        "#cccccc",
      ],
      "fill-opacity": 0.5,
    },
  };
  
  export const borderLayer:LayerProps = {
    id: "zone-borders",
    type: "line",
    source: "zones",
    paint: {
      "line-color": "#000",
      "line-width": 1,
    },
  };
  
  export const labelLayer:LayerProps = {
    id: "zone-labels",
    type: "symbol",
    source: "zones",
    layout: {
      "text-field": ["get", "name"],
      "text-size": 12,
      "text-anchor": "center",
    },
    paint: {
      "text-color": "#111",
      "text-halo-width": 1,
      "text-halo-color": "#fff",
      "text-halo-blur": 0.5,
      "text-opacity": 1,
    },
  };
  