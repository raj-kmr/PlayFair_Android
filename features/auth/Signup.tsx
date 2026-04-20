import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "./AuthContext";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import { MaterialIcons } from "@expo/vector-icons";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { signup } = useAuth();

  const handleSignUp = async () => {
    setError("");
    setSuccess(false);
    setIsLoading(true);
    try {
      await signup({ username, email, password });
      setSuccess(true);
    } catch (err) {
      console.error("Signup error: ", err);
      setError(getApiErrorMessage(err) || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerClassName="min-h-screen px-6 py-12"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View className="items-center mb-12">
        {/* Game Controller Icon */}
        <View className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
          <MaterialIcons name="person-add" size={40} color="#ffffff" />
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
          Create Account
        </Text>
        <Text className="text-slate-400 text-center text-base">
          Join the PlayFair community
        </Text>
      </View>

      {/* Success Message */}
      {success ? (
        <View className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
          <Text className="text-emerald-400 text-sm text-center">
            Account created! Redirecting to login...
          </Text>
        </View>
      ) : null}

      {/* Error Message */}
      {error ? (
        <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <Text className="text-red-400 text-sm text-center">{error}</Text>
        </View>
      ) : null}

      {/* Form Section */}
      <View className="gap-4">
        {/* Username Input */}
        <View>
          <View className="flex-row items-center mb-2 gap-2">
            <MaterialIcons name="person" size={18} color="#94a3b8" />
            <Text className="text-slate-300 text-sm font-medium">Username</Text>
          </View>
          <TextInput
            placeholder="PlayerOne"
            placeholderTextColor="#475569"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError("");
            }}
            autoCapitalize="none"
            className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-4 text-white text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </View>

        {/* Email Input */}
        <View>
          <View className="flex-row items-center mb-2 gap-2">
            <MaterialIcons name="email" size={18} color="#94a3b8" />
            <Text className="text-slate-300 text-sm font-medium">Email</Text>
          </View>
          <TextInput
            placeholder="player@example.com"
            placeholderTextColor="#475569"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            inputMode="email"
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-4 text-white text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </View>

        {/* Password Input */}
        <View>
          <View className="flex-row items-center mb-2 gap-2">
            <MaterialIcons name="lock" size={18} color="#94a3b8" />
            <Text className="text-slate-300 text-sm font-medium">Password</Text>
          </View>
          <TextInput
            placeholder="Create a strong password"
            placeholderTextColor="#475569"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-4 text-white text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            secureTextEntry
          />
        </View>

        {/* Signup Button */}
        <Pressable
          onPress={handleSignUp}
          disabled={isLoading}
          className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl py-4 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          <View className="flex-row items-center justify-center gap-2">
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="how-to-reg" size={20} color="#ffffff" />
                <Text className="text-white text-base font-semibold">
                  Create Account
                </Text>
              </>
            )}
          </View>
        </Pressable>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-slate-800" />
          <Text className="text-slate-500 text-sm mx-4">or</Text>
          <View className="flex-1 h-[1px] bg-slate-800" />
        </View>

        {/* Login Link */}
        <Link href="/signin" asChild>
          <Pressable className="bg-slate-800/50 border border-slate-700 rounded-xl py-4 active:bg-slate-800">
            <View className="flex-row items-center justify-center gap-2">
              <MaterialIcons name="login" size={20} color="#34d399" />
              <Text className="text-emerald-400 text-base font-semibold">
                Already have an account?
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>

      {/* Footer */}
      <View className="mt-12 items-center">
        <Text className="text-slate-500 text-sm text-center leading-relaxed">
          Start your productivity journey
        </Text>
        <Text className="text-slate-500 text-sm text-center">
          Turn tasks into rewards, one day at a time
        </Text>
      </View>
    </ScrollView>
  );
};

export default Signup;
