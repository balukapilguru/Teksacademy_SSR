"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const AppLoader = dynamic(() => import("@/components/AppLoader"), {
  ssr: false,
});

const MobileBottomNav = dynamic(
  () =>
    import("@/components/home-page/MobileBottomNav").then(
      (mod) => mod.MobileBottomNav
    ),
  { ssr: false }
);

const DesktopChatBot = dynamic(
  () => import("@/components/DesktopChatBot").then((mod) => mod.DesktopChatBot),
  { ssr: false }
);

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

export default function GlobalClientWidgets() {
  const router = useRouter();

  useEffect(() => {
    // Immediately prefetch /thankyou so any form submission navigates with 0 latency
    try {
      router.prefetch("/thankyou");
    } catch {}

    const isRecaptchaNoise = (reason) => {
      if (!reason) return false;
      const msg = typeof reason === "string" ? reason : reason.message || reason.reason || "";
      if (typeof msg !== "string") return false;
      return (
        msg.includes("reCAPTCHA") ||
        msg.includes("Timeout (b)") ||
        msg.includes("timeout-or-duplicate")
      );
    };

    const handleRejection = (event) => {
      if (isRecaptchaNoise(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
      }
    };

    const handleError = (event) => {
      if (isRecaptchaNoise(event.error) || isRecaptchaNoise(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, [router]);
  return (
    <>
      <ToastContainer autoClose={1000} />

      <AppLoader />

      <Toaster
        position="top-right"
        containerStyle={{
          position: "fixed",
          zIndex: 999999,
          top: 0,
          right: 0,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            zIndex: 999999,
          },

          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#fff",
              zIndex: 999999,
            },
          },

          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
              zIndex: 999999,
            },
          },
        }}
      />

      <MobileBottomNav />

      <DesktopChatBot />
    </>
  );
}
