import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { sendOtp } from "@/api/auth.api";
import { COLORS } from "@/constants/colors";
import { LoginFormData, loginSchema } from "@/types/auth";

export default function LoginScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      mobile: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await sendOtp(data.mobile);

      router.push({
        pathname: "/verify-otp",
        params: { mobile: data.mobile },
      });
    } catch (error) {
      setError("mobile", {
        message: "Unable to send OTP. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: COLORS.background }}
      className="flex-1"
    >
      <View className="flex-1 justify-center px-5">
        <Text
          style={{ color: COLORS.text }}
          className="mb-6 text-center text-2xl font-semibold"
        >
          Login to Your Account
        </Text>

        <Controller
          control={control}
          name="mobile"
          render={({ field: { value, onChange, onBlur } }) => (
            <View>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ borderColor: COLORS.border }}
                  className="h-12 w-16 items-center justify-center rounded-lg border"
                >
                  <Text style={{ color: COLORS.text }} className="text-lg">
                    +91 ▼
                  </Text>
                </TouchableOpacity>

                <TextInput
                  value={value}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    onChange(cleaned);
                  }}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="9999999999"
                  placeholderTextColor={COLORS.placeholder}
                  style={{
                    color: COLORS.text,
                    borderColor: errors.mobile
                      ? COLORS.error
                      : COLORS.border,
                  }}
                  className="h-12 flex-1 rounded-lg border px-4 py-2 text-lg"
                />
              </View>

              {errors.mobile?.message ? (
                <Text className="mt-2 text-xs text-red-400">
                  {errors.mobile.message}
                </Text>
              ) : null}
            </View>
          )}
        />

        <TouchableOpacity
          disabled={!isValid || isSubmitting}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          style={{
            backgroundColor:
              isValid && !isSubmitting ? COLORS.primary : COLORS.disabled,
          }}
          className="mt-7 h-12 items-center justify-center rounded-xl px-2 py-3"
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={{ color: COLORS.text }} className="font-bold text-base">
              Send OTP
            </Text>
          )}
        </TouchableOpacity>

        <View className="mt-5 flex-row justify-center">
          <Text style={{ color: COLORS.secondaryText }} className="text-sm font-semibold">
            Don't have account?{" "}
          </Text>

          <Text style={{ color: COLORS.primary }} className="text-sm font-semibold">
            Create Account
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}