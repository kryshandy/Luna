import { useEffect } from 'react';
import './src/services/sentry';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from './src/db';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import AuthFlow from './src/navigation/AuthFlow';
import { useAuthStore } from './src/store/authStore';
import { getSession } from './src/services/sessionService';

export default function App() {
  const { unlocked, setDeviceStatus, setProfile } = useAuthStore();

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        setDeviceStatus('noAccount');
        return;
      }
      setProfile(session.prenom, session.avatarIndex, session.user.email);
      setDeviceStatus('hasAccount');
    })();
  }, []);

  return (
    <DatabaseProvider database={database}>
      <NavigationContainer>
        {unlocked ? <BottomTabNavigator /> : <AuthFlow />}
      </NavigationContainer>
    </DatabaseProvider>
  );
}