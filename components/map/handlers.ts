// components/map/handlers.ts
import type { MapMouseEvent } from 'mapbox-gl';
import geoFenceService from "@/lib/geo-fence-service";

// export const handleMapClick = (event: MapMouseEvent) => {
//   const features = event.features;
//   if (!features?.length) return;

//   const feature = features[0];
//   const props = feature.properties;
//   alert(`Zone: ${props?.name}\nCategory: ${props?.category}`);
// };


export const getGeoJsonFromLocal = () => {
  return {
    type: "FeatureCollection" as const,
    features: geoFenceService.getAllGeoFences().map((f) => ({
      type: "Feature" as const,
      geometry: f.feature.geometry,
      properties: {
        name: f.locationName,
        category: f.category,
      },
    })),
  };
};
