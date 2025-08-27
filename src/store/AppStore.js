import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { loadScansFromStorage, addScanToStorage, removeScanFromStorage, updateScanInStorage } from '../utils';
import { getStoredSubjects, addNewSubject, removeSubject } from '../utils';
import FirebaseService from '../services/FirebaseService';

// Initial state
const initialState = {
  capturedImage: null,
  recognizedText: null,
  isProcessing: false,
  isLoading: true, // Add loading state for app initialization
  savedScans: [],
  subjects: [], // Add subjects to global state
  error: null,
  isAuthenticated: false, // Add authentication state
  isFirebaseReady: false,
  isOffline: false,
};

// Action types
const ACTIONS = {
  SET_CAPTURED_IMAGE: 'SET_CAPTURED_IMAGE',
  SET_RECOGNIZED_TEXT: 'SET_RECOGNIZED_TEXT',
  SET_PROCESSING: 'SET_PROCESSING',
  SET_LOADING: 'SET_LOADING',
  ADD_SCAN: 'ADD_SCAN',
  DELETE_SCAN: 'DELETE_SCAN',
  UPDATE_SCAN: 'UPDATE_SCAN',
  LOAD_SCANS: 'LOAD_SCANS',
  LOAD_SUBJECTS: 'LOAD_SUBJECTS',
  ADD_SUBJECT: 'ADD_SUBJECT',
  REMOVE_SUBJECT: 'REMOVE_SUBJECT',
  SET_ERROR: 'SET_ERROR',
  RESET_APP: 'RESET_APP',
  SET_FIREBASE_READY: 'SET_FIREBASE_READY',
  SET_OFFLINE: 'SET_OFFLINE',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CAPTURED_IMAGE:
      return { ...state, capturedImage: action.payload };
    case ACTIONS.SET_RECOGNIZED_TEXT:
      return { ...state, recognizedText: action.payload };
    case ACTIONS.SET_PROCESSING:
      return { ...state, isProcessing: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.ADD_SCAN:
      return {
        ...state,
        savedScans: [action.payload, ...state.savedScans]
      };
    case ACTIONS.DELETE_SCAN:
      return {
        ...state,
        savedScans: state.savedScans.filter(scan => scan.timestamp !== action.payload.timestamp)
      };
    case ACTIONS.UPDATE_SCAN:
      return {
        ...state,
        savedScans: state.savedScans.map(scan =>
          scan.timestamp === action.payload.oldScan.timestamp ? action.payload.updatedScan : scan
        )
      };
    case ACTIONS.LOAD_SCANS:
      return {
        ...state,
        savedScans: action.payload
      };
    case ACTIONS.LOAD_SUBJECTS:
      return {
        ...state,
        subjects: action.payload
      };
    case ACTIONS.ADD_SUBJECT:
      return {
        ...state,
        subjects: [...state.subjects, action.payload].sort()
      };
    case ACTIONS.REMOVE_SUBJECT:
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject !== action.payload)
      };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_FIREBASE_READY:
      return { ...state, isFirebaseReady: action.payload };
    case ACTIONS.SET_OFFLINE:
      return { ...state, isOffline: action.payload };
    case ACTIONS.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case ACTIONS.RESET_APP:
      return {
        ...state,
        capturedImage: null,
        recognizedText: null,
        error: null,
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { hasAllPermissions, permissionsLoading, requestAllPermissions, cameraPermission, mediaLibraryPermission } = usePermissions();

  // Initialize app and check permissions
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load local data
        console.log('Loading local data...');
        const scans = await loadScansFromStorage();
        const subjects = await getStoredSubjects();
        dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
        dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: subjects });
      } catch (error) {
        console.error('Error loading local data:', error);
      } finally {
        // App initialization complete
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeApp();
  }, []);

  // Actions
  const actions = useMemo(() => ({
    setCapturedImage: (image) => dispatch({ type: ACTIONS.SET_CAPTURED_IMAGE, payload: image }),
    setRecognizedText: (text) => dispatch({ type: ACTIONS.SET_RECOGNIZED_TEXT, payload: text }),
    setProcessing: (processing) => dispatch({ type: ACTIONS.SET_PROCESSING, payload: processing }),
    addScan: async (scan) => {
      try {
        // Add to local storage first (for offline support)
        await addScanToStorage(scan);

        // Try to add to Firebase if online
        if (state.isFirebaseReady && !state.isOffline) {
          const firebaseId = await FirebaseService.addScan(scan);
          scan.firebaseId = firebaseId;
        }

        dispatch({ type: ACTIONS.ADD_SCAN, payload: scan });
      } catch (error) {
        console.error('Error adding scan:', error);
        // Still add locally even if Firebase fails
        dispatch({ type: ACTIONS.ADD_SCAN, payload: scan });
        await addScanToStorage(scan);
      }
    },
    deleteScan: async (scan) => {
      try {
        // Remove from local storage
        await removeScanFromStorage(scan);

        // Try to remove from Firebase if online
        if (state.isFirebaseReady && !state.isOffline && scan.firebaseId) {
          await FirebaseService.deleteScan(scan.firebaseId);
        }

        dispatch({ type: ACTIONS.DELETE_SCAN, payload: scan });
      } catch (error) {
        console.error('Error deleting scan:', error);
        // Still remove locally even if Firebase fails
        dispatch({ type: ACTIONS.DELETE_SCAN, payload: scan });
        await removeScanFromStorage(scan);
      }
    },
    updateScan: async (oldScan, updatedScan) => {
      try {
        // Update local storage
        await updateScanInStorage(oldScan, updatedScan);

        // Try to update Firebase if online
        if (state.isFirebaseReady && !state.isOffline && oldScan.firebaseId) {
          await FirebaseService.updateScan(oldScan.firebaseId, updatedScan);
          updatedScan.firebaseId = oldScan.firebaseId;
        }

        dispatch({ type: ACTIONS.UPDATE_SCAN, payload: { oldScan, updatedScan } });
      } catch (error) {
        console.error('Error updating scan:', error);
        // Still update locally even if Firebase fails
        dispatch({ type: ACTIONS.UPDATE_SCAN, payload: { oldScan, updatedScan } });
        await updateScanInStorage(oldScan, updatedScan);
      }
    },
    loadScans: async () => {
      if (state.isFirebaseReady && !state.isOffline) {
        const scans = await FirebaseService.getScans();
        dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
      } else {
        const scans = await loadScansFromStorage();
        dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
      }
    },
    addSubject: async (subjectName) => {
      try {
        // Add to local storage first
        const result = await addNewSubject(subjectName, state.subjects);
        if (!result.success) {
          return result;
        }

        // Try to add to Firebase if online
        if (state.isFirebaseReady && !state.isOffline) {
          await FirebaseService.addSubject(subjectName);
        }

        dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        return result;
      } catch (error) {
        console.error('Error adding subject:', error);
        // Fallback to local only
        const result = await addNewSubject(subjectName, state.subjects);
        if (result.success) {
          dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        }
        return result;
      }
    },
    removeSubject: async (subjectName) => {
      try {
        // Remove from local storage
        const result = await removeSubject(subjectName, state.subjects);
        if (!result.success) {
          return result;
        }

        // Try to remove from Firebase if online
        if (state.isFirebaseReady && !state.isOffline) {
          await FirebaseService.deleteSubject(subjectName);
        }

        dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        return result;
      } catch (error) {
        console.error('Error removing subject:', error);
        // Fallback to local only
        const result = await removeSubject(subjectName, state.subjects);
        if (result.success) {
          dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        }
        return result;
      }
    },
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    resetApp: () => dispatch({ type: ACTIONS.RESET_APP }),
    requestPermissions: requestAllPermissions,
    // Authentication actions
    signIn: (user) => {
      console.log('User signed in:', user?.email || 'Unknown');
      dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: true });
    },
    signOut: () => {
      console.log('User signed out');
      dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: false });
    },
  }), [state.subjects]);

  const value = useMemo(() => ({
    ...state,
    ...actions,
    hasPermissions: hasAllPermissions(), // Expose permissions status
  }), [state, actions]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
