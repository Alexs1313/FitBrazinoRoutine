import { NavigationContainer } from '@react-navigation/native';
import Fitroutinestck from './[FitRoutineAppSrc]/RoutineAppRouter/Fitroutinestck';
import { ContextProvider } from './[FitRoutineAppSrc]/FitStorage/fitroutinecntxt';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import Fitroutineldng from './[FitRoutineAppSrc]/RoutineComponents/Fitroutineldng';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 6000);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <NavigationContainer>
      <ContextProvider>
        {isLoading ? <Fitroutineldng /> : <Fitroutinestck />}
        <Toast position="top" topOffset={55} />
      </ContextProvider>
    </NavigationContainer>
  );
};

export default App;
