import { UserProfile } from "@/model";
import { useQuery } from "react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: "currentUser",
    queryFn: async (): Promise<UserProfile> =>
      Promise.resolve({
        id: "f4cf683e-b0d0-4bdc-9d1a-af8cbf8b1f80",
        name: "Jess Chadwick",
        email: "jesschadwick@gmail.com",
        token: "jesschadwick",
        avatar:
          "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      }),
  });
};
