import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessScreen() {
  return (
    <SafeAreaView
      style={{ backgroundColor: COLORS.background }}
      className="flex-1"
    >
      <View className="flex-1 items-center justify-center px-5">
        <Text style={{ color: COLORS.text }} className="text-2xl font-semibold">
          Login Successful
        </Text>

        <Text
          style={{ color: COLORS.secondaryText }}
          className="mt-3 text-center text-sm"
        >
          Your phone number has been verified successfully.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={{ backgroundColor: COLORS.primary }}
          className="mt-8 h-12 w-full items-center justify-center rounded-lg"
        >
          <Text style={{ color: COLORS.text }} className="font-medium">
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}