import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { UserContext } from '../context/UserContext';
import { Screen, LoadingState } from '../components';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DietaryPreferencesScreen from '../screens/DietaryPreferencesScreen';
import AllergiesScreen from '../screens/AllergiesScreen';
import HomeScreen from '../screens/HomeScreen';
import PlanScreen from '../screens/PlanScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PreparationRecordScreen from '../screens/PreparationRecordScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TABS = [
    { name: 'HomeTab', component: HomeScreen, label: 'Inicio', icon: 'home' },
    { name: 'PlanTab', component: PlanScreen, label: 'Plan', icon: 'calendar' },
    { name: 'FavoritesTab', component: FavoritesScreen, label: 'Favoritos', icon: 'heart' },
    { name: 'ProfileTab', component: ProfileScreen, label: 'Perfil', icon: 'user' },
];

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
            }}
        >
            {TABS.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    options={{
                        tabBarLabel: tab.label,
                        tabBarIcon: ({ color }) => <Feather name={tab.icon} size={20} color={color} />,
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { isHydrated, userEmail } = useContext(UserContext);

    // Mientras se lee la sesión guardada en el celular, mostramos una pantalla de carga
    if (!isHydrated) {
        return (
            <Screen style={{ justifyContent: 'center' }}>
                <LoadingState message="Cargando tu cuenta..." />
            </Screen>
        );
    }

    // Con sesión guardada se entra directo a la app; sin sesión, al Login
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={userEmail ? 'MainTabs' : 'Login'} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="DietaryPreferences" component={DietaryPreferencesScreen} />
                <Stack.Screen name="Allergies" component={AllergiesScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="PreparationRecord" component={PreparationRecordScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
