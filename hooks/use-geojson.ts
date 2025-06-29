import geoFenceService from "@/lib/geo-fence-service";
import { useCallback, useEffect, useState } from "react";

export default function useGeoJson(){
     const [geoJsonData, setGeoJsonData] = useState({
    type: "FeatureCollection" as const,
    features: geoFenceService.getAllGeoFences().map((f) => ({
      type: "Feature" as const,
      geometry: f.feature.geometry,
      properties: {
        name: f.locationName,
        category: f.category,
      },
    })),
  });
  const refresh = useCallback(() => {
    const features = geoFenceService.getAllGeoFences().map((f) => ({
      type: "Feature" as const,
      geometry: f.feature.geometry,
      properties: {
        name: f.locationName,
        category: f.category,
      },
    }));
    setGeoJsonData({ type: "FeatureCollection", features });
  }, []);
  const clear = () => {
    localStorage.removeItem("GEO_FENCE_KEY");
    setGeoJsonData({ type: "FeatureCollection", features: [] });
  };
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { geoJsonData, refresh, clear };

}