import Aboutbanner from '@/components/discoverycomponents/Aboutbanner';
import Heading from '@/utility/Heading';
import Aboutmission from '@/components/discoverycomponents/Aboutmission';
import Locationcards from '@/components/discoverycomponents/Locationcards';
import Successteam from '@/components/discoverycomponents/Successteam';

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/v1/discover/about-us`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("API error");

    const result = await res.json();
    const meta = result?.data?.meta;

    return {
      title: meta?.title || "Default Title",
      description: meta?.description || "Default Description",
    };
  } catch (err) {
    console.error("Metadata API Error:", err);

    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}
const Home = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;
  let aboutusdata = null;

  try {
    const res = await fetch(`${baseUrl}/api/v1/discover/about-us`, {
      next: { revalidate: 60 },
    });
   

    if (!res.ok) throw new Error("API error");

    const result = await res.json();
    
    aboutusdata = result?.data;
    console.log(aboutusdata,"aboutuss")

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
       <Successteam data={aboutusdata}/>
      <Locationcards data={aboutusdata} />
     
    </div>
  );
};

export default Home;

