import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

export const useCurrentUser = () => {
  const supabase = useSupabase();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User> =>
      (await supabase.auth.getSession()).data.session?.user ||
      ({
        id: "-1",
        email: "unknown",
      } as User),
  });

  return { query, user: query.data };
};
