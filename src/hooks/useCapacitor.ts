import { useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

/**
 * Hook to initialize Capacitor plugins and handle native features.
 * Only runs on native platforms (iOS/Android), not on web.
 */
export const useCapacitor = () => {
  const isNative = Capacitor.isNativePlatform();

  /**
   * Initialize Push Notifications
   */
  const initPushNotifications = useCallback(async () => {
    if (!isNative) return;

    try {
      // Request permission
      const permStatus = await PushNotifications.requestPermissions();

      if (permStatus.receive === "granted") {
        // Register with the push notification service
        await PushNotifications.register();
      }

      // Add listeners for push notifications
      PushNotifications.addListener("registration", (token) => {
        console.log("Push registration success, token:", token.value);
        // TODO: Send token to your server
        // apiClient.post('/api/push-token', { token: token.value });
      });

      PushNotifications.addListener("registrationError", (err) => {
        console.error("Push registration failed:", err.error);
      });

      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log("Push received:", notification);
          // Handle foreground notification
        },
      );

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          console.log("Push action performed:", notification);
          // Handle notification tap - navigate to relevant screen
          const data = notification.notification.data;
          if (data?.route) {
            window.location.href = data.route;
          }
        },
      );
    } catch (error) {
      console.error("Failed to initialize push notifications:", error);
    }
  }, [isNative]);

  /**
   * Initialize Status Bar styling
   */
  const initStatusBar = useCallback(async () => {
    if (!isNative) return;

    try {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: "#0e6244" });
    } catch (error) {
      console.error("Failed to initialize status bar:", error);
    }
  }, [isNative]);

  /**
   * Hide Splash Screen after app is ready
   */
  const hideSplashScreen = useCallback(async () => {
    if (!isNative) return;

    try {
      await SplashScreen.hide();
    } catch (error) {
      console.error("Failed to hide splash screen:", error);
    }
  }, [isNative]);

  // Initialize all native features on mount
  useEffect(() => {
    if (isNative) {
      initStatusBar();
      initPushNotifications();
      // Hide splash screen after a short delay to ensure content is rendered
      setTimeout(() => {
        hideSplashScreen();
      }, 500);
    }
  }, [isNative, initStatusBar, initPushNotifications, hideSplashScreen]);

  return {
    isNative,
    initPushNotifications,
    hideSplashScreen,
  };
};

export default useCapacitor;
