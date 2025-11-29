import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import XLSX from 'xlsx';
import { useTheme } from '../../Context/ThemeContext';
import { getItems } from '../../Services/Database';

const Settings = () => {
  const { theme, setTheme, colors } = useTheme();

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
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
      <Text className="text-3xl font-bold mb-10" style={{ color: colors.text }}>Settings</Text>

      <TouchableOpacity
        onPress={exportToExcel}
        className="px-8 py-4 rounded-xl shadow-lg flex-row items-center mb-10"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-white font-bold text-lg">Export Data to Excel</Text>
      </TouchableOpacity>

      <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>Select Theme</Text>
      <View className="flex-row flex-wrap justify-center gap-4">
        <TouchableOpacity
          onPress={() => setTheme('default')}
          className={`px-6 py-3 rounded-xl ${theme === 'default' ? 'bg-indigo-600' : 'bg-gray-300'}`}
        >
          <Text className={`${theme === 'default' ? 'text-white' : 'text-gray-800'} font-bold`}>default</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTheme('dark')}
          className={`px-6 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}
        >
          <Text className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-bold`}>Dark</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
