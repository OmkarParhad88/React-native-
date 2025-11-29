import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system/legacy';
import { getContentUriAsync } from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Print from 'expo-print';
import { useRouter } from "expo-router";
import { shareAsync } from 'expo-sharing';
import React from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useItems } from "../../Context/ItemsContext";

export default function Index() {

  const router = useRouter();
  const { items } = useItems();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [reportDate, setReportDate] = React.useState(new Date());
  const [reportExpense, setReportExpense] = React.useState("");
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showSearchDatePicker, setShowSearchDatePicker] = React.useState(false);

  const handleEdit = (item: any) => {
    router.push({
      pathname: "/(tabs)/New",
      params: { ...item }
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handlePdfAction = async (uri: string) => {
    Alert.alert("PDF Generated", "What would you like to do?", [
      {
        text: "Preview",
        onPress: async () => {
          try {
            const contentUri = await getContentUriAsync(uri);
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: contentUri,
              flags: 1,
              type: 'application/pdf',
            });
          } catch (e) {
            console.error(e);
            Alert.alert("Error", "Could not open preview.");
          }
        }
      },
      {
        text: "Share",
        onPress: async () => {
          await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        }
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ]);
  };

  const generatePdf = async (item: any) => {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 20px; }
            .provider-header { margin-bottom: 20px; }
            .provider-name { font-size: 24px; font-weight: bold; color: #ff0000ff; margin-bottom: 5px; }
            .provider-label {  }
            .info-line { margin: 5px 0; font-size: 14px; }
            .seller-section { margin-top: 30px; margin-bottom: 40px; page-break-inside: avoid; }
            .seller-name { font-size: 20px; font-weight: bold; color: #0099ffff; margin-bottom: 10px; }
            .seller-label { }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #22e650ff; color: black; padding: 8px; text-align: center; border: 1px solid #000; font-size: 12px; }
            td { padding: 8px; text-align: center; border: 1px solid #000; background-color: #f0f0f0ff; font-size: 12px; }
            .total-row td { font-weight: bold; }
            .total-label { text-align: left; padding-left: 10px; color: black; background-color: #e6e6e6ff; }
            td:last-child { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="provider-header">
            <div class="provider-name"><span class="provider-label">Provider :</span> Pravin <span>Parhad</span></div>
            <div class="info-line"><span >Address :</span> kendur , parhadwadi</div>
            <div class="info-line"><span >Email :</span> pravinparhad6@gmail.com</div>
            <div class="info-line"><span >Phone :</span> 99303 58070</div>
          </div>

          <div class="seller-section">
              <div class="seller-name"><span class="seller-label">Seller :</span> ${item.seller}</div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Dag</th>
                    <th>QTY</th>
                    <th>Price per Unit</th>
                    <th>Subtotal</th>
                    <th>Expenses</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.item}</td>
                    <td>${item.dag}</td>
                    <td>${item.qty}</td>
                    <td>${item.price}</td>
                    <td>${item.subtotal}</td>
                    <td>${item.expenseTotal}</td>
                    <td>${item.total}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="7" class="total-label" style="text-align: left;">Total :</td>
                    <td>${item.total}</td>
                  </tr>
                </tbody>
              </table>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      const filename = `${item.date}_${item.seller}_${item.total}.pdf`;
      const newUri = (FileSystem as any).documentDirectory + filename;
      await (FileSystem as any).moveAsync({
        from: uri,
        to: newUri,
      });
      await handlePdfAction(newUri);
    } catch (error) {
      Alert.alert("Error", "Failed to generate or share PDF");
      console.error(error);
    }
  };

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedSeller, setSelectedSeller] = React.useState<string | undefined>(undefined);
  const { sellerSuggestions } = useItems();

  const generateMonthPdf = async () => {
    const currentMonth = reportDate.toISOString().slice(0, 7); // YYYY-MM

    // Filter items for selected month
    let filteredItems = items.filter(item => item.date.startsWith(currentMonth));

    if (selectedSeller) {
      filteredItems = filteredItems.filter(item => item.seller === selectedSeller);
    }

    // Sort items by date (ascending)
    filteredItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredItems.length === 0) {
      Alert.alert("No Data", "No items found for this month" + (selectedSeller ? ` for ${selectedSeller}` : "") + ".");
      return;
    }

    // Group by seller
    const itemsBySeller: { [key: string]: typeof items } = {};
    filteredItems.forEach(item => {
      if (!itemsBySeller[item.seller]) {
        itemsBySeller[item.seller] = [];
      }
      itemsBySeller[item.seller].push(item);
    });

    let sellersHtml = '';
    const expenseAmount = parseFloat(reportExpense) || 0;

    for (const seller in itemsBySeller) {
      const sellerItems = itemsBySeller[seller];
      let rowsHtml = '';
      let grandTotal = 0;
      let totalDag = 0;
      let totalQty = 0;
      let totalPrice = 0;
      let totalSubtotal = 0;
      let totalExpenseTotal = 0;

      sellerItems.forEach(item => {
        rowsHtml += `
          <tr>
            <td>${formatDate(item.date)}</td>
            <td>${item.item}</td>
            <td>${item.dag}</td>
            <td>${item.qty}</td>
            <td>${item.price}</td>
            <td>${item.subtotal}</td>
            <td>${item.expenseTotal}</td>
            <td>${item.total}</td>
          </tr>
        `;
        grandTotal += parseFloat(item.total) || 0;
        totalDag += parseFloat(item.dag) || 0;
        totalQty += parseFloat(item.qty) || 0;
        totalPrice += parseFloat(item.price) || 0;
        totalSubtotal += parseFloat(item.subtotal) || 0;
        totalExpenseTotal += parseFloat(item.expenseTotal) || 0;
      });

      const averagePrice = sellerItems.length > 0 ? totalPrice / sellerItems.length : 0;
      const netTotal = grandTotal - expenseAmount;

      sellersHtml += `
        <div class="seller-section">
          <div class="seller-name"><span class="seller-label">Seller :</span> ${seller}</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Dag</th>
                <th>QTY</th>
                <th>Price per Unit</th>
                <th>Subtotal</th>
                <th>Expenses</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              <tr class="total-row">
                <td colspan="2" class="total-label" style="text-align: left;">Total :</td>
                <td style="color: red;">${totalDag}</td>
                <td style="color: red;">${totalQty}</td>
                <td style="color: red;">${averagePrice.toFixed(2)}</td>
                <td style="color: red;">${totalSubtotal.toFixed(2)}</td>
                <td style="color: red;">${totalExpenseTotal.toFixed(2)}</td>
                <td style="color: red;">${grandTotal.toFixed(2)}</td>
              </tr>
              ${expenseAmount > 0 ? `
              <tr class="total-row">
                <td colspan="7" class="total-label" style="text-align: left;">Less: Additional Expense :</td>
                <td>${expenseAmount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="7" class="total-label" style="text-align: left;">Net Total :</td>
                <td>${netTotal.toFixed(2)}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      `;
    }

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 20px; }
            .provider-header { margin-bottom: 20px; }
            .provider-name { font-size: 24px; font-weight: bold; color: #ff0000ff; margin-bottom: 5px; }
            .provider-label {  }
            .info-line { margin: 5px 0; font-size: 14px; }
            .seller-section { margin-top: 30px; margin-bottom: 40px; page-break-inside: avoid; }
            .seller-name { font-size: 20px; font-weight: bold; color: #0099ffff; margin-bottom: 10px; }
            .seller-label { }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #22e650ff; color: black; padding: 8px; text-align: center; border: 1px solid #000; font-size: 12px; }
            td { padding: 8px; text-align: center; border: 1px solid #000; background-color: #f0f0f0ff; font-size: 12px; }
            .total-row td { font-weight: bold; }
            .total-label { text-align: left; padding-left: 10px; color: black; background-color: #c0c0c0ff; }
            td:last-child { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="provider-header">
            <div class="provider-name"><span class="provider-label">Provider :</span> Pravin <span>Parhad</span></div>
            <div class="info-line"><span >Address :</span> kendur , parhadwadi</div>
            <div class="info-line"><span >Email :</span> pravinparhad6@gmail.com</div>
            <div class="info-line"><span >Phone :</span> 99303 58070</div>
          </div>
          ${sellersHtml}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      // Calculate total for filename
      const totalAmount = filteredItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
      const totalExpense = Object.keys(itemsBySeller).length * expenseAmount;
      const totalForFilename = totalAmount - totalExpense;

      const filename = `${currentMonth}_${selectedSeller || 'All'}_${totalForFilename.toFixed(2)}.pdf`;
      const newUri = (FileSystem as any).documentDirectory + filename;
      await (FileSystem as any).moveAsync({
        from: uri,
        to: newUri,
      });

      await handlePdfAction(newUri);
      setModalVisible(false);
      setReportExpense(""); // Reset expense after generation
      setSelectedSeller(undefined); // Reset selection
    } catch (error) {
      Alert.alert("Error", "Failed to generate or share PDF");
      console.error(error);
    }
  };

  return (
    <View className="flex-1  bg-blue-200">

      <ScrollView className="flex-1 px-5 " showsVerticalScrollIndicator={false} contentContainerStyle={{
        minHeight: "100%",
        paddingBottom: 10
      }}>
        <View className="flex-row justify-between items-center mt-10 mb-5">
          <Text className="text-5xl text-indigo-600 font-bold">Pravin Parhad</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-blue-600 p-3 rounded-lg">
            <Text className="text-white font-bold">Month Report</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white p-3 rounded-xl mb-4 flex-row items-center shadow-sm">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search seller, item, or date..."
            className="flex-1 ml-2 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowSearchDatePicker(true)} className="ml-2">
            <Ionicons name="calendar" size={24} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        {showSearchDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowSearchDatePicker(false);
              if (selectedDate) {
                const formattedDate = formatDate(selectedDate.toISOString().split('T')[0]);
                setSearchQuery(formattedDate);
              }
            }}
          />
        )}

        {items.filter(item =>
          item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.date.includes(searchQuery) ||
          formatDate(item.date).includes(searchQuery)
        ).length === 0 ? (
          <Text className="text-gray-500 text-lg text-center mt-10">No items found.</Text>
        ) : (
          items.filter(item =>
            item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.date.includes(searchQuery) ||
            formatDate(item.date).includes(searchQuery)
          ).map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleEdit(item)} className="bg-white p-4 rounded-xl mb-3 shadow-sm">
              <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-lg">{item.seller}</Text>
                <Text className="text-gray-500">{formatDate(item.date)}</Text>
              </View>
              <Text className="text-gray-700">Item: {item.item}</Text>
              <View className="flex-row justify-between mt-2 items-center">
                <View>
                  <Text className="font-semibold">Qty: {item.qty}</Text>
                  <Text className="font-bold text-blue-600">Total: {item.total}</Text>
                </View>
                <TouchableOpacity onPress={() => generatePdf(item)} className="bg-indigo-50 p-2 rounded-full border border-indigo-100">
                  <Ionicons name="download-outline" size={20} color="#4f46e5" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

      </ScrollView>

      {/* Seller Selection Modal */}
      {modalVisible && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/50 p-5">
          <View className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <Text className="text-xl font-bold mb-4 text-center">Select Month & Seller</Text>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-semibold">Report Month</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-gray-100 p-3 rounded-xl flex-row justify-between items-center"
              >
                <Text className="text-lg">{reportDate.toISOString().slice(0, 7)}</Text>
                <Ionicons name="calendar" size={20} color="#4f46e5" />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={reportDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setReportDate(selectedDate);
                  }
                }}
              />
            )}

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-semibold">Additional Expense</Text>
              <TextInput
                value={reportExpense}
                onChangeText={setReportExpense}
                keyboardType="numeric"
                placeholder="0.00"
                className="bg-gray-100 p-3 rounded-xl text-lg"
              />
            </View>

            <Text className="text-gray-600 mb-2 font-semibold">Select Seller (Optional)</Text>
            <ScrollView className="max-h-40 mb-4">
              <TouchableOpacity
                onPress={() => setSelectedSeller(undefined)}
                className={`p-3 border-b border-gray-100 ${selectedSeller === undefined ? 'bg-indigo-100' : 'active:bg-gray-50'}`}
              >
                <Text className={`text-lg text-center ${selectedSeller === undefined ? 'font-bold text-indigo-700' : ''}`}>All Sellers</Text>
              </TouchableOpacity>
              {sellerSuggestions.map((seller, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSeller(seller)}
                  className={`p-3 border-b border-gray-100 ${selectedSeller === seller ? 'bg-indigo-100' : 'active:bg-gray-50'}`}
                >
                  <Text className={`text-lg text-center ${selectedSeller === seller ? 'font-bold text-indigo-700' : ''}`}>{seller}</Text>
                </TouchableOpacity>
              ))}
              {sellerSuggestions.length === 0 && (
                <Text className="text-center text-gray-500">No sellers found.</Text>
              )}
            </ScrollView>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-200 p-3 rounded-xl flex-1 mr-2"
              >
                <Text className="text-center font-bold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={generateMonthPdf}
                className="bg-indigo-600 p-3 rounded-xl flex-1 ml-2"
              >
                <Text className="text-center font-bold text-white">Print Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </View>
  );
}
