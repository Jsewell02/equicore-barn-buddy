import React, { createContext, useContext, useState, ReactNode } from 'react';

export type WalkthroughStep = 
  | 'welcome'
  | 'horses'
  | 'scheduler'
  | 'inventory'
  | 'billing'
  | 'tasks'
  | 'transition'
  | 'interactive'
  | 'cta';

interface WalkthroughState {
  currentStep: WalkthroughStep;
  isActive: boolean;
  hasCompleted: boolean;
}

interface WalkthroughContextType {
  state: WalkthroughState;
  startWalkthrough: () => void;
  nextStep: () => void;
  skipWalkthrough: () => void;
  restartWalkthrough: () => void;
  enterInteractiveMode: () => void;
  showCTA: () => void;
}

const walkthroughSteps: WalkthroughStep[] = [
  'welcome',
  'horses',
  'scheduler',
  'inventory',
  'billing',
  'tasks',
  'transition',
  'interactive'
];

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

export const WalkthroughProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalkthroughState>({
    currentStep: 'welcome',
    isActive: false,
    hasCompleted: false
  });

  const startWalkthrough = () => {
    setState({
      currentStep: 'welcome',
      isActive: true,
      hasCompleted: false
    });
  };

  const nextStep = () => {
    const currentIndex = walkthroughSteps.indexOf(state.currentStep);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < walkthroughSteps.length) {
      setState(prev => ({
        ...prev,
        currentStep: walkthroughSteps[nextIndex]
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentStep: 'interactive',
        hasCompleted: true
      }));
    }
  };

  const skipWalkthrough = () => {
    setState({
      currentStep: 'interactive',
      isActive: false,
      hasCompleted: true
    });
  };

  const restartWalkthrough = () => {
    setState({
      currentStep: 'welcome',
      isActive: true,
      hasCompleted: false
    });
  };

  const enterInteractiveMode = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'interactive',
      isActive: false,
      hasCompleted: true
    }));
  };

  const showCTA = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'cta',
      isActive: true
    }));
  };

  return (
    <WalkthroughContext.Provider value={{ 
      state, 
      startWalkthrough, 
      nextStep, 
      skipWalkthrough, 
      restartWalkthrough, 
      enterInteractiveMode,
      showCTA 
    }}>
      {children}
    </WalkthroughContext.Provider>
  );
};

export const useWalkthrough = () => {
  const context = useContext(WalkthroughContext);
  if (context === undefined) {
    throw new Error('useWalkthrough must be used within a WalkthroughProvider');
  }
  return context;
};