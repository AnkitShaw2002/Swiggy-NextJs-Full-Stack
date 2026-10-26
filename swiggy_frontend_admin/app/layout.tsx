import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/features/redux-toolkit/provider/provider";
import ConditionalLayout from "@/component/hiddencomponent/hiddencomnent";


export const metadata: Metadata = {
  title: "Swiggy Admin — Sign in",
  description:
    "Admin console for managing Swiggy orders, partners, and outlets.",
    
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          
          <ConditionalLayout>


        

            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}