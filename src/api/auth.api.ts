import { api } from "./client";

export const sendOtp = async (mobile: string) => {
  const response = await api.post("/sendOtp", { mobile });

  if (response.data?.status !== "success") {
    throw new Error(response.data?.msg || "Unable to send OTP");
  }

  return response.data;
};

export const verifyOtp = async (mobile: string, otp: string) => {
  const response = await api.post(`/verifyOtp?mobile=${mobile}&otp=${otp}`);

  if (response.data?.status !== "success") {
    throw new Error(response.data?.msg || "Invalid OTP");
  }

  return response.data;
};

export const resendOtp = async (mobile: string) => {
  const response = await api.post(`/resendOtp?mobile=${mobile}`);

  if (response.data?.status !== "success") {
    throw new Error(response.data?.msg || "Unable to resend OTP");
  }

  return response.data;
};