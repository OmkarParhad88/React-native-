


import {StyleSheet , Text, View} from 'react-native';
import React from  "react";
import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

const _Layout = () => {
    return (
       <Tabs screenOptions={{
           headerShown: false,
           tabBarShowLabel: true,
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
            name = "Item"
            options={{
                title: "Items",
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                        name={focused ? "cube" : "cube-outline"}
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