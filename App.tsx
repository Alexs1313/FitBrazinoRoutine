import { NavigationContainer } from '@react-navigation/native';
import Fitroutinestck from './Fitroutinesrc/Fitroutinenv/Fitroutinestck';
import { ContextProvider } from './Fitroutinesrc/Fitroutinestrg/fitroutinecntxt';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import Fitroutineldng from './Fitroutinesrc/Fitroutinecmpnts/Fitroutineldng';

const App = () => {
  const [isLdng, setIsLdng] = useState(true);

  useEffect(() => {
    const ldngtmr = setTimeout(() => {
      setIsLdng(false);
    }, 6000);

    return () => clearTimeout(ldngtmr);
  }, []);

  return (
    <NavigationContainer>
      <ContextProvider>
        {isLdng ? <Fitroutineldng /> : <Fitroutinestck />}
        <Toast position="top" topOffset={55} />
      </ContextProvider>
    </NavigationContainer>
  );
};

export default App;
