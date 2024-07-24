import { OrderProduct } from "@/model";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";

export function OrderProductList({
  orders,
  onSelected = () => {},
}: {
  orders: OrderProduct[];
  onSelected?: (x: OrderProduct) => void;
}) {
  return (
    <ScrollView className="grow flex flex-col w-full h-32 p-2 bg-transparent">
      {orders?.map((x) => (
        <Pressable
          key={x.id}
          className="flex flex-row rounded-md bg-white p-2 my-1 shadow-sm justify-center items-center overflow-clip"
          onPress={() => onSelected(x)}
        >
          <Image
            source={x.product_image_url}
            cachePolicy="memory-disk"
            contentFit="cover"
            transition={500}
            style={{ width: 75, height: 75 }}
          />
          <View className="grow flex flex-col justify-between h-full px-2 py-2">
            <Text className="text-lg">{x.product_name}</Text>
            <Text className="text-md text-gray-500">{x.return_method}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
