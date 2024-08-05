import {
  Grid,
  Paper,
  Text,
  Button,
  Stack,
  Flex,
  Skeleton,
  GridCol,
  CopyButton,
  ActionIcon,
  NativeSelect,
  Tooltip,
  Group,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import dayjs from "dayjs";

export default function SingleAccount() {
  const { back } = useRouter();
  return (
    <Paper p={28} className={styles.grid__container}>
      <Button
        fz={14}
        c="var(--prune-text-gray-500)"
        fw={400}
        px={0}
        variant="transparent"
        onClick={back}
        leftSection={
          <IconArrowLeft
            color="#1D2939"
            style={{ width: "70%", height: "70%" }}
          />
        }
        style={{ pointerEvents: !account ? "none" : "auto" }}
      >
        Back
      </Button>

      <Flex justify="space-between" align="flex-start" mt={20}>
        <Stack gap={8}>
          {account?.accountName ? (
            <Text fz={24} fw={600} c="var(--prune-text-gray-700)">
              {account?.accountName}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}
          <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
            {`Last Seen: ${dayjs(account?.createdAt).format("Do, MMMM YYYY")}`}
          </Text>
        </Stack>

        <Flex gap={10}>
          <Button
            variant="outline"
            color="var(--prune-text-gray-300)"
            c="var(--prune-text-gray-800)"
            fz={12}
            fw={500}
            // onClick={() => setEditing(false)}
          >
            Freeze Account
          </Button>
          {/* <Button
              // onClick={() => {
              //   updateDirector(index, form.values);
              //   setEditing(false);
              // }}
              // className={styles.edit}
              variant="filled"
              color="var(--prune-primary-600)"
              fz={12}
              fw={500}
              c="var(--prune-text-gray-800)"
            >
              Debit Account
            </Button> */}
        </Flex>
      </Flex>

      <Grid>
        <GridCol span={8}>
          <InfoCards
            title="Account Overview"
            details={accountDetails}
            loading={loading}
          />
        </GridCol>

        <GridCol span={4}>
          <InfoCards
            title="Bank Details"
            details={flexedGroupDetails}
            flexedGroup
            loading={loading}
            h={190}
          >
            <CopyButton value={account?.accountNumber || ""} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                    h={10}
                  >
                    {copied ? (
                      <IconCheck style={{ width: rem(16) }} />
                    ) : (
                      <IconCopy style={{ width: rem(16) }} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </InfoCards>
        </GridCol>

        <GridCol span={8.3}>
          <TransactionStatistics
            setChartFrequency={setChartFrequency}
            lineData={lineData}
          />
        </GridCol>

        <GridCol span={3.7}>
          <Paper
            px="auto"
            style={{ border: "1px solid #f5f5f5" }}
            w="100%"
            h="100%"
            pt={20}
          >
            <Flex px={10} justify="space-between" align="center">
              <Text fz={16} fw={600} tt="capitalize">
                Transaction Volume
              </Text>

              <Flex>
                <NativeSelect
                  classNames={{
                    wrapper: styles.select__wrapper,
                    input: styles.select__input,
                  }}
                  onChange={(event) =>
                    setChartFrequency(event.currentTarget.value)
                  }
                  data={["Monthly", "Weekly"]}
                />
              </Flex>
            </Flex>

            <Flex justify="center" my={37} h={150}>
              <DonutChartComponent
                data={
                  !totalTrxVolume
                    ? [
                        {
                          name: "No Data",
                          value: 100,
                          color: "var(--prune-text-gray-300)",
                        },
                      ]
                    : donutData
                }
                startAngle={180}
                endAngle={0}
                withLabels={formatNumber(totalTrxVolume, true, "EUR")}
              />
            </Flex>

            <Group justify="space-between" px={10} gap={15}>
              {donutData.map((item, index) => {
                return (
                  <Stack
                    key={index}
                    gap={6}
                    pl={9}
                    style={{ borderLeft: `3px solid ${item.color}` }}
                  >
                    <Text fz={12} c="var(--prune-text-gray-800)" fw={400}>
                      {item.name}
                    </Text>

                    <Text fz={16} fw={700} c="var(--prune-text-gray-800)">
                      {formatNumber(item.value, true, "EUR")}
                    </Text>
                  </Stack>
                );
              })}
            </Group>
          </Paper>
        </GridCol>

        <GridCol span={12}>
          <Paper style={{ border: "1px solid #f5f5f5" }}>
            <div className={styles.payout__table}>
              <Group justify="space-between">
                <Text
                  // className={styles.table__text}
                  lts={0.5}
                  fz={16}
                  fw={600}
                  tt="capitalize"
                >
                  Transaction History
                </Text>

                <Button
                  // leftSection={<IconCircleChevronRight size={18} />}
                  variant="transparent"
                  fz={12}
                  c="var(--prune-primary-800)"
                  td="underline"
                  component={Link}
                  href={`/admin/accounts/${params.id}/transactions`}
                >
                  See All Transactions
                </Button>
              </Group>

              <TableComponent
                head={tableHeaders}
                rows={
                  <RowComponent
                    data={transactions.slice(0, 3)}
                    id={params.id}
                  />
                }
                loading={trxLoading}
              />

              <EmptyTable
                rows={transactions}
                loading={trxLoading}
                title="There are no recent transactions"
                text="When transactions are created, recent transactions will appear here."
              />
            </div>
          </Paper>
        </GridCol>
      </Grid>
    </Paper>
  );
}
