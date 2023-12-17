import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '@/querys/AuthQuery';

interface UserContextProps {
  userInfo: any;
  onUserInfoChange: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UseUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('UseUserContext must be used within an UserContextProvider');
  }
  return context;
}

export function UserContextProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery(GET_USER_DATA);

  const onUserInfoChange = () => {
    refetch();
  };

  return (
    <UserContext.Provider value={{ userInfo: data, onUserInfoChange }}>
      {children}
    </UserContext.Provider>
  );
}