import { Navigator, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="CompleteProfileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="CompleteProfileScreen1" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="OtpVerificationScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ResetPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(homes)" options={{ headerShown: false }} />
    </Stack>
  );
}
