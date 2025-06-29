"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawControl from "@/components/map/draw-control";
import useGeoJson from "@/hooks/use-geojson";
import { Source, Layer, Popup, MapRef } from "react-map-gl/mapbox";
import { borderLayer, fillLayer, labelLayer } from "@/components/map/layer";
import AlertPopup from "@/components/map/alert-popup";
import CreateGeoFencingForm from "@/components/map/create-geo-fencing-form";
import ZoneList from "@/components/zone-list";
import { TriangleAlert, Factory, Wrench } from "lucide-react";
import { Label } from "@/components/ui/label";
import AppBaseMap from "./app-base-map";

export default function AppGeoFencingPage() {
  const mapRef = useRef<MapRef  | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [drawnFeature, setDrawnFeature] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const mapboxMapRef = useRef<mapboxgl.Map | null>(null);

  const {
    geoJsonData,
    refresh: handleSaveLocation,
  } = useGeoJson();

  const handleMapClick = (event: any) => {
    const features = event.features;
    if (!features?.length) return;
    setSelectedFeature(features[0]);
  };

  const handleDrawCreate = (e: any) => {
    const feature = e.features[0];
    setDrawnFeature(feature);
    setDialogOpen(true);
  };

  useEffect(() => {
    handleSaveLocation();
  }, []);

  return (
    <div className="relative p-0  w-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold mt-4 mb-4">Geo Fencing</h1>
        <div className="flex gap-2 justify-around border p-2">
          <div className="flex flex-1 flex-col items-center p-1">
            <Label className="font-extrabold ">
              <TriangleAlert className="size-4 text-red-700" />
              100
            </Label>
            <Label className="text-xs text-red-700 tracking-wide">
              Restricted Zones
            </Label>
          </div>
          <div className="flex flex-1 flex-col items-center p-1 border-x ">
            <Label className="font-extrabold ">
              <Factory className="size-4 text-green-700" />
              100
            </Label>
            <Label className="text-xs text-green-700 tracking-wide">Plant</Label>
          </div>
          <div className="flex flex-1 flex-col items-center p-1">
            <Label className="font-extrabold ">
              <Wrench className="size-4 text-blue-700" />
              100
            </Label>
            <Label className="text-xs text-blue-700 tracking-wide">
              Work Station
            </Label>
          </div>
        </div>
      </div>

      <div className="relative h-[calc(100dvh-150px)]">
        <AppBaseMap mapRef={mapRef} 
     
     >
          <DrawControl
            drawRef={drawRef}
            position="top-right"
            displayControlsDefault={false}
            controls={{ polygon: true, trash: true }}
            defaultMode="simple_select"
            onCreate={handleDrawCreate}
          />
          {selectedFeature && typeof window !== "undefined" && (
            <Popup
              longitude={selectedFeature.geometry.coordinates[0][0][0]}
              latitude={selectedFeature.geometry.coordinates[0][0][1]}
              onClose={() => setSelectedFeature(null)}
              closeOnClick={false}
              anchor="top"
              className="w-full !max-w-[400px]"
            >
              <AlertPopup
                zone={selectedFeature}
                onDeleteZone={() => {
                  setSelectedFeature(null);
                  handleSaveLocation();
                }}
              />
            </Popup>
          )}
          <Source id="zones" type="geojson" data={geoJsonData}>
            <Layer {...fillLayer} />
            <Layer {...borderLayer} />
            <Layer {...labelLayer} />
          </Source>
        </AppBaseMap>

        <CreateGeoFencingForm
          dialogOpen={dialogOpen}
          location={drawnFeature}
          onDialogOpenChange={() => setDialogOpen(false)}
          onGeoFenceSaved={() => {
            handleSaveLocation();
            drawRef.current?.deleteAll();
          }}
        />

        <div className="bg-gray-100/75 absolute max-h-4/5 w-1/5 top-3 left-1 overflow-y-auto rounded-lg shadow-md p-2">
          <ZoneList mapRef={mapRef} onZoneSelect={setSelectedFeature} />
        </div>
      </div>
    </div>
  );
}
