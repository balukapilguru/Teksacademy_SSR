import Script from "next/script";

export default function ThankYouLayout({ children }) {
  return (
    <>
      <head>
        <Script
          id="thank-you-conversion"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {
                'send_to': 'AW-17711259714/7_1GCJqq1NIbEMLAsf1B'
              });
            `,
          }}
        />
      </head>
      {children}
    </>
  );
}
