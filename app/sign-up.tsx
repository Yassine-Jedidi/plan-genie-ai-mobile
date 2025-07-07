import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import { Pressable, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { GoogleIcon } from "~/lib/icons/Google";
import { authAPI } from "~/services/authAPI";

export default function SignUpScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.signUp(email, password);
      
      // Handle successful sign-up
      console.log("Sign-up successful:", result);
      
      Alert.alert(
        "Account Created",
        "Your account has been created successfully. Please check your email for verification.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/sign-in"),
          },
        ]
      );
      
    } catch (error: any) {
      console.error("Sign-up error:", error);
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { url } = await authAPI.getGoogleOAuthURL();
      // TODO: Implement Google OAuth flow for mobile
      console.log("Google OAuth URL:", url);
      Alert.alert("Google Sign Up", "Google OAuth implementation needed for mobile");
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      Alert.alert("Error", "Failed to initialize Google sign-up");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <View className="w-full max-w-md rounded-2xl p-6">
        <Text className="text-2xl font-bold text-foreground mb-2 text-center">
          Sign up for Plan Genie AI
        </Text>
        <Text className="text-base text-muted-foreground mb-4 text-center">
          Create your account to get started
        </Text>

        {/* Google Sign Up */}
        <Button
          variant="outline"
          className="flex-row items-center justify-center mb-4"
          onPress={handleGoogleSignUp}
        >
          <View className="flex-row items-center justify-center flex-1">
            <GoogleIcon size={20} style={{ marginRight: 8 }} />
            <Text className="font-medium">Google</Text>
          </View>
        </Button>

        {/* Divider */}
        <View className="flex-row items-center my-2">
          <View className="flex-1 h-px bg-border" />
          <Text className="mx-2 text-muted-foreground">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Name Field */}
        <Text className="font-semibold mb-1 mt-2">Name</Text>
        <TextInput
          className="border border-border rounded-md px-4 py-3 mb-3 text-foreground bg-background"
          placeholder="Your name"
          placeholderTextColor={isDarkColorScheme ? "#888" : "#aaa"}
          value={name}
          onChangeText={setName}
        />

        {/* Email Field */}
        <Text className="font-semibold mb-1">Email address</Text>
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

        {/* Confirm Password Field */}
        <Text className="font-semibold mb-1">Confirm Password</Text>
        <View className="flex-row items-center border border-border rounded-md px-2 py-1 mb-2 bg-background">
          <TextInput
            className="flex-1 px-2 py-2 text-foreground"
            placeholder="Confirm Password"
            placeholderTextColor={isDarkColorScheme ? "#888" : "#aaa"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
            {showConfirmPassword ? (
              <EyeOff size={22} color={isDarkColorScheme ? "#fff" : "#000"} />
            ) : (
              <Eye size={22} color={isDarkColorScheme ? "#fff" : "#000"} />
            )}
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? (
          <Text className="text-red-500 mb-2 text-center">{error}</Text>
        ) : null}

        {/* Sign Up Button */}
        <Button
          className="mt-2 mb-2 py-3"
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-lg font-semibold text-primary-foreground">
            {loading ? "Signing up..." : "Sign up"}
          </Text>
        </Button>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-2">
          <Text className="text-muted-foreground">
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => router.replace("/sign-in")}>
            <Text className="text-primary font-medium">Sign in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
