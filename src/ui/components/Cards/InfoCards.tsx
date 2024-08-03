import { CardFive } from "@/ui/components/Cards";
import {
  Box,
  Card,
  CardProps,
  CardSection,
  Divider,
  Flex,
  Group,
  NativeSelect,
  Select,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import styles from "@/ui/styles/page.module.scss";
import { ReactNode } from "react";

interface Detail {
  value: number | string | undefined;
  title: string;
  formatted?: boolean;
  currency?: string;
  locale?: string;
}

interface InfoCardProps extends CardProps {
  details: Detail[];
  title: string;
  children?: ReactNode;
  flexedGroup?: boolean;
  loading?: boolean;
}

export default function InfoCards({
  title,
  details,
  children,
  flexedGroup,
  loading,
  ...props
}: InfoCardProps) {
  return (
    <Card mt={24} style={{ border: "1px solid #f5f5f5" }} {...props}>
      <CardSection>
        <Flex justify="space-between" align="center" px={24} pt={24}>
          <Title order={3} fz={16}>
            {title}
          </Title>

          {children}
        </Flex>
        <Divider my={13} size="xs" color="#f5f5f5" />
      </CardSection>

      {flexedGroup ? (
        <Stack gap={18} pb={2}>
          {details.length === 0 && (
            <Group justify="space-between">
              <Text c="var(--prune-text-gray-600)" fz={12} fw={600}>
                No transaction yet
              </Text>
            </Group>
          )}

          {details.length > 0 &&
            details.map((info, index) => (
              <Group key={index} justify="space-between">
                <Text c="var(--prune-text-gray-500)" fz={12} fw={400}>
                  {`${info.title}`}:
                </Text>

                {!loading ? (
                  <Text c="var(--prune-text-gray-600)" fz={12} fw={600}>
                    {info.value}
                  </Text>
                ) : (
                  <Skeleton w={100} h={20} />
                )}
              </Group>
            ))}
        </Stack>
      ) : (
        <Flex justify="space-between" flex={1}>
          {details.length === 0 && !loading && (
            <Box display="grid" style={{ placeContent: "center" }} mx="auto">
              <Text
                c="var(--prune-text-gray-600)"
                fz={14}
                fw={600}
                style={{ alignSelf: "center" }}
                w="100%"
              >
                No transaction yet
              </Text>
            </Box>
          )}

          {details.map((info, index) => (
            <CardFive
              key={index}
              title={info.title}
              stat={typeof info.value === "number" ? info.value : 0}
              formatted={info.formatted}
              currency={info.currency}
              locale={info.locale}
              container
              borderRight={index !== details.length - 1}
              flex={1}
              loading={loading}
            />
          ))}
        </Flex>
      )}
    </Card>
  );
}
