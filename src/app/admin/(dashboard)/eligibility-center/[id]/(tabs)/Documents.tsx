import { Box, Center, SimpleGrid } from "@mantine/core";
import React from "react";
import PaperContainer from "../PaperContainer";
import EmptyTable from "@/ui/components/EmptyTable";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";

export default function Documents() {
  const businessDocs = [
    { label: "CAC Certificate", title: "File.pdf", value: "" },
    { label: "Memart", title: "File.pdf", value: "" },
    { label: "AML Compliance Framework", title: "File.pdf", value: "" },
    { label: "Operational License (optional)", title: "File.pdf", value: "" },
  ];
  return (
    <Box>
      {/* For empty documents */}
      {/* <PaperContainer title="Documents" h="calc(100vh - 300px)">
        <Center h="calc(100% - 140px)">
          <EmptyTable
            rows={[]}
            loading={false}
            title=""
            text="There is no data here for now"
          />
        </Center>
      </PaperContainer> */}

      {/* For filled out documents from onboarding flow */}
      <PaperContainer title="Terms of use agreement">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <DocumentPreview label="" title="File.pdf....." />
        </SimpleGrid>
      </PaperContainer>

      <PaperContainer title="Business Documents" mt={24}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {businessDocs.map((doc, idx) => (
            <DocumentPreview key={idx} label={doc.label} title={doc.title} />
          ))}
        </SimpleGrid>
      </PaperContainer>
    </Box>
  );
}
