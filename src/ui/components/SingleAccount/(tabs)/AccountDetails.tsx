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
import { Account } from "@/lib/hooks/accounts";

interface Props {
  account: Account | null;
  loading: boolean;
}

export default function AccountDetails({ account, loading }: Props) {
  const accountDetails = {
    "Account Name": account?.accountName,
    "IBAN/Account Number": account?.accountNumber,
    BIC: "ARPYGB21XXX",
    "Bank Name": "Prune Payments LTD",
    "Bank Address": "Office 7 35-37 Ludgate Hill, London",
    "Bank Country": "Lithuania",
  };

  return (
    <>
      <Group gap={7}>
        <ThemeIcon radius="xl" color="#0052B4">
          <GiEuropeanFlag />
        </ThemeIcon>
        <Text fz={16} fw={500}>
          EUR Account Details
        </Text>
        <CopyButton
          value={`Account Name: ${
            account?.accountName ?? ""
          },\nIBAN/Account Number: ${
            account?.accountNumber ?? ""
          },\nBIC: ARPYGB21XXX,\nBank Name: Prune Payments LTD,\nBank Address: Office 7 35-37 Ludgate Hill, London,\nBank Country: Lithuania`}
        >
          {({ copied, copy }) => (
            <PrimaryBtn
              text={copied ? "Copied" : "Copy Detail"}
              action={copy}
              td="underline"
              c="var(--prune-primary-800)"
              variant="light"
              radius="xl"
              size="xs"
            />
          )}
        </CopyButton>
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
