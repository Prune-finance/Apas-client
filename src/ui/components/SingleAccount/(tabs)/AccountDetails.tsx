import {
  Group,
  ThemeIcon,
  CopyButton,
  Paper,
  Grid,
  GridCol,
  SimpleGrid,
  Stack,
  Skeleton,
  Text,
  Image,
} from "@mantine/core";
import { GiEuropeanFlag } from "react-icons/gi";
import { PrimaryBtn } from "../../Buttons";
import { Account } from "@/lib/hooks/accounts";
import GBImage from "@/assets/GB.png";
import USImage from "@/assets/USD.png";
import EUImage from "@/assets/EU-icon.png";
import GHSImage from "@/assets/cedis-icon.png";

interface Props {
  account: Account | null;
  loading: boolean;
  currency?: string;
}

export default function AccountDetails({ account, loading, currency = "EUR" }: Props) {
  const accountDetails = {
    "Account Name": account?.accountName,
    ...(currency === "EUR" && {
      "IBAN/Account Number": account?.accountNumber,
    }),
    ...((currency == "GBP" || currency === "USD") && {
      "Account Number": account?.accountNumber,
    }),
    ...((currency == "GBP" || currency === "USD") && {
      "Account Iban": account?.accountIban,
    }),
    ...(currency === "EUR" && {
      BIC: "ARPYGB21XXX",
    }),
    ...(currency === "USD" && {
      "SWIFT/BIC": "ARPYGB21",
    }),
    ...(currency === "GBP" && {
      "Sort Code": account?.sortCode,
    }),
    ...(currency === "GHS" && {
      "Wallet ID": account?.walletId,
    }),
    "Bank Name": "Prune Payments LTD",
    "Bank Address": "Office 7 35-37 Ludgate Hill, London",
    "Bank Country": "United Kingdom",
  };

  return (
    <>
      <Group gap={7}>
        <ThemeIcon radius="xl" color="transparent">
          {!loading ? (
            <>
              {currency === "GBP" ? (
                <Image src={GBImage.src} alt="GBP" w={20} h={20} />
              ) : currency === "USD" ? (
                <Image src={USImage.src} alt="USD" w={20} h={20} />
              ) : currency === "GHS" ? (
                <Image src={GHSImage.src} alt="GHS" w={20} h={20} />
              ) : (
                <Image src={EUImage.src} alt="EUR" w={20} h={20} />
              )}
            </>
          ) : (
            <Skeleton w={20} h={20} />
          )}
        </ThemeIcon>
        {!loading ? (
          <Text fz={16} fw={500}>
            {currency} Account Details
          </Text>
        ) : (
          <Skeleton w={100} h={20} />
        )}
        {!loading && (
          <CopyButton
            value={`Account Name: ${account?.accountName ?? ""},\n${
              currency === "GBP"
                ? `Sort Code: ${account?.sortCode ?? ""},\nAccount Number: ${
                    account?.accountNumber ?? ""
                  }`
                : `IBAN/Account Number: ${
                    account?.accountNumber ?? ""
                  },\nBIC: ARPYGB21XXX`
            },\nBank Name: Prune Payments LTD,\nBank Address: Office 7 35-37 Ludgate Hill, London,\nBank Country: United Kingdom`}
          >
            {({ copied, copy }) => (
              <PrimaryBtn
                text={copied ? "Copied" : "Copy Details"}
                action={copy}
                td="underline"
                c="var(--prune-primary-800)"
                variant="light"
                radius="xl"
                size="xs"
              />
            )}
          </CopyButton>
        )}
      </Group>

      <Paper withBorder p={16} mt={12} style={{ border: "1px solid #f5f5f5" }}>
        <Grid>
          <GridCol span={9}>
            <SimpleGrid cols={3} verticalSpacing={28}>
              {Object.entries(accountDetails).map(([key, value]) => (
                <Stack gap={2} key={key}>
                  <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
                    {key}
                  </Text>
                  {!loading ? (
                    <Text fz={14} fw={500} c="var(--prune-text-gray-800)">
                      {value}
                    </Text>
                  ) : (
                    <Skeleton w={100} h={10} />
                  )}
                </Stack>
              ))}
            </SimpleGrid>
          </GridCol>
        </Grid>
      </Paper>
    </>
  );
}
