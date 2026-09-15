import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        placeholderTextColor="#71717A"
        className={`h-14 rounded-xl border px-4 text-base text-primary ${
          error ? "border-danger" : "border-border bg-surface"
        }`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
