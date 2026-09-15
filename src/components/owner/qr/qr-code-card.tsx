import { forwardRef } from "react";
import type { View as RNView } from "react-native";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type QrCodeCardProps = {
  value: string;
  title: string;
  description: string;
};

export const QrCodeCard = forwardRef<RNView, QrCodeCardProps>(
  ({ value, title, description }, ref) => {
    return (
      <View
        ref={ref}
        collapsable={false}
        className="items-center rounded-3xl border border-border bg-surface p-6"
      >
        <Text className="text-xl font-bold text-primary">{title}</Text>

        <Text className="mt-2 text-center text-sm leading-5 text-secondary">
          {description}
        </Text>

        <View className="mt-6 rounded-2xl bg-white p-5">
          <QRCode
            value={value}
            size={220}
            backgroundColor="white"
            color="black"
          />
        </View>

        <Text className="mt-5 text-center text-xs text-secondary">
          Scan this QR code using GymApp
        </Text>
      </View>
    );
  },
);

QrCodeCard.displayName = "QrCodeCard";
