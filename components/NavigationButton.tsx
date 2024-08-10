import clsx from "clsx";
import { Pressable } from "react-native";


export function NavigationButton({ disabled, onPress, children }: any) {
  return (
    <Pressable
      className={clsx(
        "flex align-middle items-center justify-center text-center rounded-sm p-2 w-full h-full",
        {
          "bg-gray-300": disabled,
          "text-white": !disabled,
          "bg-blue-500": !disabled,
        }
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
