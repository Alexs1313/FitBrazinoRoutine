import { createStackNavigator } from '@react-navigation/stack';
import Fitroutinehm from '../Fitroutinescrns/Fitroutinehm';
import Fitroutineonbrd from '../Fitroutinescrns/Fitroutineonbrd';
import Fitroutineoncrtprfl from '../Fitroutinescrns/Fitroutineoncrtprfl';
import Fitroutineonchsclb from '../Fitroutinescrns/Fitroutineonchsclb';
import Fitroutinetsks from '../Fitroutinescrns/Fitroutinetsks';
import Fitroutinesvdnts from '../Fitroutinescrns/Fitroutinesvdnts';
import Fitroutineabt from '../Fitroutinescrns/Fitroutineabt';
import Fitroutinesttngs from '../Fitroutinescrns/Fitroutinesttngs';
import Fitroutinechgprf from '../Fitroutinescrns/Fitroutinechgprf';

const Stack = createStackNavigator();

const Fitroutinestck = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Fitroutineonbr" component={Fitroutineonbr} />
      <Stack.Screen
        name="Fitroutineoncrtprfl"
        component={Fitroutineoncrtprfl}
      />
      <Stack.Screen name="Fitroutineonchsclb" component={Fitroutineonchsclb} />
      <Stack.Screen name="Fitroutinehm" component={Fitroutinehm} />
      <Stack.Screen name="Fitroutinetsks" component={Fitroutinetsks} />
      <Stack.Screen name="Fitroutinesvdnts" component={Fitroutinesvdnts} />
      <Stack.Screen name="Fitroutineabt" component={Fitroutineabt} />
      <Stack.Screen name="Fitroutinesttngs" component={Fitroutinesttngs} />
      <Stack.Screen name="Fitroutinechgprf" component={Fitroutinechgprf} />
    </Stack.Navigator>
  );
};

export default Fitroutinestck;
