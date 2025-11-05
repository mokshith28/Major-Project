import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import FirebaseService from '../services/FirebaseService';
import NetInfo from '@react-native-community/netinfo';

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
  user: null,
  isFirebaseReady: false,
  isOffline: false,
  isSyncing: false,
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
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  SET_SYNCING: 'SET_SYNCING',
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
    case ACTIONS.SIGN_IN:
      return { ...state, isAuthenticated: true, user: action.payload };
    case ACTIONS.SIGN_OUT:
      return { ...state, isAuthenticated: false, user: null };
    case ACTIONS.RESET_APP:
      return {
        ...state,
        capturedImage: null,
        recognizedText: null,
        error: null,
      };
    case ACTIONS.SET_SYNCING:
      return { ...state, isSyncing: action.payload };
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
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        console.log('Initialized app');
        // Load local data
        // console.log('Loading local data...');
        // const scans = await loadScansFromStorage();
        // const subjects = await getStoredSubjects();
        // dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
        // dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: subjects });
      } catch (error) {
        console.error('Error loading local data:', error);
      } finally {
        // App initialization complete
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeApp();
  }, []);

  // Initialize Firebase
  useEffect(() => {
    const setupFirebase = async () => {
      const ready = await FirebaseService.initialize();
      dispatch({ type: ACTIONS.SET_FIREBASE_READY, payload: ready });
    };
    setupFirebase();
  }, []);

  // Listen for network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (netState) => {
      // const wasOffline = state.isOffline;
      const isNowOnline = netState.isConnected;

      dispatch({ type: ACTIONS.SET_OFFLINE, payload: !isNowOnline });

      // If we were offline and now online, try syncing
      // if (wasOffline && isNowOnline && state.isFirebaseReady) {
      //   console.log("🌐 Back online → syncing local data...");
      //   await actions.syncLocal(state.savedScans, state.subjects);
      // }
    });

    return () => unsubscribe();
  }, [state.isOffline, state.isFirebaseReady, state.savedScans, state.subjects]);

  // Subscribe to real-time scans + subjects
  useEffect(() => {
    if (state.isFirebaseReady && state.user) {
      console.log("📡 Subscribing to scans + subjects in Firestore");

      const unsubScans = FirebaseService.subscribeToScans((scans) => {
        dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
      }, state.user.uid);

      const unsubSubjects = FirebaseService.subscribeToSubjects((subjects) => {
        dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: subjects });
      }, state.user.uid);

      // cleanup when user signs out or deps change
      return () => {
        console.log("🛑 Unsubscribing from scans + subjects");
        unsubScans?.();
        unsubSubjects?.();
      };
    }
  }, [state.isFirebaseReady, state.user?.uid]);



  // Actions
  const actions = useMemo(() => ({
    setCapturedImage: (image) => dispatch({ type: ACTIONS.SET_CAPTURED_IMAGE, payload: image }),
    setRecognizedText: (text) => dispatch({ type: ACTIONS.SET_RECOGNIZED_TEXT, payload: text }),
    setProcessing: (processing) => dispatch({ type: ACTIONS.SET_PROCESSING, payload: processing }),
    addScan: async (scan) => {
      dispatch({ type: ACTIONS.SET_SYNCING, payload: true });
      try {
        // Add to local storage first (for offline support)
        // await addScanToStorage(scan);

        // Try to add to Firebase if online
        if (state.isFirebaseReady && !state.isOffline) {
          const firebaseId = await FirebaseService.addScan(scan, state.user.uid);
          scan.firebaseId = firebaseId;
        }

        // dispatch({ type: ACTIONS.ADD_SCAN, payload: scan });
      } catch (error) {
        console.error('Error adding scan:', error);
      } finally {
        dispatch({ type: ACTIONS.SET_SYNCING, payload: false });
      }
    },
    deleteScan: async (scan) => {
      dispatch({ type: ACTIONS.SET_SYNCING, payload: true });
      try {
        // Remove from local storage
        // await removeScanFromStorage(scan);

        // Try to remove from Firebase if online
        if (state.isFirebaseReady && !state.isOffline && scan.firebaseId) {
          await FirebaseService.deleteScan(scan.firebaseId, state.user.uid);
        }

        // dispatch({ type: ACTIONS.DELETE_SCAN, payload: scan });
      } catch (error) {
        console.error('Error deleting scan:', error);
      } finally {
        dispatch({ type: ACTIONS.SET_SYNCING, payload: false });
      }
    },
    updateScan: async (oldScan, updatedScan) => {
      dispatch({ type: ACTIONS.SET_SYNCING, payload: true });
      try {
        // Update local storage
        // await updateScanInStorage(oldScan, updatedScan);

        // Try to update Firebase if online
        if (state.isFirebaseReady && !state.isOffline && oldScan.firebaseId) {
          await FirebaseService.updateScan(oldScan.firebaseId, updatedScan, state.user.uid);
          updatedScan.firebaseId = oldScan.firebaseId;
        }

        // dispatch({ type: ACTIONS.UPDATE_SCAN, payload: { oldScan, updatedScan } });
      } catch (error) {
        console.error('Error updating scan:', error);
      } finally {
        dispatch({ type: ACTIONS.SET_SYNCING, payload: false });
      }
    },
    loadScans: async () => {
      if (state.isFirebaseReady && !state.isOffline) {
        const scans = await FirebaseService.getScans(state.user.uid);
        dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
      } else {
        // const scans = await loadScansFromStorage();
        // dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
      }
    },
    addSubject: async (subject) => {
      dispatch({ type: ACTIONS.SET_SYNCING, payload: true });
      try {
        // Add to local storage first
        // const result = await addNewSubject(subjectName, state.subjects);
        // if (!result.success) {
        //   return result;
        // }

        // Try to add to Firebase if online
        if (state.isFirebaseReady && !state.isOffline) {
          const firebaseId = await FirebaseService.addSubject(subject, state.user.uid);
          subject.firebaseId = firebaseId;
        }

        // dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        return { success: true };
      } catch (error) {
        console.error('Error adding subject:', error);
        return { success: false };
      } finally {
        dispatch({ type: ACTIONS.SET_SYNCING, payload: false });
      }
    },
    removeSubject: async (subjectName) => {
      dispatch({ type: ACTIONS.SET_SYNCING, payload: true });
      try {
        // Remove from local storage
        // const result = await removeSubject(subjectName, state.subjects);
        // if (!result.success) {
        //   return result;
        // }

        // Try to remove from Firebase if online
        if (state.isFirebaseReady && !state.isOffline) {
          await FirebaseService.deleteSubject(subject.firebaseId, state.user.uid);
        }

        // dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        return { success: true };
      } catch (error) {
        console.error('Error removing subject:', error);
        return { success: false };
      } finally {
        dispatch({ type: ACTIONS.SET_SYNCING, payload: false });
      }
    },
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    resetApp: () => dispatch({ type: ACTIONS.RESET_APP }),
    requestPermissions: requestAllPermissions,
    // Authentication actions
    signIn: (user) => {
      console.log('User signed in:', user.email || 'Unknown');
      dispatch({ type: ACTIONS.SIGN_IN, payload: user });
    },
    signOut: () => {
      console.log('User signed out');
      dispatch({ type: ACTIONS.SIGN_OUT });
    },
    syncLocal: async (localScans, localSubjects) => {
      try {
        dispatch({ type: ACTIONS.SET_SYNCING, payload: true });
        const result = await FirebaseService.syncLocalToFirebase(localScans, localSubjects, state.user.uid);
        dispatch({ type: ACTIONS.SET_SYNCING, payload: false });
        return result;
      } catch (error) {
        dispatch({ type: ACTIONS.SET_SYNCING, payload: false });
        throw error;
      }
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
