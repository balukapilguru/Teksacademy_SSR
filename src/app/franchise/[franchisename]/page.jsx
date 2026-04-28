import Banner from '@/components/Franchise/Banner';
import { BookOpen, Users, Zap, Award, CheckCircle, ArrowRight } from "lucide-react";

import Certificationcards from '../../../components/allcoursepage/Certificationcards';
import React from 'react'
import Nutshell from '@/components/Franchise/Nutshell'
import Awards from '@/components/home-page/ui-components/Awards';
import Gallery from '@/components/home-page/ui-components/Gallery';
import Featuredin from '@/components/home-page/ui-components/Featuredin';
import Accordian from '../../../components/coursePage/Accordian'
import AboutTeks from '@/components/Franchise/Aboutus';
import Maps from '@/components/Franchise/Maps'
import Excel from '@/components/Franchise/Excelwithteksversity';

export const dynamic = "force-dynamic"; 

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;


  if (!baseUrl) {
    console.error("❌ ERROR: NEXT_PUBLIC_BASE_URL is missing.");
    return null;
  }

  const apiUrl = `${baseUrl}/api/v1/home/franchise/kakinada`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error("❌ API Failed:", res.status);
      return null;
    }

    const response = await res.json();
    return response?.data || null;

  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return null;
  }
}

const Page = async () => {
  const data = await getData();


  if (!data) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        Failed to load data from backend.  
        <br />
        Please check API or NEXT_PUBLIC_BASE_URL.
      </div>
    );
  }

  return (
    <div className='main_container'>
      <Banner data={data?.banner} />
      <Certificationcards data={data?.certificationCards} />

      <Nutshell data={data?.careerServices} />
     <Excel data={data?.excelWithTeksversity} />

     <AboutTeks data={data?.aboutTeksversity} />

      <Maps data={data?.exploreMapsSection} />

      <Awards awardsData={data?.awards} />
      <Gallery gallery={data?.gallery} />
      <Featuredin featuredIn={data?.featuredIn} />

      <Accordian faq={data?.faq} />
    </div>
  );
};

export default Page;
