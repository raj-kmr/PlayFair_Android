import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";

export const Signup = () => {
  // local states for form inputs
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Sends signup request to backend to create new account
  const handleSignUp = async () => {
    try {
      console.log(email, name, password)
      const res = await fetch("http://192.168.1.13:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: name,
          email,
          password
        })
      })
      
      const data = await res.json();
      console.log("Response", data);
  
      if(!res.ok){
        alert(data.message || "Signup failed")
        return;
      }
  
      alert("Signup succssful")
    } catch(err) {
      console.log("Signup error:  ", err)
      alert("Network error")
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
        value={name}
        onChangeText={setName}
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
