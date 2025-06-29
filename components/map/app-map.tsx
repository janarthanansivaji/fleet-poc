"use client";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import type { MapMouseEvent } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import geoFenceService from "@/lib/geo-fence-service";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"; // Add this import
import { useEffect, useRef, useState } from "react";
import { Source, Layer, Popup, MapRef } from "react-map-gl/mapbox";
import { getGeoJsonFromLocal } from "./handlers";
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl/mapbox";
import DrawControl from "./draw-control";
import CreateGeoFencingForm from "./create-geo-fencing-form";
import { borderLayer, fillLayer, labelLayer } from "./layer";
import useGeoJson from "@/hooks/use-geojson";
import { Loader2, Trash2 } from "lucide-react";
import ZoneList from "../zone-list";
import AlertPopup from "./alert-popup";
import AppBaseMap from "./app-base-map";
import AppGeoFencingPage from "./geo-fencing-page";

export default function AppMap() {
  const mapRef = useRef<MapRef | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [drawnFeature, setDrawnFeature] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const handleMapClick = (event: MapMouseEvent) => {
    const features = event.features;
    if (!features?.length) return;
    setSelectedFeature(features[0]);
  };
  const {
    geoJsonData,
    refresh: handleSaveLocation,
    clear: handleClearZones,
  } = useGeoJson();
  // Called when user finishes drawing
  const handleDrawCreate = (e: any) => {
    const feature = e.features[0];
    setDrawnFeature(feature);
    setDialogOpen(true);
  };
  useEffect(() => {
    const loadGeoJson = async () => {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500));
      handleSaveLocation();
      setLoading(false);
    };

    loadGeoJson();
  }, []);

  return (
    <div className="h-[calc(100dvh-100px)] overflow-hidden relative">
       {/* <Map
        ref={(instance) => {
          mapRef.current = instance?.getMap() ?? null;
        }}
        interactiveLayerIds={["zone-fills"]}
        onClick={handleMapClick}
        initialViewState={{
          longitude: 78.15297800152109,
          latitude: 11.68317236404549,
          zoom: 10,
        }}
        onLoad={({ target }) => {
          console.log("map loaded — adding zones");
          // addGeoFenceLayer(target);
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={
          "pk.eyJ1IjoiamFuYTk3cyIsImEiOiJjbWM3bWVqNzgwdmRqMnpwOXI1ZzRpbXZ0In0.ouH3p7skSe3P6I_uj8FEEw"
        }
      >
        <FullscreenControl />
        <GeolocateControl />
        <NavigationControl />
        <DrawControl
          drawRef={drawRef}
          position="top-right"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
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
            className=" w-full !max-w-[400px]"
          >
            <AlertPopup
              zone={selectedFeature}
              onDeleteZone={() => {
                setSelectedFeature(null); // Hide popup
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
      </Map>  */}
      {/* <AppBaseMap></AppBaseMap> */}
      <CreateGeoFencingForm
        dialogOpen={dialogOpen}
        location={drawnFeature}
        onDialogOpenChange={() => setDialogOpen(false)}
        onGeoFenceSaved={() => {
          handleSaveLocation();
          drawRef.current?.deleteAll();
        }}
      />

      <div className="bg-gray-100/75  absolute max-h-4/5  w-1/5 top-3 left-1 overflow-y-auto rounded-lg shadow-md p-2">
        <ZoneList mapRef={mapRef} onZoneSelect={setSelectedFeature} />
      </div>
    </div>
  );
}
