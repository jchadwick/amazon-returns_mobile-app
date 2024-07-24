import { Text, View } from "@/components/Themed";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useSupabase from "@/hooks/useSupabase";
import { useQueryClient } from "@tanstack/react-query";
import { Pressable, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logged in as {user?.email}</Text>

      <Pressable
        onPress={async () => {
          console.log(await supabase.auth.signOut());
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          queryClient.refetchQueries({ queryKey: ["currentUser"] });
        }}
      >
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
