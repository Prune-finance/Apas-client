"use client";

import { useParams, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";

import { useMemo, useState } from "react";

import { useSingleAccount } from "@/lib/hooks/accounts";

import { TransactionType, useTransactions } from "@/lib/hooks/transactions";
import {
  IssuedAccountHead,
  SingleAccountBody,
} from "@/ui/components/SingleAccount";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import { Paper, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { parseError } from "@/lib/actions/auth";
import { validateRequest } from "@/lib/schema";
import ModalComponent from "@/app/admin/(dashboard)/accounts/modal";
import { IconBrandLinktree } from "@tabler/icons-react";

import useNotification from "@/lib/hooks/notification";
import dayjs from "dayjs";
import PaginationComponent from "@/ui/components/Pagination";
import createAxiosInstance from "@/lib/axios";
import { calculateTotalPages } from "@/lib/utils";

export default function Account() {
  const params = useParams<{ id: string }>();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const searchParams = useSearchParams();
  const axios = createAxiosInstance("accounts");

  const {
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
    search,
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
      ...(search && { search: search }),
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
    search,
  ]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedFreeze, { open: openFreeze, close: closeFreeze }] =
    useDisclosure(false);

  const {
    loading: loadingTrx,
    transactions,
    meta,
  } = useTransactions(params.id, customParams);

  const {
    loading,
    account,
    revalidate: revalidateAcct,
  } = useSingleAccount(params.id);

  const {
    loading: loadingBiz,
    business,
    revalidate,
  } = useSingleBusiness(account?.companyId || "");

  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const [processing, setProcessing] = useState(false);

  const { handleError, handleSuccess } = useNotification();

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  const freezeAccount = async (id: string, freeze: boolean) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;

      const path = freeze ? "freeze" : "unfreeze";
      await axios.patch(`/admin/accounts/${id}/${path}`, {
        reason,
        ...(supportingDocumentName && { supportingDocumentName }),
        ...(supportingDocumentUrl && { supportingDocumentUrl }),
      });

      const message = freeze ? "Account frozen" : "Account unfrozen";
      handleSuccess("Action Completed", message);
      revalidateAcct();
      closeFreeze();
      close();
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
          { title: "Businesses", href: "/admin/businesses" },
          {
            title: business?.name || "",
            href: `/admin/businesses/${params.id}`,
            loading: !business?.name || loadingBiz,
          },
          {
            title: "IssuedAccounts",
            href: `/admin/businesses/accounts/${params.id}`,
            loading: loading,
          },
          {
            title: account?.accountName || "",
            href: `/admin/businesses/accounts/${params.id}`,
            loading: loading,
          },
        ]}
      />
      <Paper p={28} mt={20} mih="calc(100vh - 150px)">
        <IssuedAccountHead
          loading={loading}
          account={account}
          open={open}
          openFreeze={openFreeze}
          admin
        />

        {/* <SingleAccount
        setChartFrequency={setChartFrequency}
        account={account}
        transactions={transactions}
        trxLoading={loadingTrx}
        loading={loading}
        params={params}
        revalidate={revalidateAcct}
      /> */}

        <SingleAccountBody
          accountID={params?.id}
          account={account}
          location="admin-account"
          transactions={transactions as TransactionType[]}
          loading={loading}
          loadingTrx={loadingTrx}
          setChartFrequency={setChartFrequency}
          business={business}
          admin
          trxMeta={meta}
          revalidate={revalidateAcct}
        >
          <PaginationComponent
            active={active}
            setActive={setActive}
            setLimit={setLimit}
            limit={limit}
            total={calculateTotalPages(limit, meta?.total)}
          />
        </SingleAccountBody>

        <ModalComponent
          processing={processing}
          action={() => freezeAccount(account?.id || "", false)}
          form={requestForm}
          color="#F2F4F7"
          icon={<IconBrandLinktree color="#344054" />}
          opened={opened}
          close={close}
          title="Unfreeze this Account?"
          text="You are about to unfreeze this account. This means full activity can be carried out in the account again."
        />

        <ModalComponent
          processing={processing}
          action={() => freezeAccount(account?.id || "", true)}
          form={requestForm}
          color="#F2F4F7"
          icon={<IconBrandLinktree color="#344054" />}
          opened={openedFreeze}
          close={closeFreeze}
          title="Freeze this Account?"
          text="You are about to freeze this account. This means no activity can be carried out on this account anymore."
        />
      </Paper>
    </main>
  );
}
