"use client";
import Image from "next/image";

export default function Loader() {
  return (
    
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <Image
          src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/loaderteks.gif"
          width={150}
          height={150}
          alt="Loading"
          unoptimized
        />
      </div>
    
  );
}
