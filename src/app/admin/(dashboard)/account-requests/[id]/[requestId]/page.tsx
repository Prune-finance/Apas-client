"use client";
import Cookies from "js-cookie";

import {
  Avatar,
  Button,
  Group,
  Skeleton,
  Stack,
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
  IconFileDescription,
  IconPointFilled,
  IconRosetteDiscountCheckFilled,
  IconUser,
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
import { useEffect, useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { BadgeComponent } from "@/ui/components/Badge";
import { BackBtn, PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { getInitials } from "@/lib/utils";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import Link from "next/link";
import Documents from "./(tabs)/documents";
import TabsComponent from "@/ui/components/Tabs";
import { areAllDocumentsApproved } from "@/lib/helpers/document-status";
import { notifications } from "@mantine/notifications";

export default function SingleRequest() {
  const params = useParams<{ requestId: string }>();
  const { revalidate, request, loading } = useSingleRequest(params.requestId);
  const { business, loading: loadingBiz } = useSingleBusiness(
    request?.Company.id ?? ""
  );
  const { handleSuccess, handleError, handleInfo } = useNotification();
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);

  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (request && !areAllDocumentsApproved(request)) {
  //       console.log("I ran here");
  //       e.preventDefault();
  //       e.returnValue = ""; // This shows the default browser alert
  //       // setIsModalOpen(true); // Optionally trigger your custom modal
  //       open();
  //     }
  //   };

  //   // const handleRouteChangeStart = (url: string) => {
  //   //   if (!isNavigating) {
  //   //     open()
  //   //     setIsModalOpen(true); // Open the custom modal on route change
  //   //     router.events.emit("routeChangeError"); // Cancel the route change
  //   //     throw "Navigation aborted"; // Prevents navigation
  //   //   }
  //   // };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   // router.events.on("routeChangeStart", handleRouteChangeStart);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     // router.events.off("routeChangeStart", handleRouteChangeStart);
  //   };
  // }, [request]);

  const handleApproval = async () => {
    notifications.clean();
    if (processing) return;

    if (request && !areAllDocumentsApproved(request))
      return handleInfo(
        "Please approve all documents or wait for business to re-upload rejected document(s)",
        ""
      );

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
    if (!reason) return handleInfo("Please provide a reason", "");
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
          { title: "Account Creation", href: "/admin/account-requests" },
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
        {/* <BackBtn /> */}
        <div className={styles.container__header}>
          <Group>
            <div className={styles.header__left}>
              <Group gap={12}>
                {!loading ? (
                  <Avatar
                    color="var(--prune-primary-700)"
                    size={39}
                    variant="filled"
                  >
                    {getInitials(
                      `${request?.firstName ?? ""} ${request?.lastName ?? ""}`
                    )}
                  </Avatar>
                ) : (
                  <Skeleton circle h={39} w={39} />
                )}

                <Stack gap={2}>
                  {!loading ? (
                    <Text
                      fz={20}
                      className={styles.main__header__text}
                      m={0}
                      p={0}
                      fw={600}
                    >
                      {request?.firstName} {request?.lastName}
                    </Text>
                  ) : (
                    <Skeleton h={10} w={100} />
                  )}

                  <Group gap={8}>
                    {business?.kycTrusted && (
                      <IconRosetteDiscountCheckFilled
                        size={17}
                        color="var(--prune-primary-700)"
                      />
                    )}
                    {!loadingBiz ? (
                      <Text
                        fz={12}
                        fw={500}
                        c="var(--prune-text-gray-600)"
                        td="underline"
                        component={Link}
                        href={`/admin/businesses/${business?.id}`}
                      >
                        {business?.name}
                      </Text>
                    ) : (
                      <Skeleton h={10} w={70} />
                    )}
                  </Group>
                </Stack>
              </Group>
            </div>

            <BadgeComponent status={request?.status ?? ""} />
          </Group>

          {request && request.status === "PENDING" && (
            <div className={styles.header__right}>
              <SecondaryBtn text="Reject" action={open} />
              <PrimaryBtn text="Approve" action={openApprove} />
            </div>
          )}
        </div>

        {/* <div className={styles.container__body}> */}
        {request && request.accountType === "USER" && (
          <div>
            <Account request={request} />
            {/* <Business request={request} /> */}
            <Documents request={request} revalidate={revalidate} />
          </div>
        )}

        {request && request.accountType === "CORPORATE" && (
          <TabsComponent tabs={tabs} tt="capitalize" fz={12} fw={500} mt={28}>
            <TabsPanel value={tabs[0].value}>
              <Account request={request} />
              <Documents request={request} revalidate={revalidate} />
            </TabsPanel>
            <TabsPanel value={tabs[1].value}>
              <Directors request={request} revalidate={revalidate} />
            </TabsPanel>
            <TabsPanel value={tabs[2].value}>
              <Shareholders request={request} revalidate={revalidate} />
            </TabsPanel>
          </TabsComponent>
        )}

        <ModalComponent
          action={handleRejection}
          processing={processing}
          opened={opened}
          close={close}
          color="#FEF3F2"
          icon={<IconX color="#D92D20" />}
          title="Reject This Account  Request?"
          text="This means you are rejecting the debit request of this business."
          customApproveMessage="Yes, Reject"
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

const tabs = [
  { value: "Account Information", icon: <IconUser size={14} /> },
  { value: "Directors Documents", icon: <IconFileDescription size={14} /> },
  {
    value: "Key Shareholders Documents",
    icon: <IconFileDescription size={14} />,
  },
];
