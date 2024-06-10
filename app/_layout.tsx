import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="ForgotPasswordScreen" options={{headerShown: false}}/>
      <Stack.Screen name="LoginScreen" options={{headerShown: false}}/>
      <Stack.Screen name="RegisterScreen" options={{headerShown: false}}/>
      <Stack.Screen name="(homes)" options={{headerShown: false}}/>
      <Stack.Screen name="ForgetPW" options={{headerShown: false}}/>
  
    </Stack>
  );
}
