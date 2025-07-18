"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSliderRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the hero slider list page
    router.push('/banners/hero-sliders');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Redirecting to Hero Sliders...</p>
      </div>
    </div>
  );
} 