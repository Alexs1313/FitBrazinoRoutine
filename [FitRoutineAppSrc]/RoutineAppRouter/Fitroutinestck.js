import { createStackNavigator } from '@react-navigation/stack';

//screens =>
import Fitroutinehm from '../BrazinoRoutineViews/Fitroutinehm';
import Fitroutineonbrd from '../BrazinoRoutineViews/Fitroutineonbrd';
import Fitroutineoncrtprfl from '../BrazinoRoutineViews/Fitroutineoncrtprfl';
import Fitroutineonchsclb from '../BrazinoRoutineViews/Fitroutineonchsclb';
import Fitroutinetsks from '../BrazinoRoutineViews/Fitroutinetsks';
import Fitroutinesvdnts from '../BrazinoRoutineViews/Fitroutinesvdnts';
import Fitroutineabt from '../BrazinoRoutineViews/Fitroutineabt';
import Fitroutinesttngs from '../BrazinoRoutineViews/Fitroutinesttngs';
import Fitroutinechgprf from '../BrazinoRoutineViews/Fitroutinechgprf';

const Stack = createStackNavigator();

const Fitroutinestck = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Fitroutineonbrd" component={Fitroutineonbrd} />
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
