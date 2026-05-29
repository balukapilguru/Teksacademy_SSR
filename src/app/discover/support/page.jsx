import Supportclient from '@/app/discover/support/Supportclient';

export const dynamic = "force-dynamic";

// export async function generateMetadata() {
//   const baseUrl =
//     process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
//     process.env.NEXT_TEKS_SSR_API_URL;

//   try {
//     const res = await fetch(`${baseUrl}/api/v1/discover/contact-us`, {
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) throw new Error("API error");

//     const result = await res.json();
//     const meta = result?.data?.meta;

//     return {
//       title: meta?.title || "Contact Us",
//       description: meta?.description || "Get in touch with us",
//     };
//   } catch (err) {
//     return {
//       title: "Contact Us",
//       description: "Get in touch with us",
//     };
//   }
// }
export const metadata = {
  title: "Teks Academy Support - Get Assistance",
  description: "Need help? Contact the Teks Academy support team for prompt answers and assistance.",
  verification: {
    google: "DGdROQ13YAUnCGHr13SfPxE-_gt1TOxs0rXPNpKr_dQ",
  },
};

export default function Page() {
  return <Supportclient />;
}
