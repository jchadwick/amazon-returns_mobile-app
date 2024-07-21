import { Text, View } from "@/components/Themed";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { OrderProduct } from "@/model";
import clsx from "clsx";
import { useState } from "react";
import { Button, Image, TouchableOpacity } from "react-native";
import { OrderProductList } from "../../components/OrderProductList";

export default function ReturnsScreen() {
  const { orderProducts: returns, markAsReturned } = useOrderProducts({
    status: "return_created",
  });

  const [selectedReturn, setSelectedReturn] = useState<OrderProduct | null>(
    null
  );

  return selectedReturn ? (
    <OrderProductView
      orderProduct={selectedReturn}
      onClose={() => setSelectedReturn(null)}
      onReturned={() => markAsReturned(selectedReturn)}
      onPrevious={() => {
        setSelectedReturn(
          returns?.[returns?.indexOf(selectedReturn) - 1 || 0] || null
        );
      }}
      onNext={() => {
        setSelectedReturn(
          returns?.[returns?.indexOf(selectedReturn) + 1 || 0] || null
        );
      }}
      hasNext={
        (returns?.indexOf(selectedReturn) || 0) < (returns?.length || 0) - 1 ||
        false
      }
      hasPrevious={(returns?.indexOf(selectedReturn) || 0) > 0 || false}
    />
  ) : (
    <OrderProductList orders={returns || []} onSelected={setSelectedReturn} />
  );
}

function OrderProductView({
  hasNext,
  hasPrevious,
  orderProduct,
  onClose,
  onPrevious,
  onNext,
  onReturned,
}: {
  hasNext: boolean;
  hasPrevious: boolean;
  orderProduct: OrderProduct;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReturned: () => void;
}) {
  return (
    <View className="flex flex-col w-full h-full p-2 gap-3">
      <View className="flex flex-row w-full justify-end">
        <Button title="X" onPress={() => onClose()} />
      </View>
      <View className="flex flex-row p-4 gap-4 items-center ">
        <Image
          className="size-24 shadow-md"
          source={{ uri: orderProduct.product_image_url }}
        />
        <Text className="text-2xl">{orderProduct.product_name}</Text>
      </View>
      <View className="grow flex flex-col m-5 items-center justify-center gap-3">
        <View className="m-auto text-center">
          <Image
            className="inset-0 aspect-square object-fit"
            source={require("../../assets/images/testQrCode.png")}
          />
        </View>
        <Text className="text-xl">{orderProduct.return_method}</Text>
      </View>
      <View className="flex flex-row h-20 justify-between">
        <View className="w-1/4">
          <NavigationButton disabled={!hasPrevious} onPress={onPrevious}>
            Prev
          </NavigationButton>
        </View>
        <View className="w-1/2 h-full p-3">
          <NavigationButton onPress={onReturned}>
            Mark
            <br />
            Returned
          </NavigationButton>
        </View>
        <View className="w-1/4 h-full">
          <NavigationButton disabled={!hasNext} onPress={onNext}>
            Next
          </NavigationButton>
        </View>
      </View>
    </View>
  );
}

function NavigationButton({ disabled, onPress, children }: any) {
  return (
    <TouchableOpacity
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
      activeOpacity={1}
    >
      {children}
    </TouchableOpacity>
  );
}
