import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from "../../Context/ThemeContext";

const ItemDetails = () => {
    const { id } = useLocalSearchParams()
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.text }}> ItemDetails : {id}</Text>
        </View>
    );
};
export default ItemDetails;

const styles = StyleSheet.create({})