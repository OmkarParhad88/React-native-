import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import AutocompleteInput from "../../Components/AutocompleteInput";
import { useItems } from "../../Context/ItemsContext";
import { useTheme } from "../../Context/ThemeContext";

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
    const [land, setLand] = useState<string>("");

    const { addItem, updateItem, sellerSuggestions, itemSuggestions, landSuggestions } = useItems();
    const { colors } = useTheme();
    const router = useRouter();
    const navigation = useNavigation();

    // Handle form state on focus (Reset or Populate)
    useFocusEffect(
        useCallback(() => {
            if (id) {
                // Edit Mode: Populate form
                setSeller(params.seller as string || "");
                setItem(params.item as string || "");
                if (params.date) setDate(new Date(params.date as string));
                setDag(params.dag as string || "");
                setQty(params.qty as string || "");
                setPrice(params.price as string || "");
                setSubtotal(params.subtotal as string || "");
                setExpenseTotal(params.expenseTotal as string || "");
                setTotal(params.total as string || "");
                setLand(params.land as string || "");
            } else {
                // New Mode: Reset form
                setSeller("");
                setItem("");
                setDate(new Date());
                setDag("");
                setQty("");
                setPrice("");
                setSubtotal("");
                setExpenseTotal("");
                setTotal("");
                setLand("");
            }
        }, [id, params])
    );

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
        if (!seller || !item || !qty) {
            Alert.alert("Missing Fields", "Please fill in Seller, Item, and Quantity.");
            return;
        }

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
            land
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
            style={{ flex: 1, backgroundColor: colors.background }}
        >
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6 mt-4">
                    <Text className="text-3xl font-extrabold" style={{ color: colors.primary }}>{isEditMode ? "Edit Entry" : "New Entry"}</Text>
                    <Text className="text-base" style={{ color: colors.text }}>{isEditMode ? "Update transaction details" : "Add a new transaction"}</Text>
                </View>

                <View className="p-6 rounded-3xl shadow-xl" style={{ backgroundColor: colors.card, shadowColor: colors.primary }}>

                    {/* Seller Section - High z-index for dropdown */}
                    <View className="mb-5 z-50">
                        <Text className="font-bold text-base ml-1 mb-2" style={{ color: colors.primary }}>Seller Name <Text className="text-red-500">*</Text></Text>
                        <AutocompleteInput
                            data={sellerSuggestions}
                            value={seller}
                            onChangeText={setSeller}
                            placeholder="e.g. John Doe"
                            className="border rounded-2xl p-4 text-base"
                            style={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
                        />
                    </View>

                    {/* Date Section */}
                    <View className="mb-5 -z-10">
                        <Text className="font-bold text-base ml-1 mb-2" style={{ color: colors.primary }}>Date <Text className="text-red-500">*</Text></Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="border rounded-2xl p-4 flex-row items-center justify-between"
                            style={{ backgroundColor: colors.background, borderColor: colors.primary }}
                        >
                            <Text className="text-base" style={{ color: colors.text }}>{date.toISOString().split('T')[0].split('-').reverse().join('-')}</Text>
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
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
                        <Text className="font-bold text-base ml-1 mb-2" style={{ color: colors.primary }}>Item <Text className="text-red-500">*</Text></Text>
                        <AutocompleteInput
                            data={itemSuggestions}
                            value={item}
                            onChangeText={setItem}
                            placeholder="e.g. Kamini"
                            className="border rounded-2xl p-4 text-base"
                            style={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
                        />
                    </View>

                    {/* Land Section - High z-index for dropdown */}
                    <View className="mb-5 z-30">
                        <Text className="font-bold text-base ml-1 mb-2" style={{ color: colors.primary }}>Land (Farm)</Text>
                        <AutocompleteInput
                            data={landSuggestions}
                            value={land}
                            onChangeText={setLand}
                            placeholder="e.g. Farm A"
                            className="border rounded-2xl p-4 text-base"
                            style={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
                        />
                    </View>

                    {/* Row for Dag & Qty */}
                    <View className="flex-row justify-between mb-5 -z-10">
                        <View className="w-[48%]">
                            <Text className="font-bold text-base ml-1 mb-2" style={{ color: colors.primary }}>Dag</Text>
                            <TextInput
                                value={dag}
                                onChangeText={setDag}
                                keyboardType="numeric"
                                placeholder="0"
                                className="border rounded-2xl p-4 text-base"
                                style={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
                                placeholderTextColor="gray"
                            />
                        </View>
                        <View className="w-[48%]">
                            <Text className="font-bold text-base ml-1 mb-2" style={{ color: colors.primary }}>Quantity <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                value={qty}
                                onChangeText={setQty}
                                keyboardType="numeric"
                                placeholder="0"
                                className="border rounded-2xl p-4 text-base"
                                style={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
                                placeholderTextColor="gray"
                            />
                        </View>
                    </View>

                    {/* Price Section */}
                    <View className="mb-5 -z-10">
                        <Text className="font-bold text-base ml-1 mb-2" style={{ color: colors.primary }}>Price per Unit</Text>
                        <View className="relative">
                            <TextInput
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="0.00"
                                className="border rounded-2xl p-4 text-base pl-8"
                                style={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
                                placeholderTextColor="gray"
                            />
                            <Text className="absolute left-4 top-4 text-gray-400">₹</Text>
                        </View>
                    </View>

                    {/* Calculations Section */}
                    <View className="p-4 rounded-2xl mb-5 border -z-10" style={{ backgroundColor: colors.background, borderColor: colors.primary }}>
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="font-semibold" style={{ color: colors.primary }}>Subtotal</Text>
                            <Text className="font-bold text-lg" style={{ color: colors.text }}>₹{subtotal || '0'}</Text>
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

                        <View className="h-[1px] my-2" style={{ backgroundColor: colors.primary }} />

                        <View className="flex-row justify-between items-center mt-1">
                            <Text className="font-bold text-lg" style={{ color: colors.primary }}>Total</Text>
                            <Text className="font-extrabold text-2xl" style={{ color: "red" }}>₹{total || '0'}</Text>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="p-5 rounded-full items-center shadow-lg mt-2"
                        style={{ backgroundColor: colors.primary, shadowColor: colors.primary }}
                    >
                        <Text className="text-white font-bold text-xl">{isEditMode ? "Update Entry" : "Save Entry"}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default New;