import { resendOtp, verifyOtp } from "@/api/auth.api";
import { COLORS } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSmsRetriever } from "@/hooks/useSmsRetriever";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 60;

export default function VerifyOtpScreen() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const submitOtp = async (otpValue: string) => {
    if (!mobile || otpValue.length !== OTP_LENGTH || isVerifying) return;

    try {
      setError("");
      setIsVerifying(true);

      await verifyOtp(mobile, otpValue);
      router.replace("/success");

    } catch {
      setError("Invalid OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!mobile || timer > 0 || isResending) return;

    try {
      setError("");
      setIsResending(true);

      await resendOtp(mobile);

      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(RESEND_SECONDS);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch {
      setError("Unable to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "");

    const updatedOtp = [...otp];
    updatedOtp[index] = digit.slice(-1);
    setOtp(updatedOtp);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const finalOtp = updatedOtp.join("");
    if (finalOtp.length === OTP_LENGTH) {
      submitOtp(finalOtp);
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const canResend = timer === 0 && !isResending && !isVerifying;

  useSmsRetriever({
    enabled: !isVerifying,
    onOtpDetected: (detectedOtp) => {
      const digits = detectedOtp.split("").slice(0, OTP_LENGTH);
      setOtp(digits);
      submitOtp(detectedOtp);
    },
  });

  return (
    <SafeAreaView
      style={{ backgroundColor: COLORS.background }}
      className="flex-1"
    >
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-8 w-8 items-center justify-center rounded-full bg-[#4A4C50]"
          >
            <Text style={{ color: COLORS.text }} className="text-xl">
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            style={{ color: COLORS.text }}
            className="-ml-8 flex-1 text-center text-base font-semibold"
          >
            Phone Verification
          </Text>
        </View>

        <Text
          style={{ color: COLORS.text }}
          className="mt-12 text-xl font-semibold leading-8"
        >
          Enter 4 digit OTP sent to your phone{"\n"}number
        </Text>

        <View className="mt-7 flex-row gap-3">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleBackspace(nativeEvent.key, index)
              }
              editable={!isVerifying}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              style={{
                color: COLORS.text,
                borderColor: error ? COLORS.error : COLORS.border,
              }}
              className="h-14 w-14 rounded-md border text-lg font-medium"
            />
          ))}
        </View>

        {error ? (
          <Text style={{ color: COLORS.error }} className="mt-2 text-xs">
            {error}
          </Text>
        ) : null}

        {isVerifying ? (
          <ActivityIndicator
            color={COLORS.primary}
            className="mt-4 self-start"
          />
        ) : null}

        <TouchableOpacity
          disabled={!canResend}
          onPress={handleResendOtp}
          className="mt-5 flex-row items-center"
        >
          {isResending ? (
            <ActivityIndicator color={COLORS.primary} size="small" />
          ) : (
            <Text
              style={{
                color: canResend ? COLORS.primary : COLORS.secondaryText,
              }}
              className="text-sm font-semibold"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}