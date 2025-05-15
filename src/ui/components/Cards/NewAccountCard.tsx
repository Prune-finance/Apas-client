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
  key?: string;
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
  key,
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
      key={key}
      src={config.background}
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

          <Group gap={8} align="center">
            <Group
              gap={2}
              align="center"
              justify="end"
              c="var(--prune-text-gray-900)"
            >
              {link && (
                <Link href={link}>
                  <Box bg="#596603" px={8} p={2} style={{ borderRadius: 12 }}>
                    <Text fz={10} fw={500} c="#fff">
                      See More
                    </Text>
                  </Box>
                </Link>
              )}
            </Group>
          </Group>
        </Flex>

        <Flex direction="column" align="flex-start" w={"100%"}>
          <Group align="center" gap={4}>
            {!loading ? (
              <Flex align="center" justify="center" gap={11} mt={9}>
                <Text c="var(--prune-text-gray-900)" fz={26} fw={600}>
                  {formatNumber(balance, true, config?.currencyCode)}
                </Text>

                {refresh && (
                  <ThemeIcon
                    radius="xl"
                    color="#596603"
                    size="xs"
                    p={2}
                    onClick={() => handleReload()}
                    style={{
                      cursor: processing ? "not-allowed" : "pointer",
                      pointerEvents: processing ? "none" : "auto",
                    }}
                  >
                    {processing ? (
                      <Loader type="oval" size="xs" color="#FFFFFF" />
                    ) : (
                      <IconReload color="#FFFFFF" />
                    )}
                  </ThemeIcon>
                )}
              </Flex>
            ) : (
              <Skeleton mt={9} h={30} w={100} />
            )}
          </Group>
        </Flex>

        <Flex align="flex-end" justify="space-between" w="100%">
          <Group w="100%" gap={10}>
            <Group align="flex-end" justify="space-between" gap={4} w={"100%"}>
              {!loading ? (
                <>
                  <Flex align="center" gap={4}>
                    <Text fz={12} fw={400} c="#667085" lh="100%">
                      {config.bankIdLabel}:
                    </Text>

                    <Text fz={14} fw={600} c="#1D2939" lh="100%">
                      {config.bankIdLabel === "BIC" ? bic : sortCode}
                    </Text>
                  </Flex>
                </>
              ) : (
                <Skeleton h={10} w={100} />
              )}
            </Group>

            <Flex align="center" justify="space-between" w="100%">
              <Group align="flex-end" gap={4}>
                {!loading ? (
                  <>
                    <Text fz={12} fw={400} c="#667085" lh="100%">
                      {config.accountIdLabel}:
                    </Text>
                    <Text fz={14} fw={600} c="#1D2939" lh="100%">
                      {config.accountIdLabel === "IBAN" ? iban : accountNumber}
                    </Text>
                  </>
                ) : (
                  <Skeleton h={10} w={200} />
                )}
              </Group>

              <Box onClick={handlePropagation}>
                <CopyButton
                  value={
                    currency === "EUR"
                      ? `IBAN: ${iban},\nAccount Name: ${companyName},\nBIC: ${bic}`
                      : `Sort Code: ${sortCode},\nAccount Number: ${accountNumber},\nAccount Name: ${companyName}`
                  }
                >
                  {({ copied, copy }) => (
                    <SecondaryBtn
                      icon={copied ? IconCheck : IconCopy}
                      text={copied ? "Copied" : "Copy Details"}
                      fz={12}
                      action={copy}
                      m={0}
                      px={0}
                      variant="transparent"
                      c="#596603"
                      style={{ border: "none" }}
                    />
                  )}
                </CopyButton>
              </Box>
            </Flex>
          </Group>
        </Flex>
      </Stack>
    </BackgroundImage>
  );
}

export default NewAccountCard;
