import { useState, useEffect, useCallback } from 'react';
import { TimerCycle } from '@/types/timer';

interface OfflineAction {
  id: string;
  type: 'CREATE_CYCLE' | 'UPDATE_PREFERENCES' | 'DELETE_CYCLE';
  data: any;
  timestamp: number;
  retries: number;
}

interface OfflineSyncState {
  isOnline: boolean;
  pendingActions: OfflineAction[];
  lastSyncTime: Date | null;
  isSyncing: boolean;
}

const MAX_RETRIES = 3;
const SYNC_INTERVAL = 30000; // 30 seconds

export const useOfflineSync = () => {
  const [state, setState] = useState<OfflineSyncState>({
    isOnline: true, // Default to true for SSR
    pendingActions: [],
    lastSyncTime: null,
    isSyncing: false,
  });

  // Load pending actions from localStorage and set initial online state
  useEffect(() => {
    try {
      const stored = localStorage.getItem('coffee-timer-offline-actions');
      if (stored) {
        const pendingActions = JSON.parse(stored);
        setState(prev => ({ ...prev, pendingActions }));
      }
    } catch (error) {
      console.error('Failed to load offline actions:', error);
    }
    
    // Set initial online state from navigator (client-side only)
    setState(prev => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  // Save pending actions to localStorage
  const savePendingActions = useCallback((actions: OfflineAction[]) => {
    try {
      localStorage.setItem('coffee-timer-offline-actions', JSON.stringify(actions));
    } catch (error) {
      console.error('Failed to save offline actions:', error);
    }
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (state.isOnline && state.pendingActions.length > 0) {
      const timer = setTimeout(() => {
        processPendingActions();
      }, 1000); // Wait 1 second after coming online

      return () => clearTimeout(timer);
    }
  }, [state.isOnline, state.pendingActions.length]);

  // Periodic sync
  useEffect(() => {
    if (!state.isOnline) return;

    const interval = setInterval(() => {
      if (state.pendingActions.length > 0) {
        processPendingActions();
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [state.isOnline, state.pendingActions.length]);

  // Queue an action for offline sync
  const queueAction = useCallback((type: OfflineAction['type'], data: any) => {
    const action: OfflineAction = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    setState(prev => {
      const newActions = [...prev.pendingActions, action];
      savePendingActions(newActions);
      return { ...prev, pendingActions: newActions };
    });
  }, [savePendingActions]);

  // Process pending actions
  const processPendingActions = useCallback(async () => {
    if (state.isSyncing || !state.isOnline || state.pendingActions.length === 0) {
      return;
    }

    setState(prev => ({ ...prev, isSyncing: true }));

    const actionsToProcess = [...state.pendingActions];
    const successfulActions: string[] = [];
    const failedActions: OfflineAction[] = [];

    for (const action of actionsToProcess) {
      try {
        await processAction(action);
        successfulActions.push(action.id);
      } catch (error) {
        console.error('Failed to process action:', action, error);
        
        if (action.retries < MAX_RETRIES) {
          failedActions.push({
            ...action,
            retries: action.retries + 1,
          });
        } else {
          console.warn('Max retries reached for action:', action.id);
        }
      }
    }

    // Update state with remaining actions
    setState(prev => {
      const remainingActions = prev.pendingActions.filter(
        action => !successfulActions.includes(action.id)
      );
      const updatedActions = [...remainingActions, ...failedActions];
      
      savePendingActions(updatedActions);
      
      return {
        ...prev,
        pendingActions: updatedActions,
        lastSyncTime: new Date(),
        isSyncing: false,
      };
    });
  }, [state.pendingActions, state.isOnline, state.isSyncing, savePendingActions]);

  // Process individual action
  const processAction = async (action: OfflineAction): Promise<void> => {
    switch (action.type) {
      case 'CREATE_CYCLE':
        await createCycle(action.data);
        break;
      case 'UPDATE_PREFERENCES':
        await updatePreferences(action.data);
        break;
      case 'DELETE_CYCLE':
        await deleteCycle(action.data.id);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  // Mock API calls (in real app, these would be actual API calls)
  const createCycle = async (cycle: TimerCycle): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Cycle created:', cycle);
  };

  const updatePreferences = async (preferences: any): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Preferences updated:', preferences);
  };

  const deleteCycle = async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Cycle deleted:', id);
  };

  // Manual sync trigger
  const triggerSync = useCallback(() => {
    if (state.isOnline) {
      processPendingActions();
    }
  }, [state.isOnline, processPendingActions]);

  // Clear all pending actions
  const clearPendingActions = useCallback(() => {
    setState(prev => ({ ...prev, pendingActions: [] }));
    savePendingActions([]);
  }, [savePendingActions]);

  // Get sync status
  const getSyncStatus = useCallback(() => {
    if (state.isSyncing) return 'syncing';
    if (state.pendingActions.length > 0 && !state.isOnline) return 'pending';
    if (state.pendingActions.length > 0 && state.isOnline) return 'ready';
    return 'synced';
  }, [state.isSyncing, state.pendingActions.length, state.isOnline]);

  return {
    // State
    isOnline: state.isOnline,
    pendingActions: state.pendingActions,
    lastSyncTime: state.lastSyncTime,
    isSyncing: state.isSyncing,
    
    // Actions
    queueAction,
    triggerSync,
    clearPendingActions,
    
    // Computed
    syncStatus: getSyncStatus(),
    hasPendingActions: state.pendingActions.length > 0,
    pendingCount: state.pendingActions.length,
  };
};
