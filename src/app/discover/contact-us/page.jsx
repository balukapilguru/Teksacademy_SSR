  import React from "react";
  import Heading from "@/utility/Heading";
  import Basicform from "@/components/clientcomponents/forms/Basicform";
  import LocationDetails from "@/components/discoverycomponents/Locationcards";

  export default async function contactus() {
    const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
    let contactusdata ;

    try {
      const res = await fetch(`${baseUrl}/api/v1/home/contact-us`, { next: { revalidate: 60 } });
      const data = await res.json();
      contactusdata = data?.data;
    } catch (err) {
    }
  const imageUrl =
      
      contactusdata?.contactSection?.image?.src 
      
    return (
      <div className="main_container pt-16">
        <div className="justify-items-center">
          <Heading
            data={contactusdata?.contactSection?.heading}
            text={contactusdata?.contactSection?.heading}
          />
        </div>

        {/* Use the form here. Pass image + source */}
        {imageUrl &&  <Basicform
        
        data={contactusdata}
        course={352}
          sourcetype={38}
          // source={8}
          image={imageUrl}
        />}
      
      </div>
      
      
    );
  }

