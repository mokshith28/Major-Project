import AsyncStorage from '@react-native-async-storage/async-storage';

const SCANS_STORAGE_KEY = 'savedScans';

// Load scans from AsyncStorage
export const loadScansFromStorage = async () => {
  try {
    const stored = await AsyncStorage.getItem(SCANS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error loading scans from storage:', error);
    return [];
  }
};

// Save scans to AsyncStorage
export const saveScansToStorage = async (scans) => {
  try {
    await AsyncStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(scans));
    return true;
  } catch (error) {
    console.error('Error saving scans to storage:', error);
    return false;
  }
};

// Add a single scan to storage
export const addScanToStorage = async (scan) => {
  try {
    const existingScans = await loadScansFromStorage();
    const updatedScans = [scan, ...existingScans];
    return await saveScansToStorage(updatedScans);
  } catch (error) {
    console.error('Error adding scan to storage:', error);
    return false;
  }
};

// Remove a scan from storage
export const removeScanFromStorage = async (scanToRemove) => {
  try {
    const existingScans = await loadScansFromStorage();
    const updatedScans = existingScans.filter(scan => scan.timestamp !== scanToRemove.timestamp);
    return await saveScansToStorage(updatedScans);
  } catch (error) {
    console.error('Error removing scan from storage:', error);
    return false;
  }
};

// Update a scan in storage
export const updateScanInStorage = async (oldScan, updatedScan) => {
  try {
    const existingScans = await loadScansFromStorage();
    const updatedScans = existingScans.map(scan => 
      scan.timestamp === oldScan.timestamp ? updatedScan : scan
    );
    return await saveScansToStorage(updatedScans);
  } catch (error) {
    console.error('Error updating scan in storage:', error);
    return false;
  }
};
