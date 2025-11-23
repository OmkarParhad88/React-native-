import { Text, View ,ScrollView} from "react-native";
import {Link} from "expo-router";
export default function Index() {
  return (
    <View className="flex-1  bg-blue-200">

        <ScrollView className="flex-1 px-5 " showsVerticalScrollIndicator={false} contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 10
        }}>
            <Text className="text-5xl text-primary font-bold">Wellcome</Text>

        </ScrollView>

    </View>
  );
}
