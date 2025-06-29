"use client";

import { useRef, useState, useEffect } from "react";
import { Marker, MapRef, Source, Layer } from "react-map-gl/mapbox";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowRightCircle,
  Car,
  CarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronRightCircle,
  Send,
  SendHorizonal,
} from "lucide-react";
import AppBaseMap from "@/components/map/app-base-map";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Title } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { vehicleList } from "@/lib/utils";



export default function VehicleTrackingPage() {
  const mapRef = useRef<MapRef | null>(null);
  const [filterdVehicles, setFilterdvehicles] = useState<any[]>(vehicleList);
  const [selectedVin, setSelectedVin] = useState("");
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [selectdVehicle, setSelectedVehicle] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [open, setOpen] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [tripLinePath, setTripLinePath] = useState<any>(null);

  useEffect(() => {
    if (!activeTrip || activeTrip == null) return;
    setAnimationIndex(0);
    setIsLiveTracking(false);
    setCurrentLocation(null);
    if (activeTrip?.routePath && activeTrip?.routePath.length > 0) {
      let path = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [...activeTrip.routePath],
        },
      };
      mapRef.current?.flyTo({
        center: activeTrip?.routePath[0],
        speed: 0.7,
      });
      console.log("path is", path);
      setTripLinePath(path);
    }
  }, [activeTrip]);

  const handleListVehciles = () => {
    if (selectedVin) {
      const _filterdVehicles = vehicleList.filter(
        (vech) => vech.vin === selectedVin
      );
      setFilterdvehicles(_filterdVehicles);
    } else {
      setFilterdvehicles([...vehicleList]);
    }
  };
  const handleSelectedTrip = (trip: any) => {
    setAnimationIndex(0);
    setIsLiveTracking(false);
    setCurrentLocation(null);
    setActiveTrip(trip);
  };
  useEffect(() => {
    // const vehicle = vehicleList.find((v) => v.vin === selectedVin);
    if (!selectdVehicle || !isLiveTracking) return;
    if (selectdVehicle.livePath.length < 1) return;
    const interval = setInterval(() => {
      setAnimationIndex((prev) => {
        let nextIndex = prev + 1;
        if (nextIndex < selectdVehicle.livePath.length) {
          const _currentLocation = selectdVehicle.livePath[nextIndex] as [
            number,
            number
          ];
          setCurrentLocation(_currentLocation);

          //   mapRef.current?.flyTo({
          //     center: _currentLocation,
          //     zoom: 15,
          //     speed: 0.4,
          //   });
          mapRef.current?.easeTo({
            center: _currentLocation,
            // zoom: 15,
            duration: 1000, // in ms
          });
          return nextIndex;
        } else {
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveTracking]);

  useEffect(() => {
    if (!selectdVehicle || !selectdVehicle?.livePath) return;
    setAnimationIndex(0);
    setIsLiveTracking(false);
    setCurrentLocation(selectdVehicle?.livePath[0] as [number, number]);
    mapRef.current?.flyTo({
      center: selectdVehicle?.livePath[0] as [number, number],
      speed: 1,
      curve: 1.7,
    });
  }, [selectdVehicle]);

  const handleLiveTracking = () => {
    if (!isLiveTracking) {
      // Start: reset to beginning

      if (selectdVehicle && selectdVehicle.livePath.length > 0) {
        setAnimationIndex(0);
        //   setCurrentLocation(vehicle.livePath[0] as [number, number]);
        setIsLiveTracking(true);
        setActiveTrip(null);
        setTripLinePath(null);

        mapRef.current?.flyTo({
          center: selectdVehicle.livePath[0] as [number, number],
          zoom: 15,
        });
      }
    } else {
      // Stop
      setIsLiveTracking(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-20px)]  flex-row gap-4   w-full overflow-hidden">
      <div className="flex flex-col gap-4 mt-4  px-2 pt-5  h-full overflow-hidden ">
        <div className="top-0 flex flex-col gap-2 sticky">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[220px] justify-between"
              >
                {selectedVin
                  ? `${selectedVin} (${
                      vehicleList.find((v) => v.vin === selectedVin)?.type ?? ""
                    })`
                  : "Select Vehicle VIN"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search VIN..." />
                <CommandList>
                  <CommandEmpty>No vehicles found.</CommandEmpty>
                  {vehicleList.map((vehicle) => (
                    <CommandItem
                      key={vehicle.vin}
                      value={vehicle.vin}
                      onSelect={(currentValue) => {
                        setSelectedVin(currentValue);
                        setAnimationIndex(0);
                        setCurrentLocation(null);
                        setIsLiveTracking(false);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedVin === vehicle.vin
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {vehicle.vin} ({vehicle.type})
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button disabled={!selectedVin} onClick={handleListVehciles}>
            {" "}
            View Vehicle
          </Button>
        </div>
        <div>
          <Button
            variant={"link"}
            onClick={() => {
              setSelectedVin("");
              setSelectedVehicle(null);
              setCurrentLocation(null);
              setFilterdvehicles(vehicleList);
            }}
          >
            View All
          </Button>
        </div>
        <Separator />
        <ListVehicles
          vehchicles={filterdVehicles}
          onSelectedVehicle={(veh: any) => {
            setSelectedVehicle(veh);
          }}
        />
      </div>
      <div className="flex-1 rounded  overflow-hidden">
        <div className="h-screen relative m-1  ">
          <AppBaseMap mapRef={mapRef}>
            {currentLocation &&
              Array.isArray(currentLocation) &&
              !isNaN(currentLocation[0]) &&
              !isNaN(currentLocation[1]) && (
                <Marker
                  longitude={currentLocation[0]}
                  latitude={currentLocation[1]}
                  anchor="center"
                >
                  <div className="size-8  rounded-full bg-green-600 border-green-700 border-2 text-center align-baseline flex p-1">
                    <SendHorizonal className="size-6 text-white -rotate-90" />
                  </div>
                </Marker>
              )}

            {tripLinePath && activeTrip?.tripId && (
              <Source type="geojson" data={tripLinePath}>
                <Marker
                  longitude={activeTrip.routePath[0][0]}
                  latitude={activeTrip.routePath[0][1]}
                  anchor="center"
                >
                  <div className="size-4  rounded-full bg-red-500 border-red-700 border-2 text-center align-baseline flex p-1">
                    {/* <SendHorizonal className="size-6 text-white -rotate-90" /> */}
                  </div>
                </Marker>
                <Marker
                  longitude={
                    activeTrip.routePath[activeTrip.routePath.length - 1][0]
                  }
                  latitude={
                    activeTrip.routePath[activeTrip.routePath.length - 1][1]
                  }
                  anchor="center"
                >
                  <div className="size-4  rounded-full bg-green-500 border-green-700 border-2 text-center align-baseline flex p-1">
                    {/* <SendHorizonal className="size-6 text-white -rotate-90" /> */}
                  </div>
                </Marker>
                <Layer
                  id={`route-line-${activeTrip.tripId}`}
                  type="line"
                  paint={{
                    "line-color": "#3b82f6",
                    "line-width": 4,
                  }}
                />
              </Source>
            )}
          </AppBaseMap>
          {selectdVehicle && (
            <div className="bg-gray-100/75 absolute flex flex-col gap-2  z-20 w-1/3 top-2 left-2 h-full bottom-2  overflow-y-hidden shadow-md p-2">
              <div className="flex">
                <Button
                  className="w-full "
                  variant={isLiveTracking ? "destructive" : "default"}
                  onClick={handleLiveTracking}
                >
                  {isLiveTracking
                    ? "Stop Live Tracking"
                    : "Start Live Tracking"}
                </Button>
                <Separator className="my-2" />
              </div>
            
              <ScrollArea className="h-72  rounded-md border">
              <div className="text-sm font-bold bg-white border-b border-dotted p-2">
              <p>Trip History</p>
              </div>
                
                <VehicleTripHistory
                  onActiveTripChange={handleSelectedTrip}
                  selectedVehicle={selectdVehicle}
                  mapRef={mapRef.current}
                />
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ListVehicles = ({
  vehchicles,
  onSelectedVehicle,
}: {
  vehchicles: any[];
  onSelectedVehicle: (selectedVehicle: any) => void;
}) => {
  const [activeVehicle, setActiveVehilce] = useState<any>();
  return (
    <ScrollArea className="h-4/5 w-full">
      {vehchicles.map((veh, idx) => {
        return (
          <div
            className={`${
              activeVehicle?.vin == veh.vin ? "bg-accent shadow-md" : ""
            } my-2 p-2 cursor-pointer`}
            key={idx}
          >
            <p
              className="flex flex-row justify-between text-sm m-0 p-0 "
              onClick={() => {
                onSelectedVehicle(veh);
                setActiveVehilce(veh);
              }}
            >
              {veh?.vin || "-"}
              <ChevronRightCircle />
            </p>
          </div>
        );
      })}
    </ScrollArea>
  );
};

const VehicleTripHistory = ({
  selectedVehicle,
  mapRef,
  onActiveTripChange,
}: {
  selectedVehicle: any;
  mapRef: MapRef | null;
  onActiveTripChange: (activeTrip: any) => void;
}) => {
  const [activeTrip, setActiveTrip] = useState<any>(null);
  useEffect(() => {
    onActiveTripChange(activeTrip);
  }, [activeTrip]);
  return (
    <div className="flex flex-col gap-2 w-full">
      {selectedVehicle?.tripHistory.map((trip: any, idx: number) => {
        return (
          <div
            key={idx}
            onClick={() => setActiveTrip(trip)}
            className={`flex flex-col w-full h-full p-2${
              trip.tripId == activeTrip?.tripId
                ? " bg-accent-foreground text-white shadow shadow-2xl rounded"
                : " bg-white"
            }`}
          >
            <p className="p-0 m-0 text-xs text-red-300 font-medium border-b my-2">
              TripId : {trip.tripId}
            </p>
            <div className="flex justify-between items-center w-full max-w-md px-4 mx-auto">
              <div className="flex flex-col items-center">
                <span className="text-sm  mb-1">Chennai</span>

                <div className="w-4 h-4 bg-green-600 rounded-full z-10"></div>

                <span className="text-xs text-gray-500 mt-1">10:00 AM</span>
              </div>

              <div className="flex-1 h-0.5 border border-dashed border-gray-500 mx-2"></div>

              <div className="flex flex-col items-center">
                <span className="text-sm  mb-1">Bangalore</span>

                <div className="w-4 h-4 bg-red-600 rounded-full z-10"></div>

                <span className="text-xs text-gray-500 mt-1">02:00 PM</span>
              </div>
            </div>
            <div className="flex gap-2 border-t my-2 p-2 justify-between">
              <div className="flex flex-row gap-2">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>JK</AvatarFallback>
                  </Avatar>
                <div className="flex flex-col gap-1">
                  <p>{trip.driverInformation.driverName}</p>
                  <p className="text-xs leading-0 font-bold tracking-wide text-gray-400">
                    Driver
                  </p>
                </div>
                </div>
                <div className="flex flex-col gap-1">
                <p className="text-xs">{trip.driverInformation.driverMobile}</p>
                <p className="text-xs leading-0 font-bold tracking-wide text-gray-400">
                  Mobile
                </p>
              </div>
                
              </div>
            
            </div>
        );
      })}
    </div>
  );
};
