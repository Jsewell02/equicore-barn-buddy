import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DemoState {
  barnName: string;
  ownerName: string;
  primaryHorse: string;
  theme: string;
}

interface DemoContextType {
  demoState: DemoState;
  updateDemoState: (updates: Partial<DemoState>) => void;
  resetToDefaults: () => void;
}

const defaultDemoState: DemoState = {
  barnName: "Sunset Stables",
  ownerName: "Demo Barn", 
  primaryHorse: "Bella",
  theme: "Warm"
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [demoState, setDemoState] = useState<DemoState>(defaultDemoState);

  const updateDemoState = (updates: Partial<DemoState>) => {
    setDemoState(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setDemoState(defaultDemoState);
  };

  return (
    <DemoContext.Provider value={{ demoState, updateDemoState, resetToDefaults }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};