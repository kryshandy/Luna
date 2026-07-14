import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageCircle, BookOpen, Flower2, Settings } from 'lucide-react-native';

// Écrans (on créera des versions temporaires vides pour l'instant)
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import JournalScreen from '../screens/JournalScreen';
import CycleScreen from '../screens/CycleScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Accueil" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tab.Screen name="Lulu" component={ChatScreen} options={{ tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }} />
      <Tab.Screen name="Journal" component={JournalScreen} options={{ tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} /> }} />
      <Tab.Screen name="Cycle" component={CycleScreen} options={{ tabBarIcon: ({ color, size }) => <Flower2 color={color} size={size} /> }} />
      <Tab.Screen name="Réglages" component={SettingsScreen} options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}