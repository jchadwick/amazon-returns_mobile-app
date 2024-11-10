import useSupabase from "@/hooks/useSupabase";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

const LoginScreen = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleLogin = async () => {
    setError("");

    console.log(`Logging in user with email ${email} / ${password}`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      console.error(error);
      return;
    }

    console.log(`Sucessfully logged in user `, data.user);
    queryClient.refetchQueries({ queryKey: ["currentUser"] });
  };

  const handleMagicLink = async () => {
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      setError(error.message);
      console.error(error);
      return;
    }

    setIsMagicLinkSent(true);
  };

  return (
    <View style={styles.container}>
      <View className="w-full text-center flex justify-center items-center mb-10">
        <FontAwesome size={80} className="mb-8" name="truck" />
        <Text style={styles.title}>Amazon Returns</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {!!error && (
        <View>
          <Text className="text-red-500">{error}</Text>
        </View>
      )}
      {isMagicLinkSent && (
        <Text style={styles.successMessage}>
          Check your email for the magic link!
        </Text>
      )}
      <Button title="Login with Password" onPress={handleLogin} />
      <View style={styles.magicLinkButton}>
        <Button disabled={!email} title="Login with Magic Link" onPress={handleMagicLink} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  googleButton: {
    marginTop: 16,
  },
  magicLinkButton: {
    marginTop: 12,
  },
  successMessage: {
    textAlign: 'center',
    color: 'green',
    marginTop: 12,
    marginBottom: 12,
  },
});

export default LoginScreen;
