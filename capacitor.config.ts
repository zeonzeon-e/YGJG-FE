import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ygjg.app",
  appName: "YGJG",
  webDir: "build",

  // Server configuration for development
  server: {
    // For development, you can test with a live reload URL
    // url: "http://localhost:3000",
    // cleartext: true,
  },

  // Plugin configurations
  plugins: {
    // Splash Screen configuration
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0e6244",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },

    // Status Bar configuration
    StatusBar: {
      style: "Light", // Light text for dark backgrounds
      backgroundColor: "#0e6244",
    },

    // Push Notifications configuration
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },

  // iOS-specific configuration
  ios: {
    contentInset: "automatic",
    allowsLinkPreview: true,
    scrollEnabled: true,
  },

  // Android-specific configuration
  android: {
    allowMixedContent: true,
    backgroundColor: "#0e6244",
  },
};

export default config;
