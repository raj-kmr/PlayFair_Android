import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { Stack } from "expo-router";;

export function RootNavigator() {
const  {isAuthenticated } = useAuth();


  // prevents flashing wrong screen
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator/>
    </AuthProvider>
  )
}
