"use client";
import {
  Factory,
  TriangleAlert,
  Wrench,
  Trash2,
  ArrowUp,
  ArrowUpDown,
  BellRing,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";
import AlertsManagement from "./alert-management";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import alertService from "@/lib/alert-service";
import geoFenceService from "@/lib/geo-fence-service";

export default function AlertPopup({
  zone,
  onDeleteZone,
}: {
  zone: any;
  onDeleteZone: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2 flex-col m-2 text-left">
        <p className="font-semibold text-xl border-b text-accent-foreground">
          {zone?.properties?.name}
        </p>

        <div className="flex gap-2 justify-around border-b p-2">
          <div className="flex flex-1 flex-col items-center p-1 justify-between ">
            <Label className="font-extrabold ">
              <ArrowUp className="size-4 text-orange-700" />
              100
            </Label>
            <Label className="text-xs text-orange-700 tracking-wide">
              In Alerts
            </Label>
          </div>
          <div className="flex flex-1 flex-col items-center p-1 border-x ">
            <Label className="font-extrabold ">
              <ArrowUp className="size-4 text-green-700" />
              100
            </Label>
            <Label className="text-xs text-green-700 tracking-wide">
              Out Alerts
            </Label>
          </div>
          <div className="flex flex-1 flex-col items-center p-1">
            <Label className="font-extrabold ">
              <ArrowUpDown className="size-4 text-blue-700" />
              100
            </Label>
            <Label className="text-xs text-blue-700 tracking-wide">
              In/Out
            </Label>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <BellRing /> View Alerts
          </Button>
          <DeleteAlert zone={zone} onDeleteZoneHandler={onDeleteZone} />
        </div>
      </div>

      <AlertsManagement
        dialogOpen={dialogOpen}
        onDialogOpenChange={setDialogOpen}
        zone={zone}
      />
    </>
  );
}

const DeleteAlert = ({
  zone,
  onDeleteZoneHandler,
}: {
  zone: any;
  onDeleteZoneHandler: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleDelete = async () => {
    const zoneId = zone?.properties?.id;
    if (!zoneId) return;

    setLoading(true);
    await delay(700); // Simulate delay before deletion
    console.log("first delay completed")
    // Step 1: Delete all alerts related to the zone
    alertService.deleteAlertsByZoneId(zoneId);

    // Step 2: Delete the zone itself
    geoFenceService.deleteGeoFenceById(zoneId);
    await delay(700);
    console.log("called")
    onDeleteZoneHandler(); // close popup + refresh
    setLoading(false);

    // Optional: Trigger a UI refresh if needed (e.g., via callback or state)
    // window.location.reload(); // quick fix — replace with better state update if needed
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The zone -{" "}
            <span className="text-white font-bold bg-red-500 p-1 border rounded">
              {zone?.properties?.name}
            </span>{" "}
            will be permanently deleted, and all alerts associated with this
            zone will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Continue
          </AlertDialogAction> */}
           <Button size={'sm'} onClick={handleDelete} disabled={loading} variant="destructive">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Confirm Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
