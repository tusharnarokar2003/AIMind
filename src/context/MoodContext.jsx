import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { moodService } from '../services/moodService';
import { useAuth } from './AuthContext';

/**
 * What: Context for managing mood state across the app
 * Why: Multiple components need current mood (HomePage, NavBar, etc.)
 */
const MoodContext = createContext();

export function MoodProvider({ children }) {
  // What: Current mood state
  const [currentMood, setCurrentMood] = useState(null);
  
  // What: Loading state for initial mood fetch
  const [loading, setLoading] = useState(true);
  
  // What: Get user from AuthContext
  // Why: Need to know when user logs in/out
  const { user } = useAuth();

  /**
   * What: Loads the user's latest mood from backend
   * Why: Called on mount and when user changes
   */
  const loadLatestMood = useCallback(async () => {
    try {
      setLoading(true);
      const mood = await moodService.getLatestMood();
      setCurrentMood(mood);
      console.log('Loaded latest mood:', mood);
    } catch (error) {
      console.error('Failed to load mood:', error);
      setCurrentMood(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * What: Refresh mood from backend
   * Why: Called after new journal entry to update UI
   */
  const refreshMood = useCallback(async () => {
    await loadLatestMood();
  }, [loadLatestMood]);

  // What: Load mood when user logs in, clear when logs out
  // Why: Each user has their own mood
  useEffect(() => {
    if (user) {
      loadLatestMood();
    } else {
      setCurrentMood(null);
      setLoading(false);
    }
  }, [user, loadLatestMood]);

  /**
   * What: Provide mood state and functions to all children
   * Why: Any component can access mood without prop drilling
   */
  const value = {
    currentMood,      // Current mood object or null
    loading,          // Whether mood is being loaded
    refreshMood,      // Function to refresh mood from backend
    
    // What: Helper to get the main emotion as a string
    // Why: Easier for components to use
    mainEmotion: currentMood?.mainEmotion || 'neutral',
    
    // What: All emotion scores
    // Why: For visualizations/charts
    emotions: currentMood?.emotions || null
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
}

/**
 * What: Hook to use mood context
 * Why: Easier syntax, throws error if used outside provider
 */
export function useMood() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within MoodProvider');
  }
  return context;
}