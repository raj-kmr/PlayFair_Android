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

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err) || "Login failed. Please try again.");
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
        <View className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
          <MaterialIcons name="sports-esports" size={40} color="#ffffff" />
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
          PlayFair
        </Text>
        <Text className="text-slate-400 text-center text-base">
          Level up your productivity
        </Text>
      </View>

      {/* Error Message */}
      {error ? (
        <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <Text className="text-red-400 text-sm text-center">{error}</Text>
        </View>
      ) : null}

      {/* Form Section */}
      <View className="gap-4">
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
            className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-4 text-white text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </View>

        {/* Password Input */}
        <View>
          <View className="flex-row items-center mb-2 gap-2">
            <MaterialIcons name="lock" size={18} color="#94a3b8" />
            <Text className="text-slate-300 text-sm font-medium">Password</Text>
          </View>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#475569"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-4 text-white text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          className="mt-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl py-4 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          <View className="flex-row items-center justify-center gap-2">
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="login" size={20} color="#ffffff" />
                <Text className="text-white text-base font-semibold">
                  Start Playing
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

        {/* Sign Up Link */}
        <Link href="/signup" asChild>
          <Pressable className="bg-slate-800/50 border border-slate-700 rounded-xl py-4 active:bg-slate-800">
            <View className="flex-row items-center justify-center gap-2">
              <MaterialIcons name="person-add" size={20} color="#a78bfa" />
              <Text className="text-violet-400 text-base font-semibold">
                Create New Account
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>

      {/* Footer */}
      <View className="mt-12 items-center">
        <Text className="text-slate-500 text-sm text-center leading-relaxed">
          Complete tasks to unlock gaming time
        </Text>
        <Text className="text-slate-500 text-sm text-center">
          Build healthy habits, one level at a time
        </Text>
      </View>
    </ScrollView>
  );
};

export default Login;
