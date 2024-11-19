"use client";

import { useParams, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";

import { useMemo, useState } from "react";
import { useSingleAccount } from "@/lib/hooks/accounts";

import { TransactionType, useTransactions } from "@/lib/hooks/transactions";
import {
  IssuedAccountHead,
  SingleAccount,
  SingleAccountBody,
} from "@/ui/components/SingleAccount";
import { useDisclosure } from "@mantine/hooks";
import { Space } from "@mantine/core";
import { validateRequest } from "@/lib/schema";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import Cookies from "js-cookie";
import useNotification from "@/lib/hooks/notification";
import ModalComponent from "../modal";
import { IconBrandLinktree } from "@tabler/icons-react";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import dayjs from "dayjs";
import PaginationComponent from "@/ui/components/Pagination";

export default function Account() {
  const params = useParams<{ id: string }>();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

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

  const customParams = useMemo(() => {
    return {
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
  }, [
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
    active,
    limit,
  ]);

  const {
    loading: trxLoading,
    transactions,
    meta,
  } = useTransactions(params.id, customParams);
  const { handleSuccess, handleError } = useNotification();

  const { loading, account, revalidate } = useSingleAccount(params.id);

  const { business } = useSingleBusiness(account?.companyId ?? "");

  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [openedFreeze, { open: openFreeze, close: closeFreeze }] =
    useDisclosure(false);

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  const freezeAccount = async (type: "freeze" | "unfreeze") => {
    setProcessing(true);
    try {
      if (requestForm.validate().hasErrors) return;

      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${params.id}/${type}`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      handleSuccess("Action Completed", "Account frozen");
      if (type === "freeze") closeFreeze();
      if (type === "unfreeze") close();
      requestForm.reset();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/admin/accounts" },

          {
            title: account?.accountName || "",
            href: `/admin/accounts/${params.id}`,
            loading: loading,
          },
        ]}
      />

      {/* <SingleAccount
        setChartFrequency={setChartFrequency}
        account={account}
        transactions={transactions}
        trxLoading={trxLoading}
        loading={loading}
        params={params}
        revalidate={revalidate}
      /> */}

      {/* Add OpenFreeze useDisclosure */}
      <Space mt={32} />
      <IssuedAccountHead
        account={account}
        loading={loading}
        open={open}
        openFreeze={openFreeze}
        admin
      />

      <SingleAccountBody
        accountID={params?.id}
        account={account}
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={trxLoading}
        setChartFrequency={setChartFrequency}
        admin
        business={business}
        trxMeta={meta}
      >
        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        />
      </SingleAccountBody>

      <ModalComponent
        processing={processing}
        action={() => freezeAccount("freeze")}
        form={requestForm}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={openedFreeze}
        close={closeFreeze}
        title="Freeze this Account?"
        text="You are about to freeze this account. This means no activity can be carried out on this account anymore."
      />

      <ModalComponent
        processing={processing}
        action={() => freezeAccount("unfreeze")}
        form={requestForm}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={opened}
        close={close}
        title="Unfreeze this Account?"
        text="You are about to unfreeze this account. This means full activity can be carried out in the account again."
      />
    </main>
  );
}
