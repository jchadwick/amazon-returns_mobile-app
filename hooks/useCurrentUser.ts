import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

export const useCurrentUser = () => {
  const queryKey = ["currentUser"];

  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<User> =>
      (await supabase.auth.getSession()).data.session?.user ||
      ({
        id: "-1",
        email: "unknown",
      } as User),
  });

  const signout = async () => {
    await supabase.auth.signOut();
    queryClient.invalidateQueries({ queryKey });
    queryClient.refetchQueries({ queryKey });
  };

  return { query, user: query.data, signout };
};
