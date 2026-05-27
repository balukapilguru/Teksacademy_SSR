"use client";
import Image from "next/image";

export default function Loader() {
  return (
    
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <Image
          src="https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/Teksacademy_SSR/loader.gif"
          width={80}
          height={80}
          alt="Loading"
          unoptimized
        />
      </div>
    
  );
}
