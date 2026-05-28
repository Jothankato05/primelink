import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, fonts } from './src/theme';
import SplashScreen   from './src/screens/SplashScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AlertsScreen    from './src/screens/AlertsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const indicators = {
    Dashboard: '▣',
    Alerts:    '◎',
  };
  return (
    <View style={[tabStyles.icon, focused && tabStyles.iconFocused]}>
      <Text style={[tabStyles.glyph, { color: focused ? colors.green : colors.textMuted }]}>
        {indicators[label] ?? '●'}
      </Text>
    </View>
  );
}

function MainNavigator() {
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
        tabBarStyle: tabStyles.bar,
        tabBarItemStyle: tabStyles.item,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Alerts"    component={AlertsScreen}    />
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
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  item: {
    paddingTop: 2,
  },
  icon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  iconFocused: {
    backgroundColor: 'rgba(0,200,150,0.1)',
  },
  glyph: {
    fontSize: 14,
  },
  label: {
    fontSize: 10,
    ...fonts.semibold,
    letterSpacing: 0.3,
  },
});
