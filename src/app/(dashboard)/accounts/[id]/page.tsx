"use client";

import { useParams, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import {
  Avatar,
  Flex,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";

import { useState } from "react";

import { useSingleUserAccount } from "@/lib/hooks/accounts";
import { TransactionType, useUserTransactions } from "@/lib/hooks/transactions";

import { useDisclosure } from "@mantine/hooks";
import DebitRequestModal from "../../debit-requests/new/modal";
import { BadgeComponent } from "@/ui/components/Badge";
import { SingleAccountBody } from "@/ui/components/SingleAccount";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "../modal";
import useNotification from "@/lib/hooks/notification";
import { useForm, zodResolver } from "@mantine/form";
import { validateRequest } from "@/lib/schema";
import { parseError } from "@/lib/actions/auth";
import {
  IconBrandLinktree,
  IconCheck,
  IconClock12,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import PaginationComponent from "@/ui/components/Pagination";
import createAxiosInstance from "@/lib/axios";

export default function Account() {
  const params = useParams<{ id: string }>();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const axios = createAxiosInstance("accounts");

  const searchParams = useSearchParams();

  const {
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
  } = Object.fromEntries(searchParams.entries());

  const customParams = {
    ...(status && { status: status.toUpperCase() }),
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(type && { type: type }),
    ...(senderName && { senderName: senderName }),
    ...(recipientName && { recipientName: recipientName }),
    ...(recipientIban && { recipientIban: recipientIban }),
    page: active,
    limit: parseInt(limit ?? "10", 10),
  };

  const { account, loading, revalidate, meta } = useSingleUserAccount(
    params.id
  );
  const { handleSuccess, handleError } = useNotification();
  const {
    loading: trxLoading,
    transactions,
    meta: txrMeta,
  } = useUserTransactions(params.id, customParams);
  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [deactivateOpened, { open: deactivateOpen, close: deactivateClose }] =
    useDisclosure(false);
  const [freezeOpened, { open: freezeOpen, close: freezeClose }] =
    useDisclosure(false);
  const [unfreezeOpened, { open: unfreezeOpen, close: unfreezeClose }] =
    useDisclosure(false);

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  const requestFunc = async (
    type: "freeze" | "unfreeze" | "deactivate" | "activate"
  ) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      const { hasErrors } = requestForm.validate();
      if (hasErrors) return;
      await axios.patch(`/accounts/${params.id}/${type}`, {
        reason,
        ...(supportingDocumentName && { supportingDocumentName }),
        ...(supportingDocumentUrl && { supportingDocumentUrl }),
      });

      const message =
        type === "freeze"
          ? "Freeze account request submitted"
          : type === "unfreeze"
          ? "Unfreeze account request submitted"
          : type === "deactivate"
          ? "Deactivate account request submitted"
          : "Activate account request submitted";

      revalidate();
      handleSuccess("Action Completed", message);

      if (type === "freeze") freezeClose();
      if (type === "unfreeze") unfreezeClose();
      if (type === "deactivate") deactivateClose();
      if (type === "activate") activateClose();

      requestForm.reset();
    } catch (error) {
      const message =
        type === "freeze"
          ? "Freeze account request failed"
          : type === "unfreeze"
          ? "Unfreeze account request failed"
          : type === "deactivate"
          ? "Deactivate account request failed"
          : "Activate account request failed";
      handleError(message, parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/accounts" },
          { title: "Issued Accounts", href: "/accounts?tab=Issued Accounts" },
          {
            title: account?.accountName || "",
            href: `/accounts/${params.id}`,
            loading: loading,
          },
        ]}
      />

      <Flex
        justify="space-between"
        align="center"
        className={styles.main__header}
      >
        <Group gap={12} align="center">
          {!loading ? (
            <Avatar
              size="lg"
              color="var(--prune-primary-700)"
              variant="filled"
            >{`${account?.firstName.charAt(0)}${account?.lastName.charAt(
              0
            )}`}</Avatar>
          ) : (
            <Skeleton circle h={50} w={50} />
          )}

          <Stack gap={2}>
            {!loading ? (
              <Text fz={24} className={styles.main__header__text} m={0} p={0}>
                {account?.accountName}
              </Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}

            {!loading ? (
              <Text
                fz={10}
                fw={400}
                className={styles.main__header__text}
                m={0}
                p={0}
              >
                {account?.accountNumber ?? ""}
              </Text>
            ) : (
              <Skeleton h={10} w={50} />
            )}
          </Stack>

          {!loading ? (
            <BadgeComponent status={account?.status ?? ""} active />
          ) : (
            <Skeleton w={60} h={10} />
          )}
        </Group>

        <Flex gap={10}>
          <PrimaryBtn
            text="Debit Account"
            fw={600}
            action={open}
            display={account?.status === "ACTIVE" ? "" : "none"}
          />

          {account?.status !== "FROZEN" && (
            <PrimaryBtn
              text={account?.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
              fw={600}
              action={
                account?.status === "ACTIVE" ? deactivateOpen : activateOpen
              }
              color={account?.status === "ACTIVE" ? "#D92D20" : "#027A48"}
              c={
                meta?.hasPendingActivate || meta?.hasPendingDeactivate
                  ? "#888"
                  : "#fff"
              }
              loading={loading}
              disabled={meta?.hasPendingActivate || meta?.hasPendingDeactivate}
              icon={
                meta?.hasPendingActivate || meta?.hasPendingDeactivate
                  ? IconClock12
                  : undefined
              }
            />
          )}

          {account?.status === "ACTIVE" && (
            <SecondaryBtn
              text="Freeze Account"
              fw={600}
              action={freezeOpen}
              disabled={meta?.hasPendingFreeze}
              icon={meta?.hasPendingFreeze ? IconClock12 : undefined}
            />
          )}

          {account?.status === "FROZEN" && (
            <SecondaryBtn
              text="Unfreeze Account"
              fw={600}
              action={unfreezeOpen}
            />
          )}
        </Flex>
      </Flex>

      <SingleAccountBody
        account={account}
        accountID={params?.id}
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={trxLoading}
        setChartFrequency={setChartFrequency}
        trxMeta={txrMeta}
        location="issued-account"
        isUser
      >
        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((txrMeta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        />
      </SingleAccountBody>

      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
      >
        <DebitRequestModal
          close={close}
          selectedId={account?.id || ""}
          accountBalance={account?.accountBalance}
        />
      </Modal>

      <ModalComponent
        processing={processing}
        action={() => requestFunc("freeze")}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={freezeOpened}
        close={freezeClose}
        title="Freeze this Account?"
        form={requestForm}
        text="You are about to request for this account to be frozen. This means no activity can be carried out in the account anymore. Please state your reason below"
      />

      <ModalComponent
        processing={processing}
        action={() => requestFunc("unfreeze")}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={unfreezeOpened}
        close={unfreezeClose}
        form={requestForm}
        title="Unfreeze this Account?"
        text="You are about to request for this account to be unfrozen. This means full activity can be carried out in the account again. Please state your reason below"
      />

      <ModalComponent
        processing={processing}
        action={() => requestFunc("deactivate")}
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={deactivateOpened}
        close={deactivateClose}
        form={requestForm}
        title="Deactivate This Account?"
        text="You are about to request for this account to be deactivated. This means the account will be inactive. Please state your reason below"
      />

      <ModalComponent
        processing={processing}
        action={() => requestFunc("activate")}
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={activateOpened}
        close={activateClose}
        form={requestForm}
        title="Activate This Account?"
        text="You are about to request for this account to be activated. This means the account will become active. Please state your reason below"
      />
    </main>
  );
}
