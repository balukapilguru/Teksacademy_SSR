import PageClient from "./PageClient";
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;
export const metadata = {
  alternates: {
    canonical: `https://teksacademy.com/success-stories`,
  },
};

export default function Page() {
  return <PageClient />;
}