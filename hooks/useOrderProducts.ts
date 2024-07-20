import { OrderProduct } from "@/model";
import { useQuery, useQueryClient } from "react-query";

export const useOrderProducts = (queryParams?: Partial<OrderProduct>) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: "orderProducts",
    queryFn: async () => {
      const orders: OrderProduct[] = new Array(10).fill(0).map((_, id) => ({
        id,
        account_id: `account_${id}`,
        order_id: `order_${id}`,
        product_id: `product_${id}`,
        product_name: `Product ${id}`,
        product_url: `Product ${id}`,
        return_url: `Product ${id}`,
        return_method: "Kohl's Dropoff",
        product_image_url: `https://picsum.photos/200/300?random=${id}`,
        return_image_url: require("../assets/images/testQrCode.png"),
        status:
          id % 3 == 0 ? "return_created" : id % 2 === 0 ? "shipped" : "created",
      }));

      return orders.filter(
        (x) => !queryParams || x.status === queryParams.status
      );
    },
  });

  const markAsReturned = (o: OrderProduct) => {
    // TODO: mark as returned
    console.log(`${o.product_id} ${o.product_name} -> returned`);
    o.status = "returned";
    queryClient.invalidateQueries("orderProducts");
  };

  return { query, orderProducts: query.data, markAsReturned };
};
