
import {StyleSheet , Text, View} from 'react-native';
import React from  "react";
import {useLocalSearchParams} from "expo-router";

const ItemDetails = () => {
    const  { id } = useLocalSearchParams()
    return (
        <View>
            <Text> ItemDetails : {id}</Text>
        </View>
    );
};
export default ItemDetails;

const styles = StyleSheet.create({ })