import { OrderProduct } from "@/model";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabase, { resolve } from "./useSupabase";
import { Image } from "expo-image";

export const useOrderProducts = (queryParams?: Partial<OrderProduct>) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["orderProducts", queryParams],
    queryFn: async () => {
      const orders = await resolve(
        await supabase
          .from("orders")
          .select<any, OrderProduct>("*")
          .match(queryParams || {})
      );

      const imageUrls = [
        ...(orders?.map((x) => x.return_image_url) || []),
        ...(orders?.map((x) => x.product_image_url) || []),
      ] as string[];

      await Image.prefetch(imageUrls);

      return orders;
    },
  });

  const markAsReturned = async (o: OrderProduct) => {
    const update: Partial<OrderProduct> = {
      status: "returned",
      return_date: new Date(),
    };

    await supabase.from("orders").update(update).eq("id", o.id);

    const cached = queryClient.getQueryData<OrderProduct[]>([
      "orderProducts",
      queryParams,
    ]);

    const cachedItem = cached?.find((x) => x.id === o.id);
    if (cachedItem) {
      Object.assign(cachedItem, update);
      queryClient.setQueryData(["orderProducts", queryParams], cached);
    }
  };

  return { query, orderProducts: query.data, markAsReturned };
};
