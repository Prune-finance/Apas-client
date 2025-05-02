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

export const switzer = localFont({
  src: "../assets/fonts/Switzer-Regular.woff2",
});

const metadata: Metadata = {
  title: "Prune",
  description: "Seamless payment across borders",
};

const theme = createTheme({
  fontFamily: switzer.style.fontFamily,
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
      <body className={switzer.className}>
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
