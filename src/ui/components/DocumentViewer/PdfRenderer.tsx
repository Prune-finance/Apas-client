import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Viewer,
  createStore,
  Plugin,
  PluginFunctions,
  Worker,
  RenderPage,
  RenderPageProps,
  PageLayout,
} from "@react-pdf-viewer/core";
import {
  defaultLayoutPlugin,
  ToolbarProps,
  ToolbarSlot,
} from "@react-pdf-viewer/default-layout";
import { Flex, Text } from "@mantine/core";
// import Verification from "@/store/verification.store";
import { useMediaQuery } from "@mantine/hooks";
// import AgrtImage from "@/assets/images/tenancyAgrt.png";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface ReadingProgressPlugin extends Plugin {
  ReadingProgress: React.FC;
}

interface ReadingProgressStoreProps {
  getPagesContainer?: () => HTMLElement;
}

// const readingProgressPlugin = (): ReadingProgressPlugin => {
//   const store = useMemo(() => createStore<ReadingProgressStoreProps>({}), []);

//   const ReadingProgress: React.FC = () => {
//     // const { percentages, setPercentages } = Verification();

//     const handleScroll = (e: Event) => {
//       const target = e.target;
//       if (target instanceof HTMLDivElement) {
//         const p = Math.floor(
//           (100 * target.scrollTop) / (target.scrollHeight - target.clientHeight)
//         );
//         setPercentages(Math.min(100, p));
//       }
//     };

//     const handlePagesContainer = () => {
//       const getPagesContainer = store.get("getPagesContainer");
//       if (!getPagesContainer) {
//         return;
//       }

//       const pagesEle = getPagesContainer();
//       pagesEle.addEventListener("scroll", handleScroll);
//     };

//     useLayoutEffect(() => {
//       store.subscribe("getPagesContainer", handlePagesContainer);

//       return () => store.unsubscribe("getPagesContainer", handlePagesContainer);
//     }, []);

//     return (
//       <div
//         style={{
//           height: "4px",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "rgb(53, 126, 221)",
//             height: "100%",
//             width: `${percentages}%`,
//           }}
//         />
//       </div>
//     );
//   };

//   return {
//     install: (pluginFunctions: PluginFunctions) => {
//       store.update("getPagesContainer", pluginFunctions.getPagesContainer);
//     },
//     ReadingProgress,
//   };
// };

interface PdfRendererProps {
  fileUrl: string;
}

const PdfRenderer: React.FC<PdfRendererProps> = ({ fileUrl }) => {
  //   const readingProgressPluginInstance = readingProgressPlugin();
  //   const { ReadingProgress } = readingProgressPluginInstance;
  const matches = useMediaQuery("(min-width: 56.25em)");

  const renderToolbar = useMemo(
    () => (Toolbar: (props: ToolbarProps) => React.ReactElement) => {
      return (
        <>
          <Toolbar>
            {(slots: ToolbarSlot) => {
              const {
                CurrentPageInput,
                Download,
                EnterFullScreen,
                GoToNextPage,
                GoToPreviousPage,
                NumberOfPages,
                Print,
                ShowSearchPopover,
                Zoom,
                ZoomIn,
                ZoomOut,
              } = slots;
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ padding: "0px 2px" }}>
                    <ShowSearchPopover />
                  </div>
                  <div style={{ padding: "0px 2px" }}>
                    <ZoomOut />
                  </div>
                  <div style={{ padding: "0px 2px" }}>
                    <Zoom />
                  </div>
                  <div style={{ padding: "0px 2px" }}>
                    <ZoomIn />
                  </div>
                  <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                    <GoToPreviousPage />
                  </div>
                  <div
                    style={{
                      padding: "0px 2px",
                      width: !matches ? "4rem" : "3rem",
                      marginRight: "5px",
                    }}
                  >
                    <CurrentPageInput />
                  </div>
                  <div style={{ padding: "0px 2px" }}>
                    / <NumberOfPages />
                  </div>
                  <div style={{ padding: "0px 2px" }}>
                    <GoToNextPage />
                  </div>
                  {matches ? null : (
                    <>
                      <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                        <EnterFullScreen />
                      </div>
                      <div style={{ padding: "0px 2px" }}>
                        <Download />
                      </div>
                      <div style={{ padding: "0px 2px" }}>
                        <Print />
                      </div>
                    </>
                  )}
                  {/* <div
                    style={{
                      bottom: "-0.25rem",
                      position: "absolute",
                      left: 0,
                      // Take the full width of the toolbar
                      width: "100%",
                    }}
                  >
                    <ReadingProgress />
                  </div> */}
                </div>
              );
            }}
          </Toolbar>
        </>
      );
    },
    []
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]],
    // renderToolbar,
  });

  const renderPage: RenderPage = (props: RenderPageProps) => (
    <>
      {props.canvasLayer.children}

      {props.annotationLayer.children}
      {/* {props.textLayer.children} */}
    </>
  );

  const pageLayout: PageLayout = {
    buildPageStyles: () => ({
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    }),
    transformSize: ({ size }) => ({
      height: size.height + 20,
      width: size.width + 20,
    }),
  };

  return (
    <Worker
      workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
      //   workerUrl="/pdf.worker.min.mjs"
    >
      <div
        style={{
          // border: "1px solid rgba(0, 0, 0, 0.3)",
          height: "750px",
        }}
      >
        <Viewer
          fileUrl={
            "https://s3.amazonaws.com/re.current/1721346312%20%281%29.pdf"
          }
          //   fileUrl={fileUrl}
          //   plugins={[defaultLayoutPluginInstance]}
          //   renderPage={renderPage}
          //   pageLayout={pageLayout}
        />
      </div>
    </Worker>
  );
};

export default PdfRenderer;
