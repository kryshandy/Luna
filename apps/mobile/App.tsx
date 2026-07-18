import './src/services/sentry';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from './src/db';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

export default function App() {
  return (
    <DatabaseProvider database={database}>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </DatabaseProvider>
  );
}