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

  return (
    <View className="flex-1  bg-blue-200">

        <ScrollView className="flex-1 px-5 " showsVerticalScrollIndicator={false} contentContainerStyle={{
        minHeight: "100%",
        paddingBottom: 10
        }}>
        <Text className="text-5xl text-primary font-bold mt-10 mb-5">Welcome</Text>

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
