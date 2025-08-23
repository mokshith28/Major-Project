import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { SCREEN_STATES } from '../constants';

// Initial state
const initialState = {
  screenState: SCREEN_STATES.LOADING,
  capturedImage: null,
  recognizedText: null,
  isProcessing: false,
  savedScans: [],
  error: null,
};

// Action types
const ACTIONS = {
  SET_SCREEN_STATE: 'SET_SCREEN_STATE',
  SET_CAPTURED_IMAGE: 'SET_CAPTURED_IMAGE',
  SET_RECOGNIZED_TEXT: 'SET_RECOGNIZED_TEXT',
  SET_PROCESSING: 'SET_PROCESSING',
  ADD_SCAN: 'ADD_SCAN',
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

  // Actions
  const actions = useMemo(() => ({
    setScreenState: (state) => dispatch({ type: ACTIONS.SET_SCREEN_STATE, payload: state }),
    setCapturedImage: (image) => dispatch({ type: ACTIONS.SET_CAPTURED_IMAGE, payload: image }),
    setRecognizedText: (text) => dispatch({ type: ACTIONS.SET_RECOGNIZED_TEXT, payload: text }),
    setProcessing: (processing) => dispatch({ type: ACTIONS.SET_PROCESSING, payload: processing }),
    addScan: (scan) => dispatch({ type: ACTIONS.ADD_SCAN, payload: scan }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    resetApp: () => dispatch({ type: ACTIONS.RESET_APP }),
    requestPermissions: requestAllPermissions,
  }), [requestAllPermissions]);

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
