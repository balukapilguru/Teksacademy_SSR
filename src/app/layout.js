// app/layout.jsx

import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SelectedCourseProvider } from "@/context/SelectedCourseContext";
import { NavbarProvider } from "@/components/coursePage/NavbarContext";
import LayoutWrapper from "@/components/clientcomponents/LayoutWrapper";
import GlobalClientWidgets from "@/components/clientcomponents/GlobalClientWidgets";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Best Software Courses Training Institute in Hyderabad | Teks Academy",
  description:
    "Teks Academy - Best software training institute in Hyderabad offering job-oriented courses.",
  verification: {
    google: "DGdROQ13YAUnCGHr13SfPxE-_gt1TOxs0rXPNpKr_dQ",
  },
};

async function getLetstalkAPI() {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/v1/home/lets-talk`, {
      next: { revalidate: 60 },
      signal: controller.signal,
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

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TTHG2VN8"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({
                  'gtm.start': new Date().getTime(),
                  event:'gtm.js'
                });
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';

                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;

                f.parentNode.insertBefore(j,f);

              })(window,document,'script','dataLayer','GTM-TTHG2VN8');
            `,
          }}
        />

        {/* Google Analytics */}
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

              function gtag(){
                dataLayer.push(arguments);
              }

              gtag('js', new Date());

              gtag('config', 'G-20FD4911FZ');
            `,
          }}
        />

        <SelectedCourseProvider>
          <NavbarProvider>
            <GlobalClientWidgets />

            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </NavbarProvider>
        </SelectedCourseProvider>
      </body>
    </html>
  );
}
