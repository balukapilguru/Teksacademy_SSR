import Image from "next/image";
import React from "react";


export default function page() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  return (
    <>
      <div className="flex justify-center overflow-hidden relative">
        <Image
          src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/thankyou.webp"
          alt="Thank You"
          width={1000}
          height={100}
          className="object-cover overflow-hidden"
          unoptimized
        />
      </div>
    </>
  );
}

