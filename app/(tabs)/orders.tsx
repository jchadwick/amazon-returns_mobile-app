import { Text, View } from "@/components/Themed";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { ScrollView } from "react-native";

export default function OrdersScreen() {
  const { orderProducts } = useOrderProducts();

  return (
    <ScrollView className="grow flex flex-col w-56 h-32 p-2 gap-3">
      {orderProducts?.map((x) => (
        <View key={x.id} className="flex flex-row gap-2">
          <Text className="grow">{x.product_name}</Text>
          <Text className="w-12">{x.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
