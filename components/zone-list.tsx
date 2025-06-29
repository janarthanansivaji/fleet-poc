'use client'
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import geoFenceService, { GeoFence } from "@/lib/geo-fence-service";
import mapboxgl from "mapbox-gl";
import { MapRef } from "react-map-gl/mapbox";

const categoryColors: Record<string, string> = {
  home: "bg-green-100 text-green-800",
  danger: "bg-red-100 text-red-800",
  WS: "bg-blue-100 text-blue-800",
};

export default function ZoneList({ mapRef,onZoneSelect }: { mapRef: React.RefObject<MapRef | null>;onZoneSelect: (feature: any) => void; }) {
  const zones = geoFenceService.getAllGeoFences();
  const handleCardClick = (zone: GeoFence) => {
    const feature = {
      type: "Feature",
      geometry: zone.feature.geometry,
      properties: {
        name: zone.locationName,
        category: zone.category,
        id:zone.id
      },
    };

    // Fly to zone
    const coordinates = feature.geometry.coordinates?.[0]?.[0]; // First point
    if (coordinates && mapRef.current) {
      mapRef.current.flyTo({ center: coordinates, zoom: 12, duration: 1000 });
    }

    onZoneSelect(feature); // show popup
  };

  if (zones.length === 0) return <p className="text-center text-gray-500">No zones found.</p>;

  return (
    <div className="grid gap-1">
      {zones.map((zone, index) => (
        <Card key={index} className="flex-row items-center justify-between p-4 hover:shadow-md transition"   onClick={() => handleCardClick(zone)}>
          <CardContent className="p-0 flex-1 cursor-pointer">
            <div className="text-lg font-medium">{zone.locationName}</div>
            <div
              className={`inline-block px-2 py-1 mt-1 text-sm rounded ${categoryColors[zone.category] || "bg-gray-100 text-gray-800"}`}
            >
              {zone.category}
            </div>
          </CardContent>
          <ArrowRight className="text-muted-foreground" />
        </Card>
      ))}
    </div>
  );
}
