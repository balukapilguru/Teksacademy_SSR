// app/layout.jsx
import { Suspense } from "react";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
import { SelectedCourseProvider } from "@/context/SelectedCourseContext";
import { NavbarProvider } from "@/components/coursePage/NavbarContext";
import AppLoader from "@/components/AppLoader";
import { MobileBottomNav } from "@/components/home-page/MobileBottomNav";
import LayoutWrapper from "@/components/clientcomponents/LayoutWrapper";
import { DesktopChatBot } from "@/components/DesktopChatBot";
import SpinWheel from "@/components/SpinWheel/SpinWheel";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Best Software Courses Training Institute in Hyderabad | Teks Academy",
  description: "Teks Academy - Best software training institute in Hyderabad offering job-oriented courses.",
  // verification: {
  //   google: "DGdROQ13YAUnCGHr13SfPxE-_gt1TOxs0rXPNpKr_dQ",
  // },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: "Best Software Training Institute in Hyderabad - Teks Academy",
    alternateName: "Teks Academy",
    url: "https://teksacademy.com/",
    logo: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/teksacademy_14years.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "18001204748",
      contactType: "technical support",
      contactOption: "TollFree",
      areaServed: "IN",
      availableLanguage: ["en", "Telugu", "Hindi"],
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PX8WDN3BHW"
          strategy="afterInteractive"
        />

        <Script
          id="ga-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PX8WDN3BHW');
            `,
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TTHG2VN8');`,
          }}
        />

        {/* Facebook Pixel */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '866536869761081');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TTHG2VN8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Facebook Pixel noscript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=866536869761081&ev=PageView&noscript=1"
          />
        </noscript>

        <SelectedCourseProvider>
          <NavbarProvider>
            <ToastContainer autoClose={1000} />
            <AppLoader />
            <LayoutWrapper>{children}</LayoutWrapper>
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
            <Suspense fallback={null}>
              {/* <SpinWheel /> */}
            </Suspense>
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