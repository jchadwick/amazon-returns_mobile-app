import { Button } from "@/components/Button";
import { Text, View } from "@/components/Themed";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PropsWithChildren, ReactNode, useMemo, useState } from "react";

dayjs.extend(relativeTime);

export default function ProfileScreen() {
  const { user, signout } = useCurrentUser();
  const queryClient = useQueryClient();

  const [lastDataUpdate, setLastDataUpdate] = useState(() =>
    queryClient
      .getQueryCache()
      .getAll()
      .map((x) => x.state.dataUpdatedAt)
      .sort()
      .reverse()
      .map((x) => new Date(x))
      .find(Boolean)
  );

  const queries = useMemo(
    () => queryClient.getQueryCache().getAll(),
    [lastDataUpdate]
  );

  const refreshData = async () => {
    console.log("Refreshing data...");
    queryClient
      .getQueryCache()
      .getAll()
      .forEach((x) => x.fetch());
    setLastDataUpdate(new Date());
  };

  return (
    <View className="grow flex p-3">
      <View className="flex flex-col h-20 bg-blue-500 items-center justify-center border-b-2">
        <Text className="text-xl font-bold">Logged in as {user?.email}</Text>
      </View>

      <View className="grow flex flex-col">
        <ProfileSection title="Data">
          {queries.map((x) => {
            const name = x.queryKey.join(" > ");
            return (
              <View
                key={name}
                className="flex flex-row my-1 justify-center items-center"
              >
                <Text className="grow">{name}</Text>
                <Text>{dayjs(x.state.dataUpdatedAt).fromNow()}</Text>
                <Button
                  size="xs"
                  icon="refresh"
                  variant="icon"
                  onPress={() => x.invalidate()}
                />
              </View>
            );
          })}

          <Button text="Refresh Data" onPress={refreshData} />
        </ProfileSection>
      </View>

      <View className="flex flex-col">
        <Button text="Logout" onPress={signout} />
      </View>
    </View>
  );
}

function ProfileSection({
  children,
  title,
}: PropsWithChildren<{ title: string | ReactNode }>) {
  return (
    <View className="flex flex-col p-2 bg-white rounded-md">
      {typeof title === "string" ? (
        <Text className="text-lg mb-1">{title}</Text>
      ) : (
        <>{title}</>
      )}
      {children}
    </View>
  );
}
