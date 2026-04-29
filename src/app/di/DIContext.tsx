import { createContext, useContext, ReactNode } from 'react';
import { container } from './container';
import { Container } from 'inversify';

const DIContext = createContext<Container | null>(null);

export const DIProvider = ({ children }: { children: ReactNode }) => {
  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
};

export const useContainer = () => {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useContainer must be used within a DIProvider');
  }
  return context;
};
