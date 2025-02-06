import {
  Paper,
  Group,
  Flex,
  Skeleton,
  Center,
  SemiCircleProgress,
  Stack,
} from "@mantine/core";

export const BarChartLoading = () => {
  const data = [
    { name: "Jan", successful: 4000, failed: 2400, pending: 2400 },
    { name: "Feb", successful: 3000, failed: 1398, pending: 2210 },
    { name: "Mar", successful: 2000, failed: 9800, pending: 2290 },
    { name: "Apr", successful: 2780, failed: 3908, pending: 2000 },
    { name: "May", successful: 1890, failed: 4800, pending: 2181 },
    { name: "Jun", successful: 2390, failed: 3800, pending: 2500 },
    { name: "Jul", successful: 3490, failed: 4300, pending: 2100 },
  ];
  return (
    <Paper
      withBorder
      p={20}
      style={{ border: "1px solid var(--prune-text-gray-100)" }}
    >
      <Flex gap={30} style={{ overflowX: "hidden" }}>
        {data.map((item, index) => (
          <Flex gap={5} key={index} align="end">
            {Object.keys(item)
              .slice(1)
              .map((key, index, arr) => (
                <Skeleton
                  key={index}
                  h={`${Math.pow(arr.length - index, 2) + 10}rem`}
                  w={20}
                />
              ))}
          </Flex>
        ))}
      </Flex>
    </Paper>
  );
};

export const DonutChartLoading = () => {
  return (
    <Stack justify="space-between" mt={30} px={30}>
      <Center w="100%">
        <SemiCircleProgress
          fillDirection="left-to-right"
          orientation="up"
          filledSegmentColor="var(--prune-text-gray-100)"
          size={231}
          thickness={20}
          value={100}
          label="0"
        />
      </Center>

      <Group w="100%" justify="space-between" gap={20} mt={30}>
        {[1, 2, 3].map((_, index) => (
          <Group key={index} gap={10} align="center">
            <Skeleton w={5} h={30} />
            <Stack>
              <Skeleton w={60} h={5} />
              <Skeleton w={60} h={5} />
            </Stack>
          </Group>
        ))}
      </Group>
    </Stack>
  );
};
