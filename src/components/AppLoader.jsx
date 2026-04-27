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
        <Image src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/loaderteks.gif" width={150} height={150} alt="loader" 
        unoptimized />
      </div>
    </div>
  );
}
