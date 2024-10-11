"use client";

import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { Flex, ScrollArea, ThemeIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { IconMinus } from "@tabler/icons-react";
import classes from "./styles.module.scss";
import useNotification from "@/lib/hooks/notification";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function RenderPdf({ pdfUrl }: { pdfUrl: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState(1);

  const { handleError } = useNotification();

  const increaseScale = () => setScale((scale) => scale + 0.1);
  const decreaseScale = () => setScale((scale) => scale - 0.1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Flex gap={10} mb={5}>
        <ThemeIcon
          radius="xs"
          variant="outline"
          onClick={increaseScale}
          size="sm"
        >
          <IconPlus />
        </ThemeIcon>
        <ThemeIcon
          radius="xs"
          variant="outline"
          onClick={decreaseScale}
          size="sm"
        >
          <IconMinus />
        </ThemeIcon>
      </Flex>
      <ScrollArea h="calc(100vh - 200px)" p={10} bg="dark.3">
        <Document
          // file={"https://s3.amazonaws.com/re.current/1721346312%20%281%29.pdf"}
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) =>
            handleError("Displaying PDF Failed", error.message)
          }
          //   options={options}
          className={classes.container}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              //   pageIndex={index + 1}
              loading=""
              scale={scale}
              className={classes.pages}
              renderMode="canvas"
            />
          ))}
        </Document>
      </ScrollArea>
    </div>
  );
}
