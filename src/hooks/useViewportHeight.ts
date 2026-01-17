import { useEffect } from "react";

/**
 * Dynamic viewport height hook for mobile browsers.
 * Solves the issue where 100vh doesn't account for browser chrome
 * (address bar, bottom nav) on mobile devices.
 *
 * Usage: Call this hook once in your root component (e.g., App or index.tsx)
 *
 * CSS: Use calc(var(--vh, 1vh) * 100) instead of 100vh
 */
export const useViewportHeight = (): void => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Set initial value
    setVh();

    // Update on resize (handles address bar show/hide)
    window.addEventListener("resize", setVh);

    // Also update on orientation change for mobile
    window.addEventListener("orientationchange", () => {
      // Delay to ensure accurate measurement after orientation change
      setTimeout(setVh, 100);
    });

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);
};

export default useViewportHeight;
