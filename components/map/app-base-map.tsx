"use client";
import { ReactNode, MutableRefObject, RefObject } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  MapRef,
} from "react-map-gl/mapbox";

type BaseMapProps = {
  children?: ReactNode;
  mapRef?: RefObject<MapRef | null>;
};

export default function AppBaseMap({ children, mapRef }: BaseMapProps) {
  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 78.15297800152109,
        latitude: 11.68317236404549,
        zoom: 10,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken="pk.eyJ1IjoiamFuYTk3cyIsImEiOiJjbWM3bWVqNzgwdmRqMnpwOXI1ZzRpbXZ0In0.ouH3p7skSe3P6I_uj8FEEw"
    >
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      {children}
    </Map>
  );
}
