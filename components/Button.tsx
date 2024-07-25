import { FontAwesome } from "@expo/vector-icons";
import { Icon } from "@expo/vector-icons/build/createIconSet";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { Pressable, Text } from "react-native";

type GetIconType<T> = T extends Icon<infer U, any> ? U : never;
type IconName = GetIconType<typeof FontAwesome>;

export type ButtonProps = PropsWithChildren<{
  onPress: () => void;
  className?: string;
  disabled?: boolean;
  icon?: IconName;
  variant?: keyof typeof ButtonVariants;
  size?: keyof typeof ButtonSizes;
  text?: string;
}>;

const ButtonVariants = {
  primary: "bg-blue-500 text-blue-200",
  secondary: "bg-gray-500 text-gray-200",
  outline: "border border-gray-700 text-gray-700",
  link: "text-blue-500",
  icon: "text-blue-500",
} as const;

const ButtonSizes = {
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
} as const;

export function Button({
  className,
  children,
  disabled,
  icon,
  onPress,
  size,
  text,
  variant,
}: ButtonProps) {
  const iconSize = size === "xs" ? 14 : size == "lg" ? 32 : 24;

  return (
    <Pressable
      className={clsx(
        "rounded-lg items-center justify-center m-1",
        ButtonVariants[variant || "primary"],
        ButtonSizes[size || "md"],
        className
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
      {!!icon && <FontAwesome size={iconSize} className="m-1" name={icon} />}
      {!!text && <Text>{text}</Text>}
    </Pressable>
  );
}
