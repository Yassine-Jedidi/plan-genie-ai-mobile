import { router } from "expo-router";
import {
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Hero() {
  const { isDarkColorScheme } = useColorScheme();

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const buttonScale = useSharedValue(0.8);
  const floatingAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);

  // Start animations on mount
  React.useEffect(() => {
    // Staggered entrance animations
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 600 });
      subtitleTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, 200);

    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    }, 400);

    // Continuous animations
    floatingAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );

    glowAnimation.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );
  }, []);

  // Animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          floatingAnimation.value,
          [0, 1],
          [0, -10],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          pulseAnimation.value,
          [0, 0.5, 1],
          [1, 1.05, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      glowAnimation.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3],
      Extrapolate.CLAMP
    ),
  }));

  const handleGetStarted = () => {
    // Navigate to sign-in route
    router.push("/sign-in");
  };

  return (
    <View className="flex-1 justify-center items-center px-6 py-12">
      {/* Background glow effect */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: isDarkColorScheme
              ? "rgba(59, 130, 246, 0.1)"
              : "rgba(59, 130, 246, 0.05)",
          },
          glowStyle,
        ]}
      />

      {/* Main content */}
      <View className="items-center space-y-8">
        {/* Animated title */}
        <Animated.View style={[titleAnimatedStyle, floatingStyle]}>
          <Text className="text-4xl font-bold text-center text-foreground mb-2">
            Plan Genie AI
          </Text>
          <View className="flex-row justify-center items-center space-x-2">
            <Sparkles
              size={24}
              color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
            />
            <Text className="text-lg text-primary font-semibold">
              Your AI Planning Assistant
            </Text>
            <Sparkles
              size={24}
              color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
            />
          </View>
        </Animated.View>

        {/* Animated subtitle */}
        <Animated.View style={subtitleAnimatedStyle}>
          <Text className="text-base text-center text-muted-foreground leading-6 max-w-sm">
            Transform your productivity with intelligent task management, smart
            project organization, and AI-powered insights that adapt to your
            workflow.
          </Text>
        </Animated.View>

        {/* Feature highlights */}
        <Animated.View
          style={pulseStyle}
          className="flex-row flex-wrap justify-center gap-4 mt-6"
        >
          <View className="flex-row items-center space-x-2 bg-card/50 px-3 py-2 rounded-full">
            <Zap size={16} color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"} />
            <Text className="text-sm text-muted-foreground">
              Smart Planning
            </Text>
          </View>
          <View className="flex-row items-center space-x-2 bg-card/50 px-3 py-2 rounded-full">
            <Target
              size={16}
              color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
            />
            <Text className="text-sm text-muted-foreground">Goal Tracking</Text>
          </View>
          <View className="flex-row items-center space-x-2 bg-card/50 px-3 py-2 rounded-full">
            <TrendingUp
              size={16}
              color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
            />
            <Text className="text-sm text-muted-foreground">AI Insights</Text>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View style={buttonAnimatedStyle}>
          <AnimatedPressable
            onPress={handleGetStarted}
            className="active:opacity-80"
          >
            <Button className="px-8 py-4 bg-primary" onPress={handleGetStarted}>
              <View className="flex-row items-center space-x-2">
                <Text className="text-primary-foreground font-semibold text-lg">
                  Get Started
                </Text>
                <ArrowRight
                  size={20}
                  color={isDarkColorScheme ? "#000" : "#fff"}
                />
              </View>
            </Button>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
