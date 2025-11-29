import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ItemsProvider } from "../Context/ItemsContext";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";
import "./global.css";

const AppContent = () => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            </View>
        </SafeAreaView>
    );
};

export default function RootLayout() {
    return (
        <ThemeProvider>
            <ItemsProvider>
                <AppContent />
            </ItemsProvider>
        </ThemeProvider>
    );
}     