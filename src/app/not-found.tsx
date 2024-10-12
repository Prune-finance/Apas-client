import { Box, Container, Flex, Text } from "@mantine/core";
import React from "react";
import PruneIcon from "@/assets/logo.png";
import Image from "next/image";

function NotFoundPage() {
  return (
    <Container fluid>
      <Flex align="center" justify="flex-start" mt={25} mx={30}>
        <Image width={100} height={29} src={PruneIcon} alt="prune icon" />
      </Flex>

      <Flex
        align="center"
        justify="center"
        h="calc(100vh - 55px)"
        direction="column"
      >
        <Box
          style={{
            backgroundImage:
              "linear-gradient(rgba(167, 184, 57, 0.2), rgba(151, 173, 5, 0), rgba(151, 173, 5, 0))",
            borderRadius: "50%",
          }}
          w={400}
          h={400}
          pos="relative"
        >
          <Flex align="center" justify="center" direction="column" h="100%">
            <Text fz={100} fw={500} c="#97AD05" mb={11}>
              404
            </Text>
            <Text fz={20} fw={600} c="#344054" mb={7}>
              Page Not Found.
            </Text>
            <Text fz={14} fw={500} c="#667085">
              Unfortunately, the page you are looking for does not exist.
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}

export default NotFoundPage;
