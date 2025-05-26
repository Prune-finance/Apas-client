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
import { Account, DefaultAccount } from "@/lib/hooks/accounts";
import GBImage from "@/assets/GB.png";
import EUImage from "@/assets/EU-icon.png";
interface Props {
  account: DefaultAccount | null;
  loading: boolean;
  accountType?: string;
}

export default function DefaultAccountDetails({
  account,
  loading,
  accountType,
}: Props) {
  const accountDetails = {
    "Account Name": account?.accountName,
    [accountType === "GBP" ? "Sort Code" : "IBAN/Account Number"]:
      accountType === "GBP" ? account?.sortCode || "041917" : account?.accountNumber,

    [accountType === "GBP" ? "Account Number" : "BIC"]:
      accountType === "GBP" ? account?.accountNumber : "ARPYGB21XXX",

    "Bank Name": "Prune Payments LTD",
    "Bank Address": "Office 7 35-37 Ludgate Hill, London",
    "Bank Country": "United Kingdom",
  };

  return (
    <>
      <Group gap={7}>
        <ThemeIcon
          radius="xl"
          // color="#0052B4"
          color="transparent"
        >
          {!loading ? (
            <>
              {accountType === "GBP" ? (
                <Image src={GBImage.src} alt="GBP" w={20} h={20} />
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
            {accountType ?? "EUR"} Account Details
          </Text>
        ) : (
          <Skeleton w={100} h={20} />
        )}

        {!loading && (
          <CopyButton
            value={`Account Name: ${
              account?.accountName ?? ""
            },\nIBAN/Account Number: ${
              account?.accountNumber ?? ""
            },\nBIC: ARPYGB21XXX,\nBank Name: Prune Payments LTD,\nBank Address: Office 7 35-37 Ludgate Hill, London,\nBank Country: United Kingdom`}
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
