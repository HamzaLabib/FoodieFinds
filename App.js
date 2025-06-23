import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen.jsx';
import DetailedScreen from './screens/DetailedScreen.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Restaurants Arounds" component={HomeScreen} />
        <Stack.Screen name="Restaurant Details" component={DetailedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
