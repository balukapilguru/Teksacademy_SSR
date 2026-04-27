"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000); // 2 sec timer
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="flex gap-4 items-center">
        <Image
          src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/loaderteks.gif"
          width={100}
          height={100}
          alt="srilakshmi loader"
          // priority
          unoptimized
        />
      </div>
    </div>
  );
}

