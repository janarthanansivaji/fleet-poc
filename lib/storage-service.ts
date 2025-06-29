// Local Storage CRUD Service

class StorageService {
  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage', error);
    }
  }

  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error('Error getting item from localStorage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage', error);
    }
  }

  getAllKeys(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting all keys from localStorage', error);
      return [];
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}

const storageService = new StorageService();
export default storageService;
