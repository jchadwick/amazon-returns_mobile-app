import { NavigationButton } from "@/components/NavigationButton";
import { Pressable, Text, View } from "react-native";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { OrderProduct } from "@/model";
import { Image } from "expo-image";
import { useState } from "react";

export default function ReturnsWizard({
  onClose,
  selectedReturn: selectedReturnParam,
}: {
  onClose: () => void;
  selectedReturn: OrderProduct;
}) {
  const {
    query: { isLoading },
    orderProducts: returnsForSelectedLocation,
    markAsReturned,
  } = useOrderProducts({
    status: "return_created",
    return_location: selectedReturnParam?.return_location,
  });

  const [selectedReturn, setSelectedReturn] =
    useState<OrderProduct>(selectedReturnParam);

  if (isLoading) {
    return (
      <View className="grow flex flex-col justify-center items-center">
        Loading...
      </View>
    );
  }

  if (!returnsForSelectedLocation || returnsForSelectedLocation?.length === 0) {
    return <View>No more returns for this location</View>;
  }

  return (
    <OrderProductView
      onClose={onClose}
      orderProduct={selectedReturn}
      onReturned={() => markAsReturned(selectedReturn)}
      onPrevious={() => {
        setSelectedReturn(
          returnsForSelectedLocation[
            returnsForSelectedLocation.indexOf(selectedReturn) - 1 || 0
          ] || null
        );
      }}
      onNext={() => {
        setSelectedReturn(
          returnsForSelectedLocation[
            returnsForSelectedLocation.indexOf(selectedReturn) + 1 || 0
          ] || null
        );
      }}
      hasNext={
        (returnsForSelectedLocation.indexOf(selectedReturn) || 0) <
          (returnsForSelectedLocation.length || 0) - 1 || false
      }
      hasPrevious={
        (returnsForSelectedLocation.indexOf(selectedReturn) || 0) > 0 || false
      }
    />
  );
}

export function OrderProductView({
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
        <Pressable
          className="flex justify-center items-center"
          onPress={onClose}
          style={{ width: 40, height: 40 }}
        >
          <Text className="text-xl">X</Text>
        </Pressable>
      </View>
      <View className="flex flex-row p-4 gap-4 items-center ">
        <Image
          className="shadow-md"
          source={orderProduct.product_image_url}
          contentFit="cover"
          style={{ width: 75, height: 75 }}
        />
        <Text className="text-2xl">{orderProduct.product_name}</Text>
      </View>
      <View className="grow flex flex-col m-5 items-center justify-center gap-3">
        <View className="m-auto text-center">
          <Image
            contentFit="cover"
            style={{ width: 250, height: 250 }}
            source={orderProduct.return_image_url}
          />
        </View>
        <Text className="text-xl">{orderProduct.return_method}</Text>
        <Pressable className=" bg-green-500" onPress={onReturned}>
          <Text>Mark Returned</Text>
        </Pressable>
      </View>
      <View className="flex flex-row h-20 justify-between">
        <View className="h-full" style={{ width: "25%" }}>
          <NavigationButton disabled={!hasPrevious} onPress={onPrevious}>
            <Text>Prev</Text>
          </NavigationButton>
        </View>
        <View className="h-full" style={{ width: "25%" }}>
          <NavigationButton disabled={!hasNext} onPress={onNext}>
            <Text>Next</Text>
          </NavigationButton>
        </View>
      </View>
    </View>
  );
}
