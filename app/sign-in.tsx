import { router } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import { Pressable, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { GoogleIcon } from "~/lib/icons/Google";

export default function SignInScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false); // Toggle for demo

  const handleBack = () => {
    router.back();
  };

  const handleSignIn = () => {
    // TODO: Add sign-in logic
    setShowSuccess(true);
  };

  const handleGoogleSignIn = () => {
    // TODO: Add Google sign-in logic
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <View className="w-full max-w-md  rounded-2xl p-6 ">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <Button variant="ghost" onPress={handleBack} className="mr-2">
            <ArrowLeft size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
          </Button>
          <Text className="text-2xl font-bold text-foreground">
            Sign in to Plan Genie AI
          </Text>
        </View>
        <Text className="text-base text-muted-foreground mb-4">
          Welcome back! Please sign in to continue
        </Text>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="flex-row items-center justify-center mb-4"
          onPress={handleGoogleSignIn}
        >
          <View className="flex-row items-center justify-center flex-1">
            <GoogleIcon
              size={20}
              color={isDarkColorScheme ? "#fff" : "#4285F4"}
              style={{ marginRight: 8 }}
            />
            <Text className="font-medium">Google</Text>
          </View>
        </Button>

        {/* Divider */}
        <View className="flex-row items-center my-2">
          <View className="flex-1 h-px bg-border" />
          <Text className="mx-2 text-muted-foreground">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Email Field */}
        <Text className="font-semibold mb-1 mt-2">Email address</Text>
        <TextInput
          className="border border-border rounded-md px-4 py-3 mb-3 text-foreground bg-background"
          placeholder="Email address"
          placeholderTextColor={isDarkColorScheme ? "#888" : "#aaa"}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password Field */}
        <Text className="font-semibold mb-1">Password</Text>
        <View className="flex-row items-center border border-border rounded-md px-2 py-1 mb-2 bg-background">
          <TextInput
            className="flex-1 px-2 py-2 text-foreground"
            placeholder="Password"
            placeholderTextColor={isDarkColorScheme ? "#888" : "#aaa"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            {showPassword ? (
              <EyeOff size={22} color={isDarkColorScheme ? "#fff" : "#000"} />
            ) : (
              <Eye size={22} color={isDarkColorScheme ? "#fff" : "#000"} />
            )}
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <Pressable onPress={() => {}} className="mb-4">
          <Text className="text-primary font-medium">
            Forgot your password?
          </Text>
        </Pressable>

        {/* Success/info message (conditionally rendered) */}
        {showSuccess && (
          <View className="flex-row items-center bg-success/90 rounded-lg p-4 mb-4">
            <Text className="text-success-foreground font-medium">
              Success!
            </Text>
          </View>
        )}

        {/* Sign in button */}
        <Button className="mt-2 mb-2 py-3" onPress={handleSignIn}>
          <Text className="text-lg font-semibold text-primary-foreground">
            Sign in
          </Text>
        </Button>

        {/* Sign up link */}
        <View className="flex-row justify-center mt-2">
          <Text className="text-muted-foreground">Don't have an account? </Text>
          <Pressable
            onPress={() => {
              router.push("/sign-up");
            }}
          >
            <Text className="text-primary font-medium">Sign up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
