import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { FallbackProps } from "react-error-boundary";
import { useMediaQuery } from "@mantine/hooks";
import PruneIcon from "@/assets/logo.png";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const matches = useMediaQuery("(min-width: 56.25em)");
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
              Error Found
            </Text>
            <Text fz={20} fw={600} c="#344054" mb={7}>
              We are sorry. An error has occurred. Click on the link below to
              refresh the page.
            </Text>

            <Button
              size="md"
              bg="#C1DD06"
              c="#1D2939"
              w={290}
              radius={4}
              onClick={resetErrorBoundary}
            >
              Refresh Page
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
