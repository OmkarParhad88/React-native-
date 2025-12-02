import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DateFilterModal from "../../Components/DateFilterModal";
import { useItems } from "../../Context/ItemsContext";
import { useTheme } from "../../Context/ThemeContext";

export default function Index() {
  const { items, sellerSuggestions } = useItems();
  const { colors } = useTheme();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [filterType, setFilterType] = useState<'month' | 'year'>('month');

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const itemDate = new Date(item.date);
      const matchesYear = itemDate.getFullYear() === date.getFullYear();
      const matchesMonth = filterType === 'month' ? itemDate.getMonth() === date.getMonth() : true;
      const matchesSeller = selectedSeller ? item.seller === selectedSeller : true;
      return matchesMonth && matchesYear && matchesSeller;
    });
  }, [items, date, selectedSeller, filterType]);

  // Calculate totals
  const stats = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      acc.dag += parseFloat(item.dag) || 0;
      acc.qty += parseFloat(item.qty) || 0;
      acc.total += parseFloat(item.total) || 0;
      return acc;
    }, { dag: 0, qty: 0, total: 0 });
  }, [filteredItems]);

  // Calculate Land Stats
  const landStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    filteredItems.forEach(item => {
      const land = item.land;
      if (land) {
        stats[land] = (stats[land] || 0) + (parseFloat(item.dag) || 0);
      }
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]); // Sort by Dag count descending
  }, [filteredItems]);


  const formatDate = (date: Date) => {
    if (filterType === 'year') {
      return date.toLocaleDateString('default', { year: 'numeric' });
    }
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="mt-10 mb-6 flex-row justify-end items-end">
          <View>
            <Text className="text-3xl font-bold" style={{ color: colors.primary }}>Pravin B Parhad</Text>
            <Text className="text-2xl font-normal" style={{ color: colors.primary }}>Overview</Text>
            <Text className="text-gray-500 text-base">{filterType}ly performance</Text>
          </View>

          <View className="flex-row rounded-xl p-1 border border-gray-200" style={{ backgroundColor: colors.card }}>
            <TouchableOpacity
              onPress={() => setFilterType('month')}
              className={`px-4 py-2 rounded-lg ${filterType === 'month' ? 'bg-indigo-100' : 'bg-transparent'}`}
            >
              <Text style={{ color: filterType === 'month' ? colors.primary : 'gray', fontWeight: filterType === 'month' ? 'bold' : 'normal' }}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilterType('year')}
              className={`px-4 py-2 rounded-lg ${filterType === 'year' ? 'bg-indigo-100' : 'bg-transparent'}`}
            >
              <Text style={{ color: filterType === 'year' ? colors.primary : 'gray', fontWeight: filterType === 'year' ? 'bold' : 'normal' }}>Year</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View className="flex-row justify-between mb-6">
          {/* Date Filter */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center bg-white p-3 rounded-xl shadow-sm flex-1 mr-2"
            style={{ backgroundColor: colors.card }}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text className="ml-2 font-semibold" style={{ color: colors.text }}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>

          {/* Seller Filter */}
          <TouchableOpacity
            onPress={() => setShowSellerModal(true)}
            className="flex-row items-center bg-white p-3 rounded-xl shadow-sm flex-1 ml-2"
            style={{ backgroundColor: colors.card }}
          >
            <Ionicons name="person-outline" size={20} color={colors.primary} />
            <Text className="ml-2 font-semibold" style={{ color: colors.text }} numberOfLines={1}>
              {selectedSeller || "All Sellers"}
            </Text>
          </TouchableOpacity>
        </View>

        <DateFilterModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={setDate}
          mode={filterType}
          currentDate={date}
        />

        {/* Stats Cards */}
        <View className="flex-row justify-between mb-6">
          <View className="p-4 rounded-2xl shadow-sm flex-1 mr-2 items-center" style={{ backgroundColor: colors.card }}>
            <Text className="text-gray-500 font-medium mb-1">Total Dag</Text>
            <Text className="text-2xl font-bold" style={{ color: colors.primary }}>{stats.dag}</Text>
          </View>
          <View className="p-4 rounded-2xl shadow-sm flex-1 ml-2 items-center" style={{ backgroundColor: colors.card }}>
            <Text className="text-gray-500 font-medium mb-1">Total Qty</Text>
            <Text className="text-2xl font-bold" style={{ color: colors.primary }}>{stats.qty}</Text>
          </View>
        </View>

        <View className="p-5 rounded-2xl shadow-sm mb-8 items-center" style={{ backgroundColor: colors.card }}>
          <Text className="text-gray-500 font-medium mb-1">Total Amount</Text>
          <Text className="text-4xl font-extrabold" style={{ color: "red" }}>₹{stats.total.toFixed(2)}</Text>
        </View>

        {/* Land Overview */}
        {landStats.length > 0 && (
          <View className="mb-8">
            <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>Land Overview (Dag)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {landStats.map(([land, dag]) => (
                <View key={land} className="p-4 rounded-xl mr-3 shadow-sm min-w-[120px]" style={{ backgroundColor: colors.card }}>
                  <Text className="text-gray-500 font-medium mb-1">{land}</Text>
                  <Text className="text-2xl font-bold" style={{ color: colors.primary }}>{dag}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recent Items List (Filtered) */}
        <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>
          Transactions ({filteredItems.length})
        </Text>

        {filteredItems.length === 0 ? (
          <Text className="text-center text-gray-400 mt-4">No transactions found for this period.</Text>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} className="p-4 rounded-xl mb-3 shadow-sm" style={{ backgroundColor: colors.card }}>
              <View className="flex-row justify-between mb-1">
                <Text className="font-bold text-lg" style={{ color: colors.primary }}>{item.seller}</Text>
                <Text className="text-gray-500">{item.date}</Text>
              </View>
              <Text style={{ color: colors.text }} className="mb-2">{item.item}</Text>
              {item.land ? <Text className="text-gray-400 text-xs mb-2">Land: {item.land}</Text> : null}
              <View className="flex-row justify-between border-t border-gray-100 pt-2">
                <Text className="text-gray-600">Qty: {item.qty}</Text>
                <Text className="font-bold" style={{ color: colors.primary }}>₹{item.total}</Text>
              </View>
            </View>
          ))
        )}

        <View className="h-20" />
      </ScrollView>

      {/* Seller Modal */}
      <Modal
        visible={showSellerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSellerModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 h-2/3" style={{ backgroundColor: colors.background }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold" style={{ color: colors.text }}>Select Seller</Text>
              <TouchableOpacity onPress={() => setShowSellerModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedSeller(null);
                  setShowSellerModal(false);
                }}
                className={`p-4 rounded-xl mb-2 border ${!selectedSeller ? 'bg-indigo-50 border-indigo-500' : 'border-gray-200'}`}
              >
                <Text className={`font-semibold ${!selectedSeller ? 'text-indigo-700' : 'text-gray-700'}`}>All Sellers</Text>
              </TouchableOpacity>

              {sellerSuggestions.map((seller, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedSeller(seller);
                    setShowSellerModal(false);
                  }}
                  className={`p-4 rounded-xl mb-2 border ${selectedSeller === seller ? 'bg-indigo-50 border-indigo-500' : 'border-gray-200'}`}
                >
                  <Text className={`font-semibold ${selectedSeller === seller ? 'text-indigo-700' : 'text-gray-700'}`}>{seller}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}