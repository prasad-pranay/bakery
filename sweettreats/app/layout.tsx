import type { Metadata } from "next";
import { Fredoka, Boogaloo, Luckiest_Guy } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import SmoothScroll from "./component/SmoothScroll";
import CustomScrollbar from "./component/CustomScrollbar";
import Validator from "./component/Validator";

const headerFont = Boogaloo({
  variable: "--font-header",
  subsets: ["latin"],
  weight: "400"
});

const textFont = Fredoka({
  variable: "--font-text",
  subsets: ["latin"],
});

const titleFont = Luckiest_Guy({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "400"
});

const subTitleFont = Luckiest_Guy({
  variable: "--font-sub-title",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "SWEETREATS",
  description: "Discover, order, and enjoy delightful treats.",
};

type LayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={`${headerFont.variable} ${textFont.variable} ${titleFont.variable} ${subTitleFont.variable} h-full antialiased`}
    >
      <body className="relative sidebar-none ">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[-1] min-h-full bg-gradient-to-b from-[var(--background)] to-[#fff]" />
        <SmoothScroll >
          <CustomScrollbar />
          <Validator>
            {children}
          </Validator>
        </SmoothScroll>
        
      </body>
    </html>
  );
}
