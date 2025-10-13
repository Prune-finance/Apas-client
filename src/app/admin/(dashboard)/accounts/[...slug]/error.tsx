"use client"; // Error components must be Client Components

import { Box, Button, Container, Flex, Image, Text } from "@mantine/core";
import { useEffect } from "react";
import PruneIcon from "@/assets/logo.png";
import { parseError } from "@/lib/actions/auth";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container fluid>
      <Flex align="center" justify="flex-start" mt={25} mx={30}>
        <Image width={100} height={29} src={PruneIcon.src} alt="prune icon" />
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
            <Text fz={50} fw={500} c="#97AD05" mb={11}>
              Error Found
            </Text>
            <Text fz={16} fw={500} c="#344054" mb={7} ta="center">
              {parseError(error) ||
                "We are sorry. An error has occurred. Click on the link below to refresh the page."}
            </Text>

            <Button
              size="md"
              bg="#C1DD06"
              c="#1D2939"
              w={150}
              radius={4}
              onClick={reset}
            >
              Try again
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
