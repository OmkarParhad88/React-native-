import { Ionicons } from "@expo/vector-icons";
import * as Print from 'expo-print';
import { useRouter } from "expo-router";
import { shareAsync } from 'expo-sharing';
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useItems } from "../../Context/ItemsContext";

export default function Index() {

  const router = useRouter();
  const { items } = useItems();

  const handleEdit = (item: any) => {
    router.push({
      pathname: "/(tabs)/New",
      params: { ...item }
    });
  };

  const generatePdf = async (item: any) => {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="text-align: center; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
          <h1 style="font-size: 30px; margin-bottom: 20px;">Invoice</h1>
          <div style="border: 1px solid #ddd; padding: 20px; margin: 20px; text-align: left; border-radius: 10px;">
            <p><strong>Seller:</strong> ${item.seller}</p>
            <p><strong>Date:</strong> ${item.date}</p>
            <hr style="border-top: 1px solid #eee; margin: 10px 0;" />
            <p><strong>Item:</strong> ${item.item}</p>
            <p><strong>Quantity:</strong> ${item.qty}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Subtotal:</strong> ${item.subtotal}</p>
            <p><strong>Expenses:</strong> ${item.expenseTotal}</p>
            <hr style="border-top: 1px solid #eee; margin: 10px 0;" />
            <h2 style="color: #4f46e5; text-align: right;">Total: ${item.total}</h2>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Error", "Failed to generate or share PDF");
      console.error(error);
    }
  };

  const generateMonthPdf = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Filter items for current month (assuming item.date is YYYY-MM-DD)
    const filteredItems = items.filter(item => item.date.startsWith(currentMonth));

    if (filteredItems.length === 0) {
      Alert.alert("No Data", "No items found for this month.");
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

    for (const seller in itemsBySeller) {
      const sellerItems = itemsBySeller[seller];
      let rowsHtml = '';
      let grandTotal = 0;

      sellerItems.forEach(item => {
        rowsHtml += `
          <tr>
            <td>${item.date}</td>
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
      });

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
                <td colspan="7" class="total-label" style="text-align: left; text-decoration: underline;">Total :</td>
                <td>${grandTotal.toFixed(2)}</td>
              </tr>
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
            .provider-name { font-size: 24px; font-weight: bold; color: #2ecc71; margin-bottom: 5px; }
            .provider-label { text-decoration: underline; }
            .info-line { margin: 5px 0; font-size: 14px; }
            .seller-section { margin-top: 30px; margin-bottom: 40px; page-break-inside: avoid; }
            .seller-name { font-size: 20px; font-weight: bold; color: #3498db; margin-bottom: 10px; }
            .seller-label { text-decoration: underline; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #e67e22; color: white; padding: 8px; text-align: center; border: 1px solid #000; font-size: 12px; }
            td { padding: 8px; text-align: center; border: 1px solid #000; background-color: #fce5cd; font-size: 12px; }
            .total-row td { font-weight: bold; }
            .total-label { text-align: left; padding-left: 10px; color: white; background-color: #e67e22; }
            .wavy { text-decoration: underline; text-decoration-style: wavy; text-decoration-color: red; -webkit-text-decoration-color: red; }
          </style>
        </head>
        <body>
          <div class="provider-header">
            <div class="provider-name"><span class="provider-label">Provider :</span> Pravin <span class="wavy">Parhad</span></div>
            <div class="info-line"><span style="text-decoration: underline;">Address :</span> kendur , parhadwadi</div>
            <div class="info-line"><span style="text-decoration: underline;">Email :</span> pravinparhad6@gmail.com</div>
            <div class="info-line"><span style="text-decoration: underline;">Phone :</span> 99303 58070</div>
          </div>
          ${sellersHtml}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
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
          <Text className="text-5xl text-primary font-bold">Welcome</Text>
          <TouchableOpacity onPress={() => generateMonthPdf()} className="bg-blue-600 p-3 rounded-lg">
            <Text className="text-white font-bold">Month Report</Text>
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <Text className="text-gray-500 text-lg">No items found. Add one!</Text>
        ) : (
          items.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleEdit(item)} className="bg-white p-4 rounded-xl mb-3 shadow-sm">
              <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-lg">{item.seller}</Text>
                <Text className="text-gray-500">{item.date}</Text>
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

    </View>
  );
}
