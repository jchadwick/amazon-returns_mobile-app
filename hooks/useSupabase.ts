import { createClient, SupabaseClient } from "@supabase/supabase-js";

export { SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient;

export const useSupabase = () => {
  if (supabase) return supabase;

  supabase = createClient(
    process.env.EXPO_PUBLIC_ORDERS_API_URL!,
    process.env.EXPO_PUBLIC_ORDERS_API_KEY!
  );

  return supabase;
};

export const resolve = <T>({
  data,
  error,
}: {
  data: T[] | null;
  error: any;
}) => {
  if (error) {
    throw error;
  }
  return data;
};

export default useSupabase;
