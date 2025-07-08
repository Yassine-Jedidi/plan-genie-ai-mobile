import { router } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import {
  Alert,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { authAPI } from "~/services/authAPI";

export default function SignInScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleBack = () => {
    router.back();
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authAPI.signIn(email, password);

      // Handle successful sign-in
      console.log("Sign-in successful:", result);

      // Navigate to home page
      router.push("/home");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen or show modal
    // For now, we'll show an alert asking for email
    Alert.prompt(
      "Reset Password",
      "Enter your email address to receive password reset instructions:",
      async (userEmail) => {
        if (userEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) {
          try {
            await authAPI.resetPassword(userEmail);
            Alert.alert(
              "Email Sent",
              "If an account with that email exists, a password reset link has been sent."
            );
          } catch (error: any) {
            Alert.alert(
              "Error",
              "Failed to send reset email. Please try again."
            );
          }
        } else {
          Alert.alert("Error", "Please enter a valid email address.");
        }
      },
      "plain-text",
      email
    );
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
        <Text className="text-base text-muted-foreground mb-6">
          Welcome back! Please sign in to continue
        </Text>

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
        <Pressable onPress={handleForgotPassword} className="mb-4">
          <Text className="text-primary font-medium">
            Forgot your password?
          </Text>
        </Pressable>

        {/* Error message (conditionally rendered) */}
        {error ? (
          <View className="flex-row items-center bg-destructive/90 rounded-lg p-4 mb-4">
            <Text className="text-destructive-foreground font-medium">
              {error}
            </Text>
          </View>
        ) : null}

        {/* Sign in button */}
        <Button
          className="mt-2 mb-2 py-3"
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-lg font-semibold text-primary-foreground">
            {loading ? "Signing in..." : "Sign in"}
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
