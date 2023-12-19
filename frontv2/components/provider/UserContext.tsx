import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_DATA } from "@/querys/AuthQuery";

interface UserContextProps {
  userInfo: any;
  onUserInfoChange: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UseUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "UseUserContext must be used within an UserContextProvider"
    );
  }
  return context;
}

export function UserContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data, refetch } = useQuery(GET_USER_DATA);

  const onUserInfoChange = () => {
    refetch();
  };

  const contextValue = useMemo(
    () => ({ userInfo: data, onUserInfoChange }),
    [data]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
