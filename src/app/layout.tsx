import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import TabAttention from "@/components/TabAttention";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mentic — The Autonomous Advertising Agent",
  description:
    "Mentic builds your strategy, launches your campaigns, and optimises them autonomously.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body>
        <TabAttention />
        {children}
      </body>
    </html>
  );
}
