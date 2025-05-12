import EmptyTable from "@/ui/components/EmptyTable";
import { Box, Center, SimpleGrid, Skeleton } from "@mantine/core";

import React, { ReactNode } from "react";
import PaperContainer from "../PaperContainer";

interface EmptyProfileTabProps {
  title: string;
  rows: any[];
  loading: boolean;
  text?: string;
}
const EmptyProfileTab = ({
  title,
  rows,
  loading,
  text,
}: EmptyProfileTabProps) => {
  if (loading)
    return (
      <PaperContainer title={title} h="calc(100vh - 300px)">
        <SimpleGrid cols={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} h={40} w="100%" color="#fcfcfd" />
          ))}
        </SimpleGrid>
      </PaperContainer>
    );

  if (!loading && rows.length > 0) return null;

  return (
    <PaperContainer title={title} h="calc(100vh - 300px)">
      {!loading && rows.length === 0 && (
        <Center h="calc(100% - 140px)">
          <EmptyTable
            rows={rows}
            loading={loading}
            title=""
            text={text ? text : "There is no data here for now"}
          />
        </Center>
      )}
    </PaperContainer>
  );
};

interface PanelWrapperProps {
  loading: boolean;
  rows: any[];
  panelName: string;
  children?: ReactNode;
}

export const PanelWrapper = ({
  loading,
  rows,
  panelName,
  children,
}: PanelWrapperProps) => {
  return (
    <Box>
      {/* For empty documents */}
      <EmptyProfileTab loading={loading} rows={rows} title={panelName} />

      {/* For filled out documents from onboarding flow */}
      {!loading && !!rows.length && <>{children}</>}
    </Box>
  );
};
