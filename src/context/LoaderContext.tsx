'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  startLoader: () => void;
  stopLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoader = () => setIsLoading(true);
  const stopLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, startLoader, stopLoader }}>
      {children}
      {isLoading && <div className="loader-overlay"><div className="loader-spinner"></div></div>}
    </LoaderContext.Provider>
  );
};
