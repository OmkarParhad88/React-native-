import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import XLSX from 'xlsx';
import { useItems } from '../../Context/ItemsContext';
import { useTheme } from '../../Context/ThemeContext';
import { getItems, insertItem } from '../../Services/Database';

const Settings = () => {
  const { theme, setTheme, colors } = useTheme();
  const { refreshItems } = useItems();

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

      // Calculate date range
      const dates = items.map(item => new Date(item.date).getTime());
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      const startMonth = `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, '0')}`;
      const endMonth = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}`;

      const fileName = startMonth === endMonth ? `${startMonth}.xlsx` : `${startMonth}_to_${endMonth}.xlsx`;
      const uri = FileSystem.cacheDirectory + fileName;

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

  const importFromExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      const wb = XLSX.read(fileContent, { type: 'base64' });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const data = XLSX.utils.sheet_to_json(ws);

      if (data.length === 0) {
        Alert.alert("No Data", "No data found in the Excel file.");
        return;
      }

      let importedCount = 0;
      for (const row of data as any[]) {
        // Basic validation - ensure at least seller and item exist
        if (row.seller && row.item) {
          const newItem = {
            id: row.id ? String(row.id) : Date.now().toString() + Math.random().toString().slice(2, 5),
            seller: String(row.seller),
            item: String(row.item),
            date: row.date ? String(row.date) : new Date().toISOString().split('T')[0],
            dag: row.dag ? String(row.dag) : "",
            qty: row.qty ? String(row.qty) : "0",
            price: row.price ? String(row.price) : "0",
            subtotal: row.subtotal ? String(row.subtotal) : "0",
            expenseTotal: row.expenseTotal ? String(row.expenseTotal) : "0",
            total: row.total ? String(row.total) : "0",
          };
          insertItem(newItem);
          importedCount++;
        }
      }

      refreshItems();
      Alert.alert("Success", `Successfully imported ${importedCount} items.`);

    } catch (error) {
      Alert.alert("Error", "Failed to import data");
      console.error(error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
      <Text className="text-3xl font-bold mb-10" style={{ color: colors.text }}>Settings</Text>

      <TouchableOpacity
        onPress={exportToExcel}
        className="px-8 py-4 rounded-xl shadow-lg flex-row items-center mb-5"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-white font-bold text-lg">Export Data to Excel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={importFromExcel}
        className="px-8 py-4 rounded-xl shadow-lg flex-row items-center mb-10"
        style={{ backgroundColor: '#2563eb' }} // Blue-600
      >
        <Text className="text-white font-bold text-lg">Import Data from Excel</Text>
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
