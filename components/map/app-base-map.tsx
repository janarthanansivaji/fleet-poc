"use client";
import { ReactNode, MutableRefObject, RefObject, useEffect } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  MapRef,
} from "react-map-gl/mapbox";
import { useSidebar } from "../ui/sidebar";

type BaseMapProps = {
  children?: ReactNode;
  mapRef?: RefObject<MapRef | null>;
};

export default function AppBaseMap({ children, mapRef }: BaseMapProps) {
  const { state } = useSidebar();
  useEffect(() => {
    // Assume `sidebarOpen` is a boolean state that changes on collapse/expand
    const timeout = setTimeout(() => {
      mapRef?.current?.resize();
    }, 300); // Delay slightly to allow layout to settle
  
    return () => clearTimeout(timeout);
  }, [state]);
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
