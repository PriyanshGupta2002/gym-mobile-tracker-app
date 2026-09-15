import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
};

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getContainerClass = () => {
    if (isDisabled) {
      return "bg-surface-light";
    }

    switch (variant) {
      case "secondary":
        return "border border-border bg-surface";

      case "outline":
        return "border border-border bg-transparent";

      case "ghost":
        return "bg-transparent";

      case "primary":
      default:
        return "bg-accent";
    }
  };

  const getTextClass = () => {
    if (isDisabled) {
      return "text-secondary";
    }

    switch (variant) {
      case "secondary":
        return "text-primary";

      case "outline":
        return "text-primary";

      case "ghost":
        return "text-secondary";

      case "primary":
      default:
        return "text-black";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-14 items-center justify-center rounded-xl ${getContainerClass()}`}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text className={`text-base font-bold ${getTextClass()}`}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
