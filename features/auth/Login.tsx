import { Link } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { useAuth } from "./AuthContext";
import { getApiErrorMessage } from "@/lib/api/apiClient";

export const Login = () => {
  // local state for controlled form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  // Authenticate user and get Jwt token to change global auth state
  const handleLogin = async () => {
    try {
     await login({email, password})
     alert("Login successful")
    } catch (err) {
      console.log(err);
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text style={{ fontSize: 32, fontWeight: "bold", margin: 10 }}>
        Sign In
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Sign in" onPress={handleLogin} />
      <Link href="/signup" asChild>
        <Button title="Sign up" />
      </Link>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});

export default Login;
