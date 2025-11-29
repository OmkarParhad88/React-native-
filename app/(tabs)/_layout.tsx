import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from 'react-native';
import { useTheme } from "../../Context/ThemeContext";

const _Layout = () => {
    const { colors } = useTheme();

    return (
       <Tabs screenOptions={{
           headerShown: false,
           tabBarShowLabel: true,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.text,
            tabBarStyle: {
                backgroundColor: colors.card,
                borderTopColor: colors.background,
            },
           tabBarLabelStyle: {
               fontSize: 14,
               fontWeight: "600",
           },
       }}>
           <Tabs.Screen
            name = "index"
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                        name={focused ? "home" : "home-outline"}
                        size={size}
                        color={color}
                    />
                ),
            }}/>
           <Tabs.Screen
            name = "New"
            options={{
                title: "New",
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                        name={focused ? "add-circle" : "add-circle-outline"}
                        size={size}
                        color={color}
                    />
                ),
            }}
           />
           <Tabs.Screen
                name="Settings"
            options={{
                title: "Settings",
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                        name={focused ? "settings" : "settings-outline"}
                        size={size}
                        color={color}
                    />
                ),
            }}
           />
       </Tabs>
    );
};
export default _Layout;

const styles = StyleSheet.create({ })