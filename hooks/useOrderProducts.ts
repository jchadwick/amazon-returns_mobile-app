import { OrderProduct } from "@/model";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabase, { resolve } from "./useSupabase";

export const useOrderProducts = (queryParams?: Partial<OrderProduct>) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["orderProducts", queryParams],
    queryFn: async () =>
      resolve(
        await supabase
          .from("orders")
          .select<any, OrderProduct>("*")
          .match(queryParams || {})
      ),
  });

  const markAsReturned = (o: OrderProduct) => {
    // TODO: mark as returned
    console.log(`${o.product_id} ${o.product_name} -> returned`);
    o.status = "returned";
    queryClient.invalidateQueries({ queryKey: ["orderProducts"] });
  };

  return { query, orderProducts: query.data, markAsReturned };
};
