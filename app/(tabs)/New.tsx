import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import AutocompleteInput from "../../Components/AutocompleteInput";
import { useItems } from "../../Context/ItemsContext";

const New = () => {
    const params = useLocalSearchParams();
    const { id } = params;
    const isEditMode = !!id;

    const [seller, setSeller] = useState("");
    const [item, setItem] = useState<string>("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dag, setDag] = useState<string>("");
    const [qty, setQty] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [subtotal, setSubtotal] = useState<string>("");
    const [expenseTotal, setExpenseTotal] = useState<string>("");
    const [total, setTotal] = useState<string>("");

    const { addItem, updateItem, sellerSuggestions, itemSuggestions } = useItems();
    const router = useRouter();

    // Populate form if in edit mode
    useEffect(() => {
        if (id) {
            setSeller(params.seller as string || "");
            setItem(params.item as string || "");
            if (params.date) setDate(new Date(params.date as string));
            setDag(params.dag as string || "");
            setQty(params.qty as string || "");
            setPrice(params.price as string || "");
            setSubtotal(params.subtotal as string || "");
            setExpenseTotal(params.expenseTotal as string || "");
            setTotal(params.total as string || "");
        }
    }, [id]);

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

    const handleSubmit = () => {
        const itemData = {
            id: isEditMode ? (id as string) : Date.now().toString(),
            seller,
            item,
            date: date.toISOString().split('T')[0],
            dag,
            qty,
            price,
            subtotal,
            expenseTotal,
            total,
        };

        if (isEditMode) {
            updateItem(itemData);
        } else {
            addItem(itemData);
        }
        router.push("/(tabs)");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            className="bg-indigo-50"
        >
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6 mt-4">
                    <Text className="text-3xl font-extrabold text-indigo-900">{isEditMode ? "Edit Entry" : "New Entry"}</Text>
                    <Text className="text-indigo-600 text-base">{isEditMode ? "Update transaction details" : "Add a new transaction"}</Text>
                </View>

                <View className="bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100">

                    {/* Seller Section - High z-index for dropdown */}
                    <View className="mb-5 z-50">
                        <Text className="text-indigo-900 font-bold text-base ml-1 mb-2">Seller Name</Text>
                        <AutocompleteInput
                            data={sellerSuggestions}
                            value={seller}
                            onChangeText={setSeller}
                            placeholder="e.g. John Doe"
                            className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-base"
                        />
                    </View>

                    {/* Date Section */}
                    <View className="mb-5 -z-10">
                        <Text className="text-indigo-900 font-bold text-base ml-1 mb-2">Date</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex-row items-center justify-between"
                        >
                            <Text className="text-gray-800 text-base">{date.toISOString().split('T')[0].split('-').reverse().join('-')}</Text>
                            <Ionicons name="calendar-outline" size={20} color="#4f46e5" />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setDate(selectedDate);
                                    }
                                }}
                            />
                        )}
                    </View>

                    {/* Item Section - High z-index for dropdown */}
                    <View className="mb-5 z-40">
                        <Text className="text-indigo-900 font-bold text-base ml-1 mb-2">Item</Text>
                        <AutocompleteInput
                            data={itemSuggestions}
                            value={item}
                            onChangeText={setItem}
                            placeholder="e.g. Apples"
                            className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-base"
                        />
                    </View>

                    {/* Row for Dag & Qty */}
                    <View className="flex-row justify-between mb-5 -z-10">
                        <View className="w-[48%]">
                            <Text className="text-indigo-900 font-bold text-base ml-1 mb-2">Dag</Text>
                            <TextInput
                                value={dag}
                                onChangeText={setDag}
                                keyboardType="numeric"
                                placeholder="0"
                                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-base"
                            />
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-indigo-900 font-bold text-base ml-1 mb-2">Quantity</Text>
                            <TextInput
                                value={qty}
                                onChangeText={setQty}
                                keyboardType="numeric"
                                placeholder="0"
                                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-base"
                            />
                        </View>
                    </View>

                    {/* Price Section */}
                    <View className="mb-5 -z-10">
                        <Text className="text-indigo-900 font-bold text-base ml-1 mb-2">Price per Unit</Text>
                        <View className="relative">
                            <TextInput
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="0.00"
                                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-base pl-8"
                            />
                            <Text className="absolute left-4 top-4 text-gray-400">₹</Text>
                        </View>
                    </View>

                    {/* Calculations Section */}
                    <View className="bg-indigo-50 p-4 rounded-2xl mb-5 border border-indigo-100 -z-10">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-indigo-700 font-semibold">Subtotal</Text>
                            <Text className="text-indigo-900 font-bold text-lg">₹{subtotal || '0'}</Text>
                        </View>

                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-red-700 font-semibold">Expenses</Text>
                            <TextInput
                                value={expenseTotal}
                                onChangeText={setExpenseTotal}
                                keyboardType="numeric"
                                placeholder="0"
                                className="bg-red-50 border border-red-200 rounded-xl p-2 w-24 text-right text-red-900 font-bold"
                            />
                        </View>

                        <View className="h-[1px] bg-indigo-200 my-2" />

                        <View className="flex-row justify-between items-center mt-1">
                            <Text className="text-indigo-900 font-bold text-lg">Total</Text>
                            <Text className="text-indigo-600 font-extrabold text-2xl">₹{total || '0'}</Text>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-indigo-600 p-5 rounded-full items-center shadow-lg shadow-indigo-300 active:bg-indigo-700 mt-2"
                    >
                        <Text className="text-white font-bold text-xl">{isEditMode ? "Update Entry" : "Save Entry"}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default New;