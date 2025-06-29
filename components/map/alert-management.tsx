"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import alertService, { ZoneAlert } from "@/lib/alert-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicleList } from "@/lib/utils";

interface AlertManagementProps {
  zone: any;
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
}
// Example vehicles (you can fetch dynamically if needed)

export default function AlertsManagement({
  zone,
  dialogOpen,
  onDialogOpenChange,
}: AlertManagementProps) {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<ZoneAlert[]>([]);
  const [vin, setVin] = useState("");
  const [type, setType] = useState<"in" | "out" | "both">("in");
  const [selectedVin, setSelectedVin] = useState("");
  const [alertType, setAlertType] = useState<"in" | "out" | "both">("in");

  useEffect(() => {
    if (zone && dialogOpen) {
      const zoneId = zone?.properties?.id;
      console.log(zoneId)
      if (zoneId) {
        const data = alertService.getAlertsByZone(zoneId);
        setAlerts(data);
      }
    }
  }, [zone, dialogOpen]);
  const handleAddAlert = () => {
    const zoneId = zone?.properties?.id;
console.log(zoneId)
    if (!selectedVin || !alertType || !zoneId) return;

    setLoading(true);
    setTimeout(() => {
      alertService.saveAlert(
        zoneId,
        selectedVin,
        (alertType.charAt(0).toUpperCase() + alertType.slice(1)) as
          | "In"
          | "Out"
          | "Both"
      );
      setAlerts(alertService.getAlertsByZone(zoneId));
      setSelectedVin("");
      setAlertType("in");
      setLoading(false);
    }, 400);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Zone Alerts</DialogTitle>
          <DialogDescription>
            List of vehicle alerts created for this zone.
          </DialogDescription>
        </DialogHeader>
        {/* 🚗 Form */}
        <div className="flex gap-4 py-2 justify-between items-center w-fit">
          <div className="flex flex-col gap-1">
            <Label>Vehicle</Label>
            <Select value={selectedVin} onValueChange={setSelectedVin}>
              <SelectTrigger  className="w-[200px]" >
                <SelectValue placeholder="Select Vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicleList.map((v) => (
                  <SelectItem key={v.vin} value={v.vin}>
                    {v.vin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Alert Type</Label>
            <Select
              value={alertType}
              onValueChange={(v) => setAlertType(v as "in" | "out" | "both")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">In</SelectItem>
                <SelectItem value="out">Out</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="pt-2">
           <Button onClick={handleAddAlert} size={'lg'} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Add
            </Button>
           </div>
        </div>

        <div className="border rounded-md overflow-auto max-h-96">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead>Vehicle VIN</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.vin}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.status === "active" ? "default" : "outline"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
