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
} from "@mantine/core";
import { GiEuropeanFlag } from "react-icons/gi";
import { PrimaryBtn } from "../../Buttons";
import { Account, DefaultAccount } from "@/lib/hooks/accounts";
import CountryFlag from "@/ui/components/CountryFlag";

interface CurrencyConfig {
  name: string;
  bankIdLabel: string;
  accountIdLabel: string;
  getBankIdValue: (account: DefaultAccount | null) => string;
  getAccountIdValue: (account: DefaultAccount | null) => string;
  accountNumberLabel?: string;
  getAccountNumberValue?: (account: DefaultAccount | null) => string;
}

interface Props {
  account: DefaultAccount | null;
  loading: boolean;
  accountType?: string;
}

const currencyConfigs: Record<string, CurrencyConfig> = {
  EUR: {
    name: "EUR",
    bankIdLabel: "BIC",
    accountIdLabel: "IBAN/Account Number",
    getBankIdValue: () => "ARPYGB21XXX",
    getAccountIdValue: (account) => account?.accountNumber ?? "",
  },
  GBP: {
    name: "GBP",
    bankIdLabel: "Sort Code",
    accountIdLabel: "Account Number",
    getBankIdValue: (account) => account?.sortCode ?? "",
    getAccountIdValue: (account) => account?.accountNumber ?? "",
  },
  NGN: {
    name: "NGN",
    bankIdLabel: "Bank Code",
    accountIdLabel: "Account Number",
    getBankIdValue: (account) => account?.sortCode ?? "",
    getAccountIdValue: (account) => account?.accountNumber ?? "",
  },
  GHS: {
    name: "GHS",
    bankIdLabel: "Wallet Owner",
    accountIdLabel: "Wallet ID",
    getBankIdValue: (account) => account?.accountName ?? "",
    getAccountIdValue: (account) => account?.walletId ?? "",
  },
  USD: {
    name: "USD",
    bankIdLabel: "SWIFT/BIC",
    accountIdLabel: "IBAN",
    getBankIdValue: () => "ARPYGB21",
    getAccountIdValue: (account) => account?.accountIban ?? "",
    accountNumberLabel: "Account Number",
    getAccountNumberValue: (account) => account?.accountNumber ?? "",
  },
};

export default function DefaultAccountDetails({
  account,
  loading,
  accountType = "EUR",
}: Props) {
  const config = currencyConfigs[accountType] || currencyConfigs.EUR;
  const accountDetails = {
    "Account Name": account?.accountName,
    [config.bankIdLabel]: config.getBankIdValue(account),
    [config.accountIdLabel]: config.getAccountIdValue(account),
    ...(config.accountNumberLabel && config.getAccountNumberValue
      ? { [config.accountNumberLabel]: config.getAccountNumberValue(account) }
      : {}),
    "Bank Name": "Prune Payments LTD",
    "Bank Address": "Office 7 35-37 Ludgate Hill, London",
    "Bank Country": "United Kingdom",
  };

  return (
    <>
      <Group gap={7}>
        <ThemeIcon radius="xl" color="transparent">
          {!loading ? (
            <CountryFlag code={config.name} size={20} />
          ) : (
            <Skeleton w={20} h={20} />
          )}
        </ThemeIcon>

        {!loading ? (
          <Text fz={16} fw={500}>
            {config.name} Account Details
          </Text>
        ) : (
          <Skeleton w={100} h={20} />
        )}

        {!loading && (
          <CopyButton
            value={`Account Name: ${account?.accountName ?? ""}
${config.accountIdLabel}: ${config.getAccountIdValue(account)}
${config.bankIdLabel}: ${config.getBankIdValue(account)}
${config.accountNumberLabel && config.getAccountNumberValue ? `${config.accountNumberLabel}: ${config.getAccountNumberValue(account)}\n` : ""}Bank Name: Prune Payments LTD
Bank Address: Office 7 35-37 Ludgate Hill, London
Bank Country: United Kingdom`}
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
                  {!loading ? (
                    <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
                      {key}
                    </Text>
                  ) : (
                    <Skeleton w={100} h={10} />
                  )}
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
