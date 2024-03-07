import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CalendarScreen from './components/calendar/CalendarScreen';
import CalendarView from './components/calendar/CalendarView';

const Tap = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tap.Navigator>
          <Tap.Screen
              name='Calender'
              component={CalendarView}
          />
      </Tap.Navigator>
    </NavigationContainer>
  )
}

