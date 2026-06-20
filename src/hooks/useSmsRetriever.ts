import { useEffect } from "react";
import { NativeSMSRetriever } from "@ebrimasamba/react-native-sms-retriever";

type Props = {
  enabled: boolean;
  onOtpDetected: (otp: string) => void;
};

export function useSmsRetriever({ enabled, onOtpDetected }: Props) {
  useEffect(() => {
    if (!enabled) return;

    let smsSubscription: { remove: () => void } | undefined;
    let errorSubscription: { remove: () => void } | undefined;

    const start = async () => {
      try {
        const appHash = await NativeSMSRetriever.getAppHash();
        console.log("SMS Retriever App Hash:", appHash);

        NativeSMSRetriever.startSMSListener();

        smsSubscription = NativeSMSRetriever.onSMSRetrieved((otp: string) => {
          const code = otp.match(/\b\d{4}\b/)?.[0] ?? otp;

          if (code) {
            onOtpDetected(code);
          }
        });

        errorSubscription = NativeSMSRetriever.onSMSError((error) => {
          console.log("SMS Retriever error:", error);
        });
      } catch (error) {
        console.log("SMS Retriever unavailable:", error);
      }
    };

    start();

    return () => {
      smsSubscription?.remove();
      errorSubscription?.remove();
      NativeSMSRetriever.stopSMSListener();
    };
  }, [enabled]);
}