// app/layout.jsx
import { Suspense } from "react";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';
 
import { ToastContainer } from "react-toastify";
import SpinWheel from "@/components/SpinWheel/SpinWheel";
import { SelectedCourseProvider } from "@/context/SelectedCourseContext";
import { NavbarProvider } from "@/components/coursePage/NavbarContext";
import AppLoader from "@/components/AppLoader";
import { MobileBottomNav } from "@/components/home-page/MobileBottomNav";
import LayoutWrapper from "@/components/clientcomponents/LayoutWrapper";
import { DesktopChatBot } from "@/components/DesktopChatBot"; // Import desktop chatbot
 
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});
 
export const metadata = {
  title: "Best Software Courses Training Institute in Hyderabad | Teks Academy",
  description: "Teks Academy - Best software training institute in Hyderabad offering job-oriented courses.",
  verification: {
    google: "DGdROQ13YAUnCGHr13SfPxE-_gt1TOxs0rXPNpKr_dQ",
  },
};
 
async function getLetstalkAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${baseUrl}/api/v1/home/lets-talk`, {
      next: { revalidate: 60 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}
 
export default async function RootLayout({ children }) {
  await getLetstalkAPI();
 
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WN8JPCXV');`,
          }}
        />
 
        <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-20FD4911FZ"
          strategy="afterInteractive"
        />
 
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-20FD4911FZ');
            `,
          }}
        />
 
        <SelectedCourseProvider>
          <NavbarProvider>
            <ToastContainer autoClose={1000} />
            <AppLoader />
           <LayoutWrapper>{children}</LayoutWrapper>
             <Toaster
          position="top-right"
          containerStyle={{
            position: "fixed",
            zIndex: 999999, // This makes toast appear above everything
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
            {/* <Suspense fallback={null}>
              <SpinWheel />
            </Suspense> */}
         
          </NavbarProvider>
        </SelectedCourseProvider>
       
        {/* Mobile Bottom Navigation - Only visible on mobile devices */}
        <MobileBottomNav />
       
        {/* Desktop ChatBot - Only visible on desktop devices */}
        <DesktopChatBot />
      </body>
    </html>
  );
}