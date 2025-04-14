import React from "react";
import {
  BackgroundImage,
  Box,
  CardProps,
  CopyButton,
  Flex,
  Group,
  Loader,
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
import AccountImageGBP from "@/assets/gbp-account-card.png";
import { GiEuropeanFlag, GiNigeria } from "react-icons/gi";
import { formatNumber } from "@/lib/utils";
import { SecondaryBtn } from "../Buttons";
import { IconCheck, IconCopy, IconReload } from "@tabler/icons-react";
import { SeeAll } from ".";
import Link from "next/link";

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

type CurrencyConfig = {
  background: string;
  icon: React.ReactNode;
  bankIdLabel: string;
  accountIdLabel: string;
  currencySymbol: string;
  currencyCode: string;
};

const currencyConfigs: Record<string, CurrencyConfig> = {
  EUR: {
    background: newAccountImageEuro.src,
    icon: <GiEuropeanFlag />,
    bankIdLabel: "BIC",
    accountIdLabel: "IBAN",
    currencySymbol: "€",
    currencyCode: "EUR",
  },
  GBP: {
    background: AccountImageGBP.src,
    icon: <GiEuropeanFlag />,
    bankIdLabel: "Sort Code",
    accountIdLabel: "Account Number",
    currencySymbol: "£",
    currencyCode: "GBP",
  },
  NGN: {
    background: newAccountImageEuro.src,
    icon: <GiNigeria />,
    bankIdLabel: "Sort Code",
    accountIdLabel: "Account Number",
    currencySymbol: "₦",
    currencyCode: "NGN",
  },
};

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
  const config = currencyConfigs[currency] || currencyConfigs.EUR;

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
      src={config.background}
      h="100%"
      style={{
        borderRadius: 6,
        overflow: "hidden",
        border: "0.773px solid #ededed",
      }}
      w="100%"
    >
      <Stack align="flex-start" justify="space-between" gap={20} p={16}>
        <Flex align="center" justify="space-between" w="100%">
          <Group gap={8}>
            <ThemeIcon
              color={
                currency === "EUR"
                  ? "#0052B4"
                  : currency === "GBP"
                  ? "#00247D"
                  : "#008751"
              }
              radius="xl"
            >
              {config.icon}
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
            {refresh && (
              <ThemeIcon
                radius="xl"
                color="#3F441B"
                size="md"
                p={4}
                onClick={() => handleReload()}
                style={{
                  cursor: processing ? "not-allowed" : "pointer",
                  pointerEvents: processing ? "none" : "auto",
                }}
              >
                {processing ? (
                  <Loader
                    type="oval"
                    size="xs"
                    color="var(--prune-primary-600)"
                  />
                ) : (
                  <IconReload color="var(--prune-primary-600)" />
                )}
              </ThemeIcon>
            )}

            {/* <Group
              gap={2}
              align="center"
              justify="end"
              c="var(--prune-text-gray-900)"
            >
              {link && (
                <Link href={link}>
                  <SeeAll name="See More" fontSize={14} />
                </Link>
              )}
            </Group> */}
          </Group>
        </Flex>

        <Flex direction="column" align="flex-start">
          <Group align="center" gap={4} mt={27}>
            {!loading ? (
              <>
                <Text fz={12} fw={400} c="#667085" lh="100%">
                  {config.bankIdLabel}:
                </Text>
                <Text fz={14} fw={600} c="#1D2939" lh="100%">
                  {config.bankIdLabel === "BIC" ? bic : ""}
                </Text>
              </>
            ) : (
              <Skeleton h={10} w={100} />
            )}
          </Group>

          <Group align="center" gap={4}>
            {!loading ? (
              <Text c="var(--prune-text-gray-900)" fz={26} fw={600} mt={9}>
                {formatNumber(balance, true, config?.currencyCode)}
              </Text>
            ) : (
              <Skeleton mt={9} h={30} w={100} />
            )}
          </Group>
        </Flex>

        <Flex align="center" justify="space-between" w="100%" mb="auto">
          <Group align="center" gap={4}>
            {!loading ? (
              <>
                <Text fz={12} fw={400} c="#667085" lh="100%">
                  {config.accountIdLabel}:
                </Text>
                <Text fz={14} fw={600} c="#1D2939" lh="100%">
                  {config.accountIdLabel === "IBAN" ? iban : ""}
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
                  : currency === "GBP"
                  ? `Sort Code: ${bic},\nAccount Number: ${iban},\nAccount Name: ${companyName}`
                  : `Sort Code: ${bic},\nAccount Number: ${iban},\nAccount Name: ${companyName}`
              }
            >
              {({ copied, copy }) => (
                <SecondaryBtn
                  icon={copied ? IconCheck : IconCopy}
                  text={copied ? "Copied" : "Copy Details"}
                  fz={14}
                  action={copy}
                  variant="transparent"
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
