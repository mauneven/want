import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '@/querys/AuthQuery';

interface AppDataContextProps {
  userInfo: any;
  onUserInfoChange: () => void;
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined);

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery(GET_USER_DATA);

  const onUserInfoChange = () => {
    refetch();
  };

  return (
    <AppDataContext.Provider value={{ userInfo: data, onUserInfoChange }}>
      {children}
    </AppDataContext.Provider>
  );
}