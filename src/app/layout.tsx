import type { Metadata } from "next";
import localFont from "next/font/local";
import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@/ui/styles/globals.scss";
import { NotificationProvider } from "@/ui/components/NotificationProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { switzer, ibmPlexSans } from "@/ui/fonts";

// export const switzer = localFont({
//   src: "../assets/fonts/Switzer-Regular.woff2",
// });

const metadata: Metadata = {
  title: "Prune",
  description: "Seamless payment across borders",
};

const theme = createTheme({
  fontFamily: "var(--font-ibm-plex-sans)",
  headings: {
    fontFamily: "'EksellDisplay', serif",
  },
  primaryColor: "prune",
  primaryShade: 5,
  defaultRadius: 6,
  colors: {
    prune: [
      "#fbfee6", // 0 - primary-50
      "#ebf98d", // 1 - primary-200
      "#e2f759", // 2 - primary-300
      "#ddf539", // 3 - primary-400
      "#d4f307", // 4 - primary-500
      "#c1dd06", // 5 - primary-600 (main)
      "#97ad05", // 6 - primary-700
      "#758604", // 7 - primary-800
      "#596603", // 8 - primary-900
      "#3d4502", // 9
    ],
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${switzer.variable} ${ibmPlexSans.variable}`}>
        <MantineProvider theme={theme}>
          <NotificationProvider />
          {/* <Notifications
            position={"top-center"}
            //  limit={1}
          /> */}
          <NuqsAdapter>{children}</NuqsAdapter>
        </MantineProvider>
      </body>
    </html>
  );
}
