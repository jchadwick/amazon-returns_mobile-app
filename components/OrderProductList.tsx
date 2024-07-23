import { OrderProduct } from "@/model";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

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
          className="flex flex-row rounded-md bg-white p-2 my-1 shadow-sm justify-center items-center"
          onPress={() => onSelected(x)}
          style={{ overflow: "hidden" }}
        >
          <Image
            className="max-w-24 min-w-24 size-24 self-center"
            source={{ uri: x.product_image_url }}
          />
          <View
            className="grow flex flex-col justify-between h-full"
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              paddingRight: 10,
              marginLeft: 10,
            }}
          >
            <Text className="text-lg">{x.product_name}</Text>
            <Text className="text-md text-gray-500">{x.return_method}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
