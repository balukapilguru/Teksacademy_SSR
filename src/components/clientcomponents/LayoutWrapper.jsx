"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Centralized route control
  const hiddenRoutes = [
    "/auth/signup",
    "/auth/signin",
    "/auth/login",
  ];

  const hideLayout = hiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!hideLayout && <Navbar />}
      
      <main>{children}</main>
      
      {!hideLayout && <Footer />}
    </>
  );
}