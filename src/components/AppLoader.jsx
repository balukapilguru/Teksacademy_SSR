"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


export default function AppLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false),);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex gap-4 items-center">
        <Image src="https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/Teksacademy_SSR/loader.gif" 
        width={80} height={80} alt="loader" 
        unoptimized />
      </div>
    </div>
  );
}
