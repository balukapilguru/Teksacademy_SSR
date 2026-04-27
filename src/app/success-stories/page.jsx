import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import Image from "next/image";

export default async function SuccessStories() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  let storiesData = [];
  let storiesheading="";

  try {
    const res = await fetch(`${baseUrl}/api/v1/home/success-stories`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    storiesheading = data?.data?.heading||"Success Stories";
    storiesData = data?.data?.cards || [];
  } catch (err) {
  }

  return (
    <div className="main_container ">
      <div className="justify-items-center mb-8">
        <Heading data={storiesheading} text={storiesheading}/>

      </div>
     
      <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {storiesData.map((item, index) => (
          <div
            key={index}
            className="  "
          >
            <Image
              src={GetData({ url: item.image?.src })}
              alt={item.image?.alt || "success story"}
              width={400}
              height={300}
              className="rounded-lg w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

