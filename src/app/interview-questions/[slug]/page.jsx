import PageClient from "./PageClient";

export default function Page() {
  return <PageClient />;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    alternates: {
      canonical: `https://teksacademy.com/interview-questions/${slug}`,
    },
  };
}