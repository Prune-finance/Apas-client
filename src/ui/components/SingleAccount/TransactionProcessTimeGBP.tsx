import { Box, Flex, Text } from "@mantine/core";
import React from "react";

function TransactionProcessTimeGBP() {
  return (
    <Box bg="#F2F5DE" h={74} p={16} mt={24} style={{ borderRadius: 4 }}>
      <Flex align="flex-start" gap={8} direction="column">
        <Text fz={12} fw={600} c="#97AD05">
          Transaction processing times for GBP:
        </Text>
        <Text fz={14} c={"#2F3F53"} fw={500}>
          24 hours availability
        </Text>
      </Flex>
    </Box>
  );
}

export default TransactionProcessTimeGBP;
