'use client';

import { useEffect } from 'react';
import PrimaryButton from "@/utility/PrimaryButton";
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="text-4xl font-bold text-red-500 mb-4">Something went wrong!</div>
      <div className="text-gray-600 mb-8">An unexpected error has occurred. Please try again.</div>

      <PrimaryButton
        type="form"
        label="Try again"
        onClick={reset}
        className="!px-6 !py-3"
      />
    </div>
  );
}

