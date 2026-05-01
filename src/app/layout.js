import { Suspense } from "react";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import SpinWheel from "@/components/SpinWheel/SpinWheel";
import { SelectedCourseProvider } from "@/context/SelectedCourseContext";
import { NavbarProvider } from "@/components/coursePage/NavbarContext";
import AppLoader from "@/components/AppLoader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Teksacademy",
  description: "Teksversity offers AI-powered IT courses and online UG & PG programs with expert mentors, certifications, real-time projects & career support.",

  verification: {
    google: "DGdROQ13YAUnCGHr13SfPxE-_gt1TOxs0rXPNpKr_dQ",
  },
};

async function getLetstalkAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/v1/home/lets-talk`, {
      next: { revalidate: 60 },
    });

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
        {/* Scripts should be placed here, NOT inside <head> */}

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
            {/* <Navbar /> */}
            <main>{children}</main>

            <Suspense fallback={null}>
              <SpinWheel />
            </Suspense>

            {/* <Footer /> */}
          </NavbarProvider>
        </SelectedCourseProvider>
      </body>
    </html>
  );
}