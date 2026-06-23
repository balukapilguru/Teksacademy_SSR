"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Navbar = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

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
