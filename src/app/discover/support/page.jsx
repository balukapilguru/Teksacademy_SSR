import React from "react";
import Heading from "@/utility/Heading";
import Basicform from "@/components/clientcomponents/forms/Basicform";

export default async function contactus() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  let supportdata;

  try {
    const res = await fetch(`${baseUrl}/api/v1/home/support`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    supportdata = data?.data;
  } catch (err) {}
  const imageUrl = supportdata?.banner?.image?.src;

  return (
    <div className="main_container pt-16">
      <div className="justify-items-center">
        <Heading
          data={supportdata?.banner?.heading}
          text={supportdata?.banner?.heading}
        />
      </div>

      {/* Use the form here. Pass image + source */}
      {imageUrl && (
        <Basicform
          data={supportdata}
          course={353}
          sourcetype={39}
          // source={8}
          image={imageUrl}
        />
      )}
    </div>
  );
}
