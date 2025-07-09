"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorageItem } from "@/utils/helperWindows";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const token = getLocalStorageItem("token");
    const adminData = getLocalStorageItem("adminData");

    if (token && adminData) {
      // User is already authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not authenticated, show the public page
      setShouldRender(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  return shouldRender ? <>{children}</> : null;
} 