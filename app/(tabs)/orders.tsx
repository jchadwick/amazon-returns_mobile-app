import { OrderProductList } from "@/components/OrderProductList";
import { useOrderProducts } from "@/hooks/useOrderProducts";

export default function OrdersScreen() {
  const { orderProducts } = useOrderProducts();

  return <OrderProductList orders={orderProducts || []} />;
}
