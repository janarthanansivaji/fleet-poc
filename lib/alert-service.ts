import storageService from "./storage-service";

export interface ZoneAlert {
  id: string;
  zoneId: string;
  vin: string;
  type: "In" | "Out" | "Both";
  status: "active" | "inactive";
  createdAt: Date;
}

const ALERT_KEY = "zoneAlerts";

function generateId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
  );
}

class AlertService {
  saveAlert(zoneId: string, vin: string, type: ZoneAlert["type"]): ZoneAlert {
    const alert: ZoneAlert = {
      id: `AL-${generateId()}`,
      zoneId,
      vin,
      type,
      status: "active",
      createdAt: new Date(),
    };
    console.log("incoming-zone id",zoneId)
    const existing = storageService.getItem<ZoneAlert[]>(ALERT_KEY) || [];
    const updated = [...existing, alert];
    storageService.setItem(ALERT_KEY, updated);
    return alert;
  }

  getAlertsByZone(zoneId: string): ZoneAlert[] {
    const all = storageService.getItem<ZoneAlert[]>(ALERT_KEY) || [];
    return all
      .filter((alert) => alert.zoneId === zoneId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllAlerts(): ZoneAlert[] {
    return (
      storageService.getItem<ZoneAlert[]>(ALERT_KEY) || []
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  updateAlertStatus(alertId: string, status: ZoneAlert["status"]) {
    const alerts = storageService.getItem<ZoneAlert[]>(ALERT_KEY) || [];
    const updated = alerts.map((a) =>
      a.id === alertId ? { ...a, status } : a
    );
    storageService.setItem(ALERT_KEY, updated);
  }

  deleteAlert(alertId: string) {
    const alerts = storageService.getItem<ZoneAlert[]>(ALERT_KEY) || [];
    const updated = alerts.filter((a) => a.id !== alertId);
    storageService.setItem(ALERT_KEY, updated);
  }
  deleteAlertsByZoneId(zoneId: string) {
    const all = this.getAllAlerts();
    const filtered = all.filter(alert => alert.zoneId !== zoneId);
    storageService.setItem(ALERT_KEY, filtered);
  }
}

const alertService = new AlertService();
export default alertService;
