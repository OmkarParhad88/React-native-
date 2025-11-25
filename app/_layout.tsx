import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ItemsProvider } from "../Context/ItemsContext";
import "./global.css";

export default function RootLayout() {
    return (
        <ItemsProvider>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "#000000",
            }}>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                        }}
                    /><Stack.Screen
                        name="Item/[id]"
                        options={{
                            headerShown: false,
                        }}
                    />

                </Stack>
            </SafeAreaView>
        </ItemsProvider>
    );
}   