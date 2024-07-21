import { OrderProduct } from "@/model";
import { ScrollView, TouchableOpacity, Image, Text } from "react-native";

export function OrderProductList({
  orders,
  onSelected = () => {},
}: {
  orders: OrderProduct[];
  onSelected?: (x: OrderProduct) => void;
}) {
  return (
    <ScrollView className="grow flex flex-col w-full h-32 p-2">
      {orders?.map((x) => (
        <TouchableOpacity
          key={x.id}
          className="flex flex-row gap-3 rounded-md bg-white p-2 my-1 shadow-sm justify-center items-center"
          onPress={() => onSelected(x)}
        >
          <Image className="size-24" source={{ uri: x.product_image_url }} />
          <Text className="grow text-lg">{x.product_name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
