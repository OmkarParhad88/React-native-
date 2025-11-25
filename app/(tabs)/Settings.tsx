import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import XLSX from 'xlsx';
import { getItems } from '../../Services/Database';

const Settings = () => {
  const exportToExcel = async () => {
    try {
      const items = getItems();
      if (items.length === 0) {
        Alert.alert("No Data", "No items to export.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(items);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Items");

      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const uri = FileSystem.cacheDirectory + 'data.xlsx';

      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: 'base64'
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Data'
      });
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
      console.error(error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-3xl font-bold mb-10 text-gray-800">Settings</Text>

      <TouchableOpacity
        onPress={exportToExcel}
        className="bg-green-600 px-8 py-4 rounded-xl shadow-lg flex-row items-center"
      >
        <Text className="text-white font-bold text-lg">Export Data to Excel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
