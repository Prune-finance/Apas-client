"use client";
import Cookies from "js-cookie";

import {
  Button,
  Group,
  Skeleton,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconBuildingSkyscraper,
  IconCheck,
  IconPointFilled,
  IconUsers,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/singlebusiness.module.scss";

import Business from "./(tabs)/business";
import Directors from "./(tabs)/directors";
import Account from "./(tabs)/accounts";
import ModalComponent from "@/ui/components/Modal";
import { useDisclosure } from "@mantine/hooks";
import { useSingleRequest } from "@/lib/hooks/requests";
import Shareholders from "./(tabs)/shareholder";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import { useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { BadgeComponent } from "@/ui/components/Badge";

export default function SingleRequest() {
  const params = useParams<{ requestId: string }>();
  const { revalidate, request, loading } = useSingleRequest(params.requestId);
  const { handleSuccess, handleError } = useNotification();
  const { back } = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);

  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState("");

  const handleApproval = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/request/approve/${params.requestId}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      closeApprove();
      handleSuccess(
        "Request Approved",
        "You have approved this account request"
      );
      revalidate();
    } catch (error) {
      return handleError("Request Approval Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleRejection = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/request/reject/${params.requestId}`,
        { ...(reason && { reason }) },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      close();
      handleSuccess(
        "Request Rejected",
        "You have rejected this account request"
      );
      revalidate();
    } catch (error) {
      return handleError("Request Approval Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Account Requests", href: "/admin/account-requests" },
          {
            title: request?.Company.name || "",
            href: `/admin/account-requests/${request?.Company.id}`,
            loading: loading,
          },
          {
            title: `${request?.firstName || ""} ${request?.lastName || ""}`,
            href: `/admin/account-requests/${request?.Company.id}/${params.requestId}`,
            loading: loading,
          },
        ]}
      />

      <div className={styles.page__container}>
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
          //   style={{ pointerEvents: !account ? "none" : "auto" }}
        >
          Back
        </Button>
        <div className={styles.container__header}>
          <Group>
            <div className={styles.header__left}>
              {request ? (
                <Text fz={18} fw={600}>
                  {request.firstName} {request.lastName}
                </Text>
              ) : (
                <Skeleton h={10} w={100} />
              )}
            </div>

            <BadgeComponent status={request?.status ?? ""} />
          </Group>

          {request && request.status === "PENDING" && (
            <div className={styles.header__right}>
              <Button
                onClick={open}
                // className={styles.header__cta}
                variant="outline"
                color="var(--prune-text-gray-300)"
                c="var(--prune-text-gray-800)"
                // w={90}
                fz={12}
                fw={500}
              >
                Deny
              </Button>

              <Button
                onClick={openApprove}
                // className={styles.header__cta}
                variant="filled"
                color="var(--prune-primary-600)"
                c="var(--prune-text-gray-800)"
                // w={90}
                fz={12}
                fw={500}
              >
                Approve
              </Button>
            </div>
          )}
        </div>

        <div className={styles.container__body}>
          <Tabs
            defaultValue="Account"
            variant="pills"
            classNames={{
              root: styles.tabs,
              list: styles.tabs__list,
              tab: styles.tab,
            }}
          >
            <TabsList>
              <TabsTab value="Account" leftSection={<IconUsers size={14} />}>
                Account Information
              </TabsTab>
              <TabsTab
                value="Business"
                leftSection={<IconBuildingSkyscraper size={14} />}
              >
                Business Information
              </TabsTab>
              {request && request.accountType === "CORPORATE" && (
                <>
                  {" "}
                  <TabsTab
                    value="Directors"
                    leftSection={<IconUsers size={14} />}
                  >
                    Directors
                  </TabsTab>
                  <TabsTab
                    value="Shareholders"
                    leftSection={<IconUsersGroup size={14} />}
                  >
                    Key Shareholders
                  </TabsTab>{" "}
                </>
              )}
            </TabsList>

            <TabsPanel value="Business">
              <Business request={request} />
            </TabsPanel>

            <TabsPanel value="Account">
              <Account request={request} />
            </TabsPanel>

            <TabsPanel value="Directors">
              <Directors request={request} />
            </TabsPanel>

            <TabsPanel value="Shareholders">
              <Shareholders request={request} />
            </TabsPanel>
          </Tabs>
        </div>

        <ModalComponent
          action={handleRejection}
          processing={processing}
          opened={opened}
          close={close}
          color="#FEF3F2"
          icon={<IconX color="#D92D20" />}
          title="Reject This Account  Request?"
          text="This means you are rejecting the debit request of this business."
          customApproveMessage="Yes, Deny"
          addReason
          reason={reason}
          setReason={setReason}
        />

        <ModalComponent
          action={handleApproval}
          opened={approveOpened}
          processing={processing}
          close={closeApprove}
          color="#ECFDF3"
          icon={<IconCheck color="#12B76A" />}
          title="Approve This Account Request?"
          text="This means you are accepting the debit request of this business."
          customApproveMessage="Yes, Approve"
        />
      </div>
    </main>
  );
}

//  {
//    request && (
//      <div
//        className={styles.business__status}
//        style={{
//          background:
//            request.status === "APPROVED"
//              ? "#ECFDF3"
//              : request.status === "REJECTED"
//              ? "#FCF1F2"
//              : "#F9F6E6",
//        }}
//      >
//        <IconPointFilled
//          size={14}
//          color={
//            request.status === "APPROVED"
//              ? "#12B76A"
//              : request.status === "REJECTED"
//              ? "#D92D20"
//              : "#C6A700"
//          }
//        />
//        <Text
//          tt="capitalize"
//          fz={12}
//          c={
//            request.status === "APPROVED"
//              ? "#12B76A"
//              : request.status === "REJECTED"
//              ? "#D92D20"
//              : "#C6A700"
//          }
//        >
//          {request.status.toLowerCase()}
//        </Text>
//      </div>
//    );
//  }
