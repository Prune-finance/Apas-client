"use client";

import { Group, Text, TabsPanel, Skeleton, Alert } from "@mantine/core";

import styles from "./styles.module.scss";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";

import { useSearchParams } from "next/navigation";

import { Suspense, useEffect, useRef, useState } from "react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

import { useUserBusiness } from "@/lib/hooks/businesses";
import TabsComponent from "@/ui/components/Tabs";
import { PayoutAccount } from "./(tabs)/Account";
import { InquiriesTab } from "./(tabs)/Inquiries";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { LiveDateModal } from "../settings/LiveDateModal";
import { AlertStore } from "@/lib/store/alert";
import { PayoutTransactions } from "./(tabs)/PayoutTransactions";
import PayoutRequests from "./(tabs)/Requests";
import createAxiosInstance from "@/lib/axios";

function PayoutTrx() {
  const searchParams = useSearchParams();

  const { tab } = Object.fromEntries(searchParams.entries());
  const [tabValue, setTabValue] = useState<string | null>(tab);

  const [processing, setProcessing] = useState(false);
  const [liveDate, setLiveDate] = useState<Date | null>(null);
  const [processingLKReq, setProcessingLKReq] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const { handleError, handleInfo, handleSuccess } = useNotification();

  const { business, meta, revalidate, loading } = useUserBusiness();
  const { close: closeAlert, opened: openedAlert } = AlertStore();
  const axios = createAxiosInstance("accounts");
  const authAxios = createAxiosInstance("auth");

  useEffect(() => {
    setTabValue(tab);
  }, [tab]);

  const requestPayoutAccount = async () => {
    setProcessing(true);

    try {
      await axios.get(`/accounts/payout/request`);
      revalidate();
      handleSuccess(
        "Request Sent",
        "You will have access to a payout account once your request has been approved."
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const requestLiveKey = async () => {
    notifications.clean();
    if (!liveDate)
      return handleInfo("Please select a date to request a live key", "");

    setProcessingLKReq(true);
    try {
      const { data: res } = await authAxios.post(`/key/secrets/live/request`, {
        date: liveDate,
      });

      close();
      handleSuccess(
        "Request Sent",
        "You have successfully requested for Live keys . Once it is generated by the Super  Admin, it would appear here."
      );
      revalidate();
    } catch (error) {
      handleError("Request for Live Key failed", parseError(error));
    } finally {
      setProcessingLKReq(false);
    }
  };

  return (
    <main
    // className={styles.main}
    >
      {!Boolean(meta?.hasLiveKey) &&
        Boolean(meta?.hasPayoutAccount) &&
        openedAlert && (
          <Alert
            variant="light"
            color="#D1B933"
            mb={28}
            radius={8}
            style={{ border: "1px solid #D1B933" }}
            withCloseButton
            onClose={closeAlert}
            icon={<IconInfoCircle />}
            title="Please know that you are in test mode. To go live, request for Live keys by clicking the “request live keys” button below."
          ></Alert>
        )}

      <Group justify="space-between">
        <div>
          <Text fz={18} fw={600}>
            Payouts
          </Text>
          <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
            Here’s an overview of your payout account activities
          </Text>
        </div>

        {loading ? (
          <Skeleton h={30} w={100} />
        ) : (
          <>
            {!Boolean(meta?.hasPayoutAccount) && (
              <PrimaryBtn
                fw={600}
                text={
                  Boolean(meta?.activePAReq)
                    ? "Request Sent"
                    : "Request Payout Account"
                }
                {...(Boolean(meta?.activePAReq) && {
                  icon: IconCheck,
                })}
                loading={loading || processing}
                loaderProps={{ type: "dots" }}
                disabled={Boolean(meta?.activePAReq)}
                action={requestPayoutAccount}
              />
            )}

            {Boolean(meta?.hasPayoutAccount) && !Boolean(meta?.hasLiveKey) && (
              <PrimaryBtn
                fw={600}
                text={
                  Boolean(meta?.activeLKReq)
                    ? "Request Sent"
                    : "Request Live Keys"
                }
                {...(Boolean(meta?.activeLKReq) && {
                  icon: IconCheck,
                })}
                loading={loading || processingLKReq}
                loaderProps={{ type: "dots" }}
                disabled={Boolean(meta?.activeLKReq)}
                action={open}
              />
            )}

            {Boolean(meta?.hasPayoutAccount) && Boolean(meta?.hasLiveKey) && (
              <PrimaryBtn
                fw={600}
                text="View Live Keys"
                loading={loading}
                loaderProps={{ type: "dots" }}
                link="/settings?tab=Keys"
              />
            )}
          </>
        )}
      </Group>

      <TabsComponent
        // defaultValue={tabs.find((t) => t.value === tab)?.value ?? tabs[0].value}
        value={tabValue}
        onChange={(value) => {
          setTabValue(value);
          window.history.pushState({}, "", `?tab=${value}`);
        }}
        tabs={tabs}
        mt={28}
        keepMounted={false}
      >
        <TabsPanel value={tabs[0].value}>
          <PayoutAccount loading={loading} meta={meta} />
        </TabsPanel>

        <TabsPanel value={tabs[1].value}>
          <PayoutTransactions
          // loading={loading} meta={meta}
          />
        </TabsPanel>

        <TabsPanel value={tabs[2].value}>
          <InquiriesTab />
        </TabsPanel>

        <TabsPanel value={tabs[3].value}>
          <PayoutRequests />
        </TabsPanel>
      </TabsComponent>

      <LiveDateModal
        opened={opened}
        close={close}
        processing={processingLKReq}
        action={requestLiveKey}
        date={liveDate}
        setDate={setLiveDate}
      />
    </main>
  );
}

export default function AccountTrxSuspense() {
  return (
    <Suspense>
      <PayoutTrx />
    </Suspense>
  );
}

const tabs = [
  { value: "Account" },
  { value: "Transactions" },
  { value: "Inquiries" },
  { value: "Requests" },
];
