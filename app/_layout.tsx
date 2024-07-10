import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="(outsidescreens)/index">
      <Stack.Screen name="(outsidescreens)/index" options={{ headerShown: true }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen" options={{ headerShown: true }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen1" options={{ headerShown: true }} />
      <Stack.Screen name="(outsidescreens)/ForgotPasswordScreen" options={{ headerShown: true }} />
      <Stack.Screen name="(outsidescreens)/LoginScreen" options={{ headerShown: true }} />
      <Stack.Screen name="(outsidescreens)/RegisterScreen" options={{ headerShown: true }} />
      <Stack.Screen name="(outsidescreens)/OtpVerificationScreen" options={{ headerShown: true }} />
      <Stack.Screen name="(outsidescreens)/ResetPasswordScreen" options={{ headerShown: true }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
      <Stack.Screen name="(insidescreens)/JobDetail" options={{ headerShown: true }} />
    </Stack>
  );
}
