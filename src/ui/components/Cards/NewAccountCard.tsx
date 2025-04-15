import React from "react";
import {
  BackgroundImage,
  Box,
  CardProps,
  CopyButton,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { MouseEvent, useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";
import newAccountImageEuro from "@/assets/new-account-card.png";
import { GiEuropeanFlag } from "react-icons/gi";
import { formatNumber } from "@/lib/utils";
import { SecondaryBtn } from "../Buttons";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface Props extends CardProps {
  currency: string;
  companyName?: string;
  iban: string;
  bic: string;
  balance: number;
  link?: string;
  loading: boolean;
  badgeText?: string;
  business?: boolean;
  disable?: boolean;
  children?: React.ReactNode;
  refresh?: boolean;
  revalidate?: () => Promise<void>;
}

function NewAccountCard({
  currency,
  companyName,
  iban,
  bic,
  balance,
  link,
  loading,
  badgeText,
  business,
  disable,
  children,
  refresh,
  revalidate,
  ...props
}: Props) {
  const [processing, setProcessing] = useState(false);
  const { handleError, handleSuccess } = useNotification();
  const axios = createAxiosInstance("accounts");

  const handlePropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    // return false;
  };

  const handleReload = async () => {
    setProcessing(true);
    try {
      await axios.get(`/accounts/${iban}/balance/dashboard`);
      revalidate && (await revalidate());
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <BackgroundImage
      src={newAccountImageEuro.src}
      h="100%"
      style={{ borderRadius: 6, overflow: "hidden" }}
      w="100%"
    >
      <Stack align="flex-start" justify="space-between" gap={20} p={16}>
        <Group gap={8}>
          <ThemeIcon color="#0052B4" radius="xl">
            <GiEuropeanFlag />
          </ThemeIcon>

          {!loading ? (
            <Text c="#1D2939" fw={600}>{`${currency} ${
              companyName ? "- " + companyName : ""
            }`}</Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}
        </Group>

        <Flex direction="column" align="flex-start">
          <Group align="center" gap={4} mt={27}>
            <Text fz={12} fw={400} c="#667085" lh="100%">
              BIC:
            </Text>
            <Text fz={14} fw={600} c="#1D2939" lh="100%">
              {bic}
            </Text>
          </Group>

          <Group align="center" gap={4}>
            {!loading ? (
              <Text c="var(--prune-text-gray-900)" fz={26} fw={600} mt={9}>
                {formatNumber(balance, true, "EUR")}
              </Text>
            ) : (
              <Skeleton mt={9} h={30} w={100} />
            )}
          </Group>
        </Flex>

        <Flex align="center" justify="space-between" w="100%" mb="auto">
          <Group align="center" gap={4}>
            <Text fz={12} fw={400} c="#667085" lh="100%">
              IBAN:
            </Text>
            <Text fz={14} fw={600} c="#1D2939" lh="100%">
              {iban}
            </Text>
          </Group>

          <Box onClick={handlePropagation}>
            <CopyButton
              value={`IBAN: ${iban},\nAccount Name: ${companyName},\nBIC: ${bic}`}
            >
              {({ copied, copy }) => (
                <SecondaryBtn
                  icon={copied ? IconCheck : IconCopy}
                  text={copied ? "Copied" : "Copy Details"}
                  fz={14}
                  action={copy}
                  variant="transparent"
                  //   td="underline"
                  c="#596603"
                />
              )}
            </CopyButton>
          </Box>
        </Flex>
      </Stack>
    </BackgroundImage>
  );
}

export default NewAccountCard;
