import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { SCREEN_STATES } from '../constants';
import { loadScansFromStorage, addScanToStorage, removeScanFromStorage } from '../utils';
import { getStoredSubjects, addNewSubject, removeSubject } from '../utils';

// Initial state
const initialState = {
  screenState: SCREEN_STATES.LOADING,
  capturedImage: null,
  recognizedText: null,
  isProcessing: false,
  savedScans: [],
  subjects: [], // Add subjects to global state
  error: null,
};

// Action types
const ACTIONS = {
  SET_SCREEN_STATE: 'SET_SCREEN_STATE',
  SET_CAPTURED_IMAGE: 'SET_CAPTURED_IMAGE',
  SET_RECOGNIZED_TEXT: 'SET_RECOGNIZED_TEXT',
  SET_PROCESSING: 'SET_PROCESSING',
  ADD_SCAN: 'ADD_SCAN',
  DELETE_SCAN: 'DELETE_SCAN',
  LOAD_SCANS: 'LOAD_SCANS',
  LOAD_SUBJECTS: 'LOAD_SUBJECTS',
  ADD_SUBJECT: 'ADD_SUBJECT',
  REMOVE_SUBJECT: 'REMOVE_SUBJECT',
  SET_ERROR: 'SET_ERROR',
  RESET_APP: 'RESET_APP',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCREEN_STATE:
      return { ...state, screenState: action.payload };
    case ACTIONS.SET_CAPTURED_IMAGE:
      return { ...state, capturedImage: action.payload };
    case ACTIONS.SET_RECOGNIZED_TEXT:
      return { ...state, recognizedText: action.payload };
    case ACTIONS.SET_PROCESSING:
      return { ...state, isProcessing: action.payload };
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
    case ACTIONS.RESET_APP:
      return {
        ...state,
        capturedImage: null,
        recognizedText: null,
        screenState: SCREEN_STATES.HOME,
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

  // Update screen state based on permissions
  useEffect(() => {
    if (permissionsLoading) {
      dispatch({ type: ACTIONS.SET_SCREEN_STATE, payload: SCREEN_STATES.LOADING });
    } else if (!hasAllPermissions()) {
      dispatch({ type: ACTIONS.SET_SCREEN_STATE, payload: SCREEN_STATES.PERMISSIONS_REQUIRED });
    } else if (state.screenState === SCREEN_STATES.LOADING || state.screenState === SCREEN_STATES.PERMISSIONS_REQUIRED) {
      dispatch({ type: ACTIONS.SET_SCREEN_STATE, payload: SCREEN_STATES.HOME });
    }
  }, [permissionsLoading, cameraPermission?.granted, mediaLibraryPermission, state.screenState]);

  // Load saved scans from storage on app start
  useEffect(() => {
    const loadSavedScans = async () => {
      const scans = await loadScansFromStorage();
      dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
    };
    loadSavedScans();
  }, []);

  // Load subjects from storage on app start
  useEffect(() => {
    const loadSubjects = async () => {
      const subjects = await getStoredSubjects();
      dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: subjects });
    };
    loadSubjects();
  }, []);

  // Load saved scans when app starts
  useEffect(() => {
    const loadSavedScans = async () => {
      const scans = await loadScansFromStorage();
      dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
    };
    loadSavedScans();
  }, []);

  // Actions
  const actions = useMemo(() => ({
    setScreenState: (state) => dispatch({ type: ACTIONS.SET_SCREEN_STATE, payload: state }),
    setCapturedImage: (image) => dispatch({ type: ACTIONS.SET_CAPTURED_IMAGE, payload: image }),
    setRecognizedText: (text) => dispatch({ type: ACTIONS.SET_RECOGNIZED_TEXT, payload: text }),
    setProcessing: (processing) => dispatch({ type: ACTIONS.SET_PROCESSING, payload: processing }),
    addScan: async (scan) => {
      dispatch({ type: ACTIONS.ADD_SCAN, payload: scan });
      await addScanToStorage(scan);
    },
    deleteScan: async (scan) => {
      dispatch({ type: ACTIONS.DELETE_SCAN, payload: scan });
      await removeScanFromStorage(scan);
    },
    loadScans: async () => {
      const scans = await loadScansFromStorage();
      dispatch({ type: ACTIONS.LOAD_SCANS, payload: scans });
    },
    addSubject: async (subjectName) => {
      const result = await addNewSubject(subjectName, state.subjects);
      if (result.success) {
        dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        return result;
      }
      return result;
    },
    removeSubject: async (subjectName) => {
      const result = await removeSubject(subjectName, state.subjects);
      if (result.success) {
        dispatch({ type: ACTIONS.LOAD_SUBJECTS, payload: result.subjects });
        return result;
      }
      return result;
    },
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    resetApp: () => dispatch({ type: ACTIONS.RESET_APP }),
    requestPermissions: requestAllPermissions,
  }), [requestAllPermissions, state.subjects]);

  const value = useMemo(() => ({
    ...state,
    ...actions,
    hasAllPermissions,
  }), [state, actions, hasAllPermissions]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
