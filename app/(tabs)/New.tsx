
import React, { useState, useEffect } from "react";
import {StyleSheet, View, Text, TextInput } from "react-native";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

const New = () => {
    const [seller, setSeller] = useState("");
    const [item, setItem] = useState<string>("");
    const [date, setDate] = useState("");
    const [dag, setDag] = useState<string>("");
    const [qty, setQty] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [subtotal, setSubtotal] = useState<string>("");
    const [expenseTotal, setExpenseTotal] = useState<string>("");
    const [total, setTotal] = useState<string>("");

    // Set default date = today
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
    }, []);

    // Auto-calc subtotal
    useEffect(() => {
        const q = Number(qty);
        const p = Number(price);
        if (!isNaN(q) && !isNaN(p)) {
            setSubtotal(String(q * p));
        }
    }, [qty, price]);


    // Auto-calc Total
    useEffect(() => {
        const s = Number(subtotal);
        const e = Number(expenseTotal);
        if (!isNaN(s) && !isNaN(e)) {
            setTotal(String(s - e));
        }
    }, [subtotal, expenseTotal]);

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ padding: 20 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* your form goes here */}




        <View className="p-5">
            <View className="bg-white p-5 rounded-2xl shadow">
                <Text className="text-xl font-bold mb-4">Seller Form</Text>

                {/* Seller */}
                <Text className="font-semibold">Seller Name</Text>
                <TextInput
                    value={seller}
                    onChangeText={setSeller}
                    placeholder="Enter seller name"
                    className="border rounded-xl p-3 mb-4"
                />

                {/* Date */}
                <Text className="font-semibold">Date</Text>
                <TextInput
                    value={date}
                    onChangeText={setDate}
                    className="border rounded-xl p-3 mb-4"
                />

                {/* Item */}
                <Text className="font-semibold">Item</Text>
                <TextInput
                    value={item}
                    onChangeText={setItem}
                    placeholder="Item name"
                    className="border rounded-xl p-3 mb-4"
                />

                {/* Quantity */}
                <Text className="font-semibold">Dag</Text>
                <TextInput
                    value={dag}
                    onChangeText={setDag}
                    keyboardType="numeric"
                    placeholder="0"
                    className="border rounded-xl p-3 mb-4"
                />
                <Text className="font-semibold">Quantity</Text>
                <TextInput
                    value={qty}
                    onChangeText={setQty}
                    keyboardType="numeric"
                    placeholder="0"
                    className="border rounded-xl p-3 mb-4"
                />

                {/* Price per unit */}
                <Text className="font-semibold">Price per unit</Text>
                <TextInput
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="0"
                    className="border rounded-xl p-3 mb-4"
                />

                {/* Subtotal */}
                <Text className="font-semibold">Subtotal</Text>
                <Text className="p-3 bg-gray-100 rounded-xl mb-4">
                    {subtotal}
                </Text>

                {/* Expense Total */}
                <Text className="font-semibold">Expense Total</Text>
                <TextInput
                    value={expenseTotal}
                    onChangeText={setExpenseTotal}
                    keyboardType="numeric"
                    placeholder="0"
                    className="border rounded-xl p-3 mb-4"
                />
                <Text className="font-semibold">Total</Text>
                <Text className="p-3 bg-gray-100 rounded-xl mb-4">
                    {total}
                </Text>
            </View>
        </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default New;

// const styles = StyleSheet.create({ })