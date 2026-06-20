import { useEffect } from "react";
import { NativeSMSRetriever } from "@ebrimasamba/react-native-sms-retriever";

export function useSmsRetriever({
  enabled,
  onOtpDetected,
}: {
  enabled: boolean;
  onOtpDetected: (otp: string) => void;
}) {
  useEffect(() => {
    if (!enabled) return;

    if (!NativeSMSRetriever) {
      console.log("SMS Retriever native module unavailable");
      return;
    }

    let smsSubscription: { remove: () => void } | undefined;
    let errorSubscription: { remove: () => void } | undefined;

    const start = async () => {
      try {
        const appHash = await NativeSMSRetriever.getAppHash();
        console.log("SMS Retriever App Hash:", appHash);

        NativeSMSRetriever.startSMSListener();

        smsSubscription = NativeSMSRetriever.onSMSRetrieved(
          (otp: string) => {
            const code = otp.match(/\b\d{4}\b/)?.[0] ?? otp;

            if (code) {
              onOtpDetected(code);
            }
          }
        );

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

      if (NativeSMSRetriever?.stopSMSListener) {
        NativeSMSRetriever.stopSMSListener();
      }
    };
  }, [enabled]);
}