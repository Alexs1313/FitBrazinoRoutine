import { createContext, useContext, useState } from 'react';

export const StoreContext = createContext(undefined);

export const useStorage = () => {
  return useContext(StoreContext);
};

export const ContextProvider = ({ children }) => {
  const [isOnNotification, setIsOnNotification] = useState(false);

  const value = {
    isOnNotification,
    setIsOnNotification,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
