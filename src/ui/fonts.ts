import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({ subsets: ["latin"] });
export const pjs = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const switzer = localFont({
  src: [
    {
      path: "../assets/fonts/Switzer-Thin.woff2",
      //   path: "../assets/fonts/Switzer-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-ExtralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-ExtraboldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "../assets/fonts/Switzer-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../assets/fonts/Switzer-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});
