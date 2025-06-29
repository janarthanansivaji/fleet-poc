"use client"
import AppMap from "@/components/map/app-map";
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Label } from "@/components/ui/label";
import { TriangleAlert, Factory, Wrench } from "lucide-react";
import AppGeoFencingPage from "@/components/map/geo-fencing-page";

export default function GeoFencingPage() {
  return (
    <div className="p-0">
     {/* <div className="flex flex  justify-between mb-2">
     <h1 className="text-2xl font-bold mb-4">Geo Fencing</h1>
      <div className="flex gap-2 justify-around border p-2">
          <div className="flex flex-1 flex-col items-center p-1 justify-between ">
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
     </div> */}
            <AppGeoFencingPage/>

   
    </div>
  );
} 