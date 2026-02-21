import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { useAuth } from "./AuthContext";
import { getApiErrorMessage } from "@/lib/api/apiClient";

export const Signup = () => {
  // local states for form inputs
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth()

  // Sends signup request to backend to create new account
  const handleSignUp = async () => {
    try {
      await signup({username, email, password})
      alert("User Account created Successfully")
    } catch(err) {
      console.log("Signup error:  ", err)
      alert(getApiErrorMessage(err))
    }

    // await SecureStore.setItemAsync("email", email);
    // console.log("Key value saved");
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text style={{ fontSize: 32, fontWeight: "bold", margin: 10 }}>
        Sign Up
      </Text>
      <TextInput
        placeholder="Name"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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
      <Button title="Sign up" onPress={handleSignUp} />
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

export default Signup;
