import "jsvectormap/dist/jsvectormap.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";

import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
import { ToastContainer } from "react-toastify";
export const metadata: Metadata = {
  title: {
    template: "%s | OMEGA ADMIN",
    default: "Omega Admin",
  },
  description: "Omege admin dashboard.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
