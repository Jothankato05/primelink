import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, fonts } from './src/theme';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen   from './src/screens/HomeScreen';
import AlertsScreen from './src/screens/AlertsScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  'My Community': '◈',
  'Alerts':       '◎',
};

function TabIcon({ label, focused }) {
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapFocused]}>
      <Text style={[tabStyles.iconGlyph, { color: focused ? colors.green : colors.textMuted }]}>
        {TAB_ICONS[label] ?? '●'}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Text style={[tabStyles.label, { color: focused ? colors.green : colors.textMuted }]}>
            {route.name}
          </Text>
        ),
        tabBarStyle:     tabStyles.bar,
        tabBarItemStyle: tabStyles.item,
      })}
    >
      <Tab.Screen name="My Community" component={HomeScreen}   />
      <Tab.Screen name="Alerts"       component={AlertsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return (
      <SafeAreaProvider>
        <SplashScreen onEnter={() => setEntered(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
  },
  item: { paddingTop: 2 },
  iconWrap: {
    width: 30, height: 30,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 8,
  },
  iconWrapFocused: { backgroundColor: 'rgba(0,200,150,0.1)' },
  iconGlyph: { fontSize: 15 },
  label: {
    fontSize: 10,
    ...fonts.semibold,
    letterSpacing: 0.2,
  },
});
