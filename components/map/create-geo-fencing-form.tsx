import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../ui/dialog";
  import { Input } from "../ui/input";
  import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
  import { Factory, TriangleAlert, Wrench } from "lucide-react";
  import { Button } from "../ui/button";
import { useState } from "react";
import geoFenceService from "@/lib/geo-fence-service";
import { Loader2 } from "lucide-react";


export default function CreateGeoFencingForm ({
    location,
    dialogOpen,
    onDialogOpenChange,
    onGeoFenceSaved,
  }: {
    location: any;
    dialogOpen: boolean;
    onDialogOpenChange: () => void;
    onGeoFenceSaved: () => void;
  })  {
    const [geoLocationName, setGeoLocationName] = useState("");
    const [category, setCategory] = useState("WS");
    const [loading, setLoading] = useState(false);
  
    const handleSave = async () => {
      if (!geoLocationName.trim() || !location) return;
      setLoading(true);
      console.log(location);
      await new Promise((res) => setTimeout(res, 1000)); // Simulate async save
      geoFenceService.saveGeoFenceWithGeometry(
        geoLocationName,
        category,
        location
      );
      setGeoLocationName("");
      setCategory("WS");
      setLoading(false);
      onDialogOpenChange();
      onGeoFenceSaved();
    };
  
    return (
      <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Location Name"
              value={geoLocationName}
              onChange={(e: any) => setGeoLocationName(e.target.value)}
              disabled={loading}
            />
            <ToggleGroup
              value={category}
              onValueChange={setCategory}
              type="single"
              variant={"outline"}
              className="w-full"
            >
              <ToggleGroupItem value="Restricted Zone" className="text-red-700">
                <TriangleAlert /> Restricted Zone
              </ToggleGroupItem>
              <ToggleGroupItem value="School Zone" className="text-green-700">
                <Factory /> School Zone
              </ToggleGroupItem>
              <ToggleGroupItem value="Work Station" className="text-blue-700">
                <Wrench /> Work Station
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <DialogFooter>
            <DialogClose disabled={loading}>Canel</DialogClose>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };