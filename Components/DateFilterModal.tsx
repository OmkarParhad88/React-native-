import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";

interface DateFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (date: Date) => void;
    mode: 'month' | 'year';
    currentDate: Date;
}

const DateFilterModal: React.FC<DateFilterModalProps> = ({ visible, onClose, onSelect, mode, currentDate }) => {
    const { colors } = useTheme();
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [view, setView] = useState<'year' | 'month'>(mode === 'year' ? 'year' : 'month');

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i); // 5 years back, 4 years forward
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        if (mode === 'year') {
            const newDate = new Date(currentDate);
            newDate.setFullYear(year);
            onSelect(newDate);
            onClose();
        } else {
            setView('month');
        }
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(selectedYear);
        newDate.setMonth(monthIndex);
        onSelect(newDate);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 p-5">
                <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden" style={{ backgroundColor: colors.card }}>
                    {/* Header */}
                    <View className="p-4 flex-row justify-between items-center border-b border-gray-100">
                        <Text className="text-xl font-bold" style={{ color: colors.text }}>
                            {view === 'year' ? "Select Year" : "Select Month"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="p-4 h-80">
                        {view === 'year' ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View className="flex-row flex-wrap justify-between">
                                    {years.map((year) => (
                                        <TouchableOpacity
                                            key={year}
                                            onPress={() => handleYearSelect(year)}
                                            className={`w-[30%] p-3 mb-3 rounded-xl items-center ${selectedYear === year ? 'bg-indigo-100' : 'bg-gray-50'}`}
                                        >
                                            <Text className={`font-semibold ${selectedYear === year ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                {year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        ) : (
                            <>
                                <TouchableOpacity 
                                    onPress={() => setView('year')}
                                    className="mb-4 p-2 bg-gray-100 rounded-lg items-center flex-row justify-center"
                                >
                                    <Text className="font-bold text-lg mr-2" style={{ color: colors.text }}>{selectedYear}</Text>
                                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                                </TouchableOpacity>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View className="flex-row flex-wrap justify-between">
                                        {months.map((month, index) => (
                                            <TouchableOpacity
                                                key={month}
                                                onPress={() => handleMonthSelect(index)}
                                                className={`w-[48%] p-3 mb-3 rounded-xl items-center ${currentDate.getMonth() === index && selectedYear === currentDate.getFullYear() ? 'bg-indigo-100' : 'bg-gray-50'}`}
                                            >
                                                <Text className={`font-semibold ${currentDate.getMonth() === index && selectedYear === currentDate.getFullYear() ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                    {month}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DateFilterModal;
