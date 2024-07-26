import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  return (
    <Stack initialRouteName="(outsidescreens)/index">
      <Stack.Screen name="(outsidescreens)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen1" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen2" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/ForgotPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/RegisterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/VerifyAccount" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/ResetPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/ChangePassword" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/FollowCompany" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/AppliedJobs" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/JobDetail" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/CompanyDetail" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/CompanyDetail2" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/ChatRoom" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/AppliedJobByTime" options={{ headerShown: false }} />
    </Stack>
  );
}
