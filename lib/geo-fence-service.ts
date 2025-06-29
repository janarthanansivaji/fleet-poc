import storageService from "./storage-service";

export interface GeoFence {
  id: string;
  locationName: string;
  category: string;
  createdAt:Date;
  feature?: any; // GeoJSON Feature
}

const GEO_FENCE_KEY = "geoFences";

function generateId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
  );
}

class GeoFenceService {
  saveGeoFence(locationName: string, category: string): GeoFence {
    const geoFence: GeoFence = {
      id: generateId(),
      locationName,
      category,
      createdAt:new Date()
    };
    const existing = storageService.getItem<GeoFence[]>(GEO_FENCE_KEY) || [];
    const updated = [...existing, geoFence];
    storageService.setItem(GEO_FENCE_KEY, updated);
    return geoFence;
  }

  saveGeoFenceWithGeometry(locationName: string, category: string, feature: any): GeoFence {
    const geoFence: GeoFence = {
      id: generateId(),
      locationName,
      category,
      feature,
      createdAt:new Date()
    };
    const existing = storageService.getItem<GeoFence[]>(GEO_FENCE_KEY) || [];
    const updated = [...existing, geoFence];
    storageService.setItem(GEO_FENCE_KEY, updated);
    return geoFence;
  }

  getAllGeoFences(): GeoFence[] {
    const fences = storageService.getItem<GeoFence[]>(GEO_FENCE_KEY) || [];
    return fences.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  deleteGeoFenceById(id: string) {
    const all = this.getAllGeoFences();
    const updated = all.filter(zone => zone.id !== id);
    storageService.setItem(GEO_FENCE_KEY, updated);
  }
}

const geoFenceService = new GeoFenceService();
export default geoFenceService;
