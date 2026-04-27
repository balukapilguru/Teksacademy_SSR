import Aboutbanner from '@/components/discoverycomponents/Aboutbanner';
import Heading from '@/utility/Heading';
import Aboutmission from '@/components/discoverycomponents/Aboutmission';
import Locationcards from '@/components/discoverycomponents/Locationcards';

export const dynamic = "force-dynamic";

const Home = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  let aboutusdata = null;

  try {
    const res = await fetch(`${baseUrl}/api/v1/home/about-us`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("API error");

    const result = await res.json();
    aboutusdata = result?.data;
  } catch (err) {
    console.error("API Error:", err);
  }

  return (
    <div className="main_container">
      <div className="justify-items-center">
        <Heading
          data={aboutusdata?.title}
          text={aboutusdata?.title}
        />
      </div>

      <Aboutbanner data={aboutusdata} />
      <Aboutmission data={aboutusdata} />
      <Locationcards data={aboutusdata} />
    </div>
  );
};

export default Home;

