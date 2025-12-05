"use client";
import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  TableTd,
  TableTr,
  UnstyledButton,
  ThemeIcon,
  Center,
  ScrollArea,
  Modal,
  Loader,
  Flex,
  Skeleton,
} from "@mantine/core";
import React, { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";

import styles from "./styles.module.scss";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  IconAlignCenter,
  IconCalendarMonth,
  IconCircleArrowDown,
  IconListTree,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import EmptyTable from "@/ui/components/EmptyTable";
import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import Filter from "@/ui/components/Filter";
import { TableComponent } from "@/ui/components/Table";
import PaginationComponent from "@/ui/components/Pagination";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import {
  frontendPagination,
  calculateTotalPages,
  removeWhitespace,
} from "@/lib/utils";
import ModalProvider from "@/ui/components/Modal/ModalProvider";
import ModalComponent from "@/ui/components/Modal";
import {
  TextInputWithInsideLabel,
  SelectInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { beneficiaryModalValidate } from "@/lib/schema/debit-request";
import { IconCheck, IconX } from "@tabler/icons-react";

import EUIcon from "@/assets/EU-icon.png";
import GBIcon from "@/assets/GB.png";
import USIcon from "@/assets/USD.png";
import NGIcon from "@/assets/Nigeria.png";
import GHIcon from "@/assets/GH.png";
import CurrencyTab from "@/ui/components/CurrencyTab";
import useCurrencySwitchStore from "@/lib/store/currency-switch";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { handleBeneficiariesCsvDownload, parseError } from "@/lib/actions/auth";
import {
  BeneficiaryAccountProps,
  useBeneficiaryAccount,
  validateAccount,
  validateAccountGBP,
  useUserListOfBanks,
  useCheckCurrencyList,
} from "@/lib/hooks/accounts";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import countries from "@/assets/countries.json";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";

const currencyTabs = [
  {
    value: "EUR",
    icon: <Image width={18} height={18} src={EUIcon} alt="eur" />,
  },
  {
    value: "GBP",
    icon: <Image width={18} height={18} src={GBIcon} alt="gbp" />,
  },
  {
    value: "GHS",
    icon: <Image width={18} height={18} src={GHIcon} alt="ghs" />,
  },
  {
    value: "USD",
    icon: <Image width={18} height={18} src={USIcon} alt="usd" />,
  },
];

const inputStyle = {
  backgroundColor: "#fff",
  borderColor: "#f2f4f7",
};

const Beneficiaries = () => {
  const searchParams = useSearchParams();
  const axios = createAxiosInstance("accounts");
  const [currency, setCurrency] = useState<"EUR" | "GBP" | "GHS" | "USD">(
    "EUR"
  );
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [
    openedTransactionsPreview,
    { open: openTransactionsPreview, close: closeTransactionsPreview },
  ] = useDisclosure(false);
  const [documentType, setDocumentType] = useState<string>("CSV");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const { switchCurrency, setSwitchCurrency } = useCurrencySwitchStore();
  const [beneficiaryType, setBeneficiaryType] = useState<string>("Individual");
  const { handleError, handleSuccess, handleInfo } = useNotification();
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<BeneficiaryAccountProps | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { account: accountCurrencyList, loading: accountCurrencyListLoading } =
    useCheckCurrencyList();

  const { status, date, endDate, accountName, type, tab } = Object.fromEntries(
    searchParams.entries()
  );

  const modalForm = useForm({
    initialValues: {
      type: "INDIVIDUAL",
      firstName: "",
      lastName: "",
      companyName: "",
      contactEmail: "",
      iban: "",
      bic: "",
      bank: "",
      bankAddress: "",
      country: "",
      state: "",
      accountNumber: "",
      sortCode: "",
      routingNumber: "",
      phoneNumber: "",
      currency: switchCurrency ?? currencyTabs[0].value,
      gshTransferType: "BankTransfer",
      usdTransferType: "WithinUSA",
    },
    validate: zodResolver(beneficiaryModalValidate),
  });

  const { banks, loading: banksLoading } = useUserListOfBanks();
  const ghsBankProviderOptions = useMemo(() => {
    if (!banks || !Array.isArray(banks)) return [];
    return banks
      .filter((item) => item.payoutType === modalForm.values.gshTransferType)
      .map((item) => ({
        value: item.bankName || "",
        label: item.bankName || "",
      }));
  }, [banks, modalForm.values.gshTransferType]);

  React.useEffect(() => {
    if (modalForm.values.currency === "GHS") {
      modalForm.setFieldValue("bank", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalForm.values.gshTransferType]);

  const isValidated = useMemo(() => {
    const c = modalForm.values.currency;
    if (c === "EUR")
      return (
        !!modalForm.values.iban &&
        !!modalForm.values.bic &&
        !modalForm.errors.iban &&
        !modalForm.errors.bic
      );
    if (c === "GBP")
      return (
        !!modalForm.values.accountNumber &&
        !!modalForm.values.sortCode &&
        !modalForm.errors.accountNumber &&
        !modalForm.errors.sortCode
      );
    if (c === "USD") {
      if (modalForm.values.usdTransferType === "WithinUSA")
        return (
          !!modalForm.values.iban &&
          !!modalForm.values.bic &&
          !modalForm.errors.iban &&
          !modalForm.errors.bic
        );
      return (
        !!modalForm.values.routingNumber &&
        !!modalForm.values.accountNumber &&
        !modalForm.errors.routingNumber &&
        !modalForm.errors.accountNumber
      );
    }
    if (c === "GHS") {
      if (modalForm.values.gshTransferType === "MobileMoney")
        return !!modalForm.values.phoneNumber && !modalForm.errors.phoneNumber;
      return (
        !!modalForm.values.accountNumber && !modalForm.errors.accountNumber
      );
    }
    return false;
  }, [modalForm.values, modalForm.errors]);

  React.useEffect(() => {
    modalForm.setFieldValue("currency", currency);
    setSwitchCurrency(currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  React.useEffect(() => {
    modalForm.setFieldValue("currency", switchCurrency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchCurrency]);

  React.useEffect(() => {
    modalForm.setFieldValue(
      "type",
      beneficiaryType === "Individual" ? "INDIVIDUAL" : "COMPANY"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beneficiaryType]);

  const buildBeneficiaryPayload = (v: typeof modalForm.values) => {
    const base = {
      alias:
        v.type === "COMPANY" ? v.companyName : `${v.firstName} ${v.lastName}`,
      currency: v.currency,
      isFavorite: false,
      accountHolderAddress: v.bankAddress,
      type: v.type,
      ...(v.type === "INDIVIDUAL"
        ? { firstName: v.firstName, lastName: v.lastName }
        : { companyName: v.companyName, contactEmail: v.contactEmail }),
    };

    if (v.currency === "EUR")
      return {
        ...base,
        bankName: v.bank,
        accountIban: removeWhitespace(v.iban),
        swiftBic: removeWhitespace(v.bic),
      };

    if (v.currency === "GBP")
      return {
        ...base,
        bankName: v.bank,
        accountNumber: removeWhitespace(v.accountNumber),
        sortCode: removeWhitespace(v.sortCode),
      };

    if (v.currency === "USD") {
      if (v.usdTransferType === "WithinUSA")
        return {
          ...base,
          bankName: v.bank,
          accountIban: removeWhitespace(v.iban),
          swiftBic: removeWhitespace(v.bic),
        };
      return {
        ...base,
        bankName: v.bank,
        routingNumber: removeWhitespace(v.routingNumber),
        accountNumber: removeWhitespace(v.accountNumber),
      };
    }

    if (v.currency === "GHS") {
      if (v.gshTransferType === "MobileMoney")
        return {
          ...base,
          walletId: v.phoneNumber,
          mobileOperator: v.bank,
          countryCode: v.country,
        };
      return {
        ...base,
        mobileOperator: v.bank,
        walletId: removeWhitespace(v.accountNumber),
        countryCode: v.country,
      };
    }

    return base;
  };
  const [processing, setProcessing] = useState<boolean | null>(null);
  const [loadingStatement, setLoadingStatement] = useState<boolean>(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [validated, setValidated] = useState<boolean | null>(null);

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    accountName: accountName?.trim(),
    status: status ? status.toUpperCase() : "",
    type: type ? (type === "Individual" ? "USER" : "CORPORATE") : "",
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
  };

  const {
    beneficiaryAccount,
    meta,
    loading: beneficiaryAccountLoading,
    revalidate: beneficiaryAccountRevalidate,
  } = useBeneficiaryAccount(
    {
      ...queryParams,
    },
    currency
  );

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const rows = (beneficiaryAccount ?? []).map((element, index) => (
    <TableTr key={`${element?.id}-${index}`}>
      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={500}>
            {element?.alias}
          </Text>
        </Stack>
      </TableTd>
      <TableTd>{element?.type}</TableTd>
      <TableTd>{element?.bankName || element?.mobileOperator}</TableTd>
      <TableTd>
        {element?.Currency?.symbol === "EUR"
          ? element?.accountIban
          : element?.Currency?.symbol === "GBP"
          ? element?.accountNumber
          : element?.Currency?.symbol === "USD"
          ? element?.accountNumber || element?.accountIban
          : element?.Currency?.symbol === "NGN"
          ? element?.accountNumber
          : element?.Currency?.symbol === "GHS"
          ? element?.walletId || element?.mobileOperator
          : ""}
      </TableTd>
      <TableTd>
        <Group gap={6}>
          {element?.Currency?.symbol === "EUR" && (
            <Image width={18} height={18} src={EUIcon} alt="eur" />
          )}
          {element?.Currency?.symbol === "GBP" && (
            <Image width={18} height={18} src={GBIcon} alt="gbp" />
          )}
          {element?.Currency?.symbol === "USD" && (
            <Image width={18} height={18} src={USIcon} alt="usd" />
          )}
          {element?.Currency?.symbol === "NGN" && (
            <Image width={18} height={18} src={NGIcon} alt="ngn" />
          )}
          {element?.Currency?.symbol === "GHS" && (
            <Image width={18} height={18} src={GHIcon} alt="ghs" />
          )}
          <Text fz={12} fw={500}>
            {element?.Currency?.symbol}
          </Text>
        </Group>
      </TableTd>
      <TableTd>
        <Group gap={10}>
          <UnstyledButton
            onClick={() => {
              setSelectedBeneficiary(element);
              openDelete();
            }}
          >
            <ThemeIcon color="#FEF3F2" radius="md">
              <IconTrash size={14} color="#D92D20" />
            </ThemeIcon>
          </UnstyledButton>
        </Group>
      </TableTd>
    </TableTr>
  ));

  const [{ bic, iban }] = useDebouncedValue(
    { iban: modalForm.values.iban, bic: modalForm.values.bic },
    2000
  );

  React.useEffect(() => {
    const c = modalForm.values.currency;
    const isIbanFlow =
      c === "EUR" ||
      (c === "USD" && modalForm.values.usdTransferType === "WithinUSA");
    if (isIbanFlow && iban && bic) {
      handleIbanValidation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bic, iban, modalForm.values.currency, modalForm.values.usdTransferType]);

  const [{ accountNumber, sortCode }] = useDebouncedValue(
    {
      accountNumber: modalForm.values.accountNumber,
      sortCode: modalForm.values.sortCode,
    },
    2000
  );

  React.useEffect(() => {
    const c = modalForm.values.currency;
    if (c === "GBP" && accountNumber && sortCode) {
      handleIbanValidationGBP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, sortCode, modalForm.values.currency]);

  const handleIbanValidation = async () => {
    try {
      setValidated(null);
      setProcessing(true);
      const data = await validateAccount({
        iban: removeWhitespace(iban || ""),
        bic: removeWhitespace(bic || ""),
      });

      if (data) {
        modalForm.setValues({
          bankAddress: data.address || data.city,
          bank: data.bankName,
          country: data.country,
        });
        setValidated(Boolean(isValidated));
      }
    } catch (err) {
      setValidated(false);
      // ignore
    } finally {
      setProcessing(false);
    }
  };

  const handleIbanValidationGBP = async () => {
    try {
      setValidated(null);
      setProcessing(true);
      const data = await validateAccountGBP({
        accountNumber: removeWhitespace(accountNumber || ""),
        sortCode: removeWhitespace(sortCode || ""),
      });

      if (data) {
        modalForm.setValues({
          bankAddress: data.bankAddress || data.city,
          bank: data.bankName,
        });
        setValidated(Boolean(isValidated));
      }
    } catch (err) {
      setValidated(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteBeneficiary = async () => {
    if (!selectedBeneficiary?.id) return;
    try {
      setDeleting(true);
      await axios.delete(
        `/accounts/beneficiaries/${selectedBeneficiary.id}/delete`
      );
      handleSuccess("Delete Beneficiary", "Beneficiary deleted successfully");
      beneficiaryAccountRevalidate();
      closeDelete();
      setSelectedBeneficiary(null);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveBeneficiary = async () => {
    const result = beneficiaryModalValidate.safeParse(modalForm.values);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      Object.entries(errors).forEach(([field, messages]) => {
        if (messages?.[0]) modalForm.setFieldError(field, messages[0]);
      });

      return;
    }
    const payload = buildBeneficiaryPayload(modalForm.values);
    try {
      setLoading(true);
      const { data: res } = await axios.post(
        "/accounts/beneficiaries",
        payload
      );
      handleSuccess(
        "Beneficiary successfully",
        "Beneficiary added successfully"
      );
      beneficiaryAccountRevalidate();
      closeModal();
      modalForm.reset();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleExportStatement = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      return handleInfo(
        "Transactions Export",
        "Please select a valid date range"
      );
    }

    notifications.clean();
    setLoadingStatement(true);

    const [startDate, endDate] = dateRange.map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );

    const baseUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL;
    const headers = { Authorization: `Bearer ${Cookies.get("auth")}` };

    const url = `${baseUrl}/accounts/beneficiaries/export?date=${startDate}&endDate=${endDate}&currency=${currency}`;

    try {
      const { data: res } = await axios.get(url, { headers });

      if (!res?.data?.length) {
        return handleInfo(
          "Beneficiaries Export",
          "No beneficiaries found for the selected date range"
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));

      handleBeneficiariesCsvDownload(
        res.data,
        "beneficiaries_export.csv",
        currency || "EUR"
      );

      closeTransactionsPreview();
      handleSuccess(
        "Beneficiaries Export",
        "Beneficiaries export downloaded successful"
      );
      setDateRange([null, null]);
    } catch (error) {
      console.error("Error exporting beneficiaries:", error);
      handleError(
        "Beneficiaries Export",
        error instanceof Error
          ? parseError(error)
          : "error exporting beneficiaries"
      );
    } finally {
      setLoadingStatement(false);
    }
  };

  const closeModal = () => {
    close();
    modalForm.reset();
    setSelectedBeneficiary(null);
    setValidated(null);
    setProcessing(null);
  };

  const tableHeaders = [
    "Name",
    "Category",
    "Bank",
    currency === "EUR"
      ? "IBAN"
      : currency === "GBP"
      ? "Account Number"
      : currency === "USD"
      ? "IBAN / Account Number"
      : currency === "GHS"
      ? "Wallet ID / Mobile Operator"
      : "Account Number / IBAN",
    "Currency",
    "Action",
  ];

  return (
    <Box>
      <main className={styles.main}>
        <Paper className={styles.table__container}>
          <div className={styles.container__header}>
            <Stack gap={0}>
              <Text fz={18} fw={600}>
                Beneficiary Management
              </Text>
              <Text fz={14} fw={400} c="#667085">
                Manage your saved beneficiaries and categories
              </Text>
            </Stack>

            <Group gap={12}>
              <PrimaryBtn
                icon={IconPlus}
                text="New Beneficiary"
                action={open}
              />
            </Group>
          </div>

          <TabsComponent
            tabs={currencyTabs.filter(
              (item, index) =>
                accountCurrencyList?.[currencyTabs[index]?.value as any] ===
                true
            )}
            loading={accountCurrencyListLoading}
            styles={{ list: { marginTop: 24 } }}
            defaultValue={currency}
            onChange={(v) =>
              setCurrency((v as "EUR" | "GBP" | "GHS" | "USD") || "EUR")
            }
          >
            {accountCurrencyListLoading && (
              <Flex align="center" gap={10}>
                <Skeleton w={50} h={40} mt={10} />
                <Skeleton w={50} h={40} mt={10} />
                <Skeleton w={50} h={40} mt={10} />
                <Skeleton w={50} h={40} mt={10} />
              </Flex>
            )}
            <TabsPanel value={currency}>
              <Group
                justify="space-between"
                mt={24}
                className={styles.container__search__filter}
              >
                <SearchInput
                  search={search}
                  setSearch={setSearch}
                  w={270}
                  placeholder="Search here......"
                />

                <Group gap={12}>
                  {/* <SecondaryBtn
                    action={toggle}
                    text="Filter"
                    icon={IconListTree}
                    fw={600}
                  /> */}
                  <SecondaryBtn
                    text="Export Beneficiary"
                    fw={600}
                    icon={IconCircleArrowDown}
                    action={openTransactionsPreview}
                  />
                </Group>
              </Group>

              <Filter<FilterType>
                opened={openedFilter}
                toggle={toggle}
                form={form}
                customStatusOption={[
                  "PENDING",
                  currency === "GBP" || currency === "USD"
                    ? "COMPLETED"
                    : "CONFIRMED",
                  "REJECTED",
                  "CANCELLED",
                  "FAILED",
                ]}
              >
                <TextBox
                  placeholder="Sender Name"
                  {...form.getInputProps("senderName")}
                />
                <TextBox
                  placeholder="Beneficiary Name"
                  {...form.getInputProps("recipientName")}
                />
                <TextBox
                  placeholder={
                    currency === "GBP"
                      ? "Account Number"
                      : currency === "GHS"
                      ? "Wallet ID"
                      : "Beneficiary IBAN"
                  }
                  {...form.getInputProps("recipientIban")}
                />
                <SelectBox
                  placeholder="Type"
                  {...form.getInputProps("type")}
                  data={["DEBIT", "CREDIT"]}
                  clearable
                />
              </Filter>

              <TableComponent
                head={tableHeaders}
                rows={rows}
                loading={beneficiaryAccountLoading}
                mt={24}
              />

              <EmptyTable
                rows={rows}
                loading={beneficiaryAccountLoading}
                title="There are no beneficiaries"
                text="When a beneficiary is created, it will appear here."
              />

              <PaginationComponent
                total={Math.ceil(
                  (meta?.total ?? 0) / parseInt(limit ?? "10", 10)
                )}
                active={active}
                setActive={setActive}
                limit={limit}
                setLimit={setLimit}
              />
            </TabsPanel>
          </TabsComponent>
        </Paper>

        <Modal
          opened={opened}
          onClose={closeModal}
          title="New Beneficiary"
          size="lg"
          styles={{
            title: { fontSize: 24, fontWeight: 500, color: "#1D2939" },
          }}
        >
          <Center>
            <CurrencyTab bg="#fff" />
          </Center>

          <TabsComponent
            tabs={[{ value: "Individual" }, { value: "Company" }]}
            defaultValue={beneficiaryType}
            onChange={(v) => setBeneficiaryType(v || "Individual")}
            styles={{ list: { marginTop: 24 } }}
            fz={12}
          >
            <TabsPanel value={beneficiaryType}>
              <Box>
                {beneficiaryType === "Individual" && (
                  <Group grow gap={20} mt={12}>
                    <TextInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          First Name <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="First Name"
                      {...modalForm.getInputProps("firstName")}
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          Last Name <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Last Name"
                      {...modalForm.getInputProps("lastName")}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {beneficiaryType === "Company" && (
                  <Group grow gap={20} mt={12}>
                    <TextInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          Company Name <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Company Name"
                      {...modalForm.getInputProps("companyName")}
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label={<Text fz={12}>Contact Email (Optional)</Text>}
                      placeholder="Email"
                      {...modalForm.getInputProps("contactEmail")}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {modalForm.values.currency === "EUR" && (
                  <Group grow gap={20} mt={20}>
                    <TextInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          IBAN <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Enter IBAN"
                      {...modalForm.getInputProps("iban")}
                      bg="#fff"
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          BIC <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Enter BIC"
                      {...modalForm.getInputProps("bic")}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {modalForm.values.currency === "GBP" && (
                  <Group grow gap={20} mt={20}>
                    <TextInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          Account Number <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Enter account number"
                      type="text"
                      inputMode="numeric"
                      maxLength={8}
                      {...modalForm.getInputProps("accountNumber")}
                      onChange={(e) => {
                        const digits = e.currentTarget.value
                          .replace(/\D/g, "")
                          .slice(0, 8);
                        modalForm.setFieldValue("accountNumber", digits);
                      }}
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          Sort Code <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Enter sort code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      {...modalForm.getInputProps("sortCode")}
                      onChange={(e) => {
                        const digits = e.currentTarget.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        modalForm.setFieldValue("sortCode", digits);
                      }}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {modalForm.values.currency === "USD" && (
                  <>
                    <SelectInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          Transfer Type <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      data={[
                        { value: "WithinUSA", label: "WithinUSA" },
                        { value: "OutsideUSA", label: "OutsideUSA" },
                      ]}
                      mt={12}
                      {...modalForm.getInputProps("usdTransferType")}
                      styles={{ input: inputStyle }}
                    />
                    {modalForm.values.usdTransferType === "WithinUSA" ? (
                      <Group grow gap={20} mt={12}>
                        <TextInputWithInsideLabel
                          label={
                            <Text fz={12}>
                              IBAN <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter IBAN"
                          {...modalForm.getInputProps("iban")}
                          styles={{ input: inputStyle }}
                        />
                        <TextInputWithInsideLabel
                          label={
                            <Text fz={12}>
                              SWIFT/BIC <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter SWIFT/BIC"
                          {...modalForm.getInputProps("bic")}
                          styles={{ input: inputStyle }}
                        />
                      </Group>
                    ) : (
                      <Group grow gap={20} mt={12}>
                        <TextInputWithInsideLabel
                          label={
                            <Text fz={12}>
                              Routing Number (ABA){" "}
                              <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter routing number"
                          type="number"
                          {...modalForm.getInputProps("routingNumber")}
                          styles={{ input: inputStyle }}
                        />
                        <TextInputWithInsideLabel
                          label={
                            <Text fz={12}>
                              Account Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter account number"
                          type="number"
                          {...modalForm.getInputProps("accountNumber")}
                          styles={{ input: inputStyle }}
                        />
                      </Group>
                    )}
                  </>
                )}

                {modalForm.values.currency === "GHS" && (
                  <>
                    <SelectInputWithInsideLabel
                      label={
                        <Text fz={12}>
                          Transfer Type <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      data={[
                        { value: "BankTransfer", label: "BankTransfer" },
                        { value: "MobileMoney", label: "MobileMoney" },
                      ]}
                      mt={12}
                      {...modalForm.getInputProps("gshTransferType")}
                      styles={{ input: inputStyle }}
                    />
                    <SelectInputWithInsideLabel
                      searchable
                      data={ghsBankProviderOptions}
                      label={
                        modalForm.values.gshTransferType === "MobileMoney" ? (
                          <Text fz={12}>
                            Provider <span style={{ color: "red" }}>*</span>
                          </Text>
                        ) : (
                          <Text fz={12}>
                            Bank <span style={{ color: "red" }}>*</span>
                          </Text>
                        )
                      }
                      placeholder={
                        modalForm.values.gshTransferType === "MobileMoney"
                          ? "Select Provider"
                          : "Select Bank"
                      }
                      mt={12}
                      {...modalForm.getInputProps("bank")}
                      disabled={processing ?? (false || banksLoading)}
                      styles={{ input: inputStyle }}
                    />
                    {modalForm.values.gshTransferType === "MobileMoney" ? (
                      <Group grow gap={20} mt={12}>
                        <TextInputWithInsideLabel
                          label={
                            <Text fz={12}>
                              Phone Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter phone number (e.g. 233XXXXXXXXX)"
                          type="number"
                          {...modalForm.getInputProps("phoneNumber")}
                          styles={{ input: inputStyle }}
                        />
                      </Group>
                    ) : (
                      <Group grow gap={20} mt={12}>
                        <TextInputWithInsideLabel
                          label={
                            <Text fz={12}>
                              Account Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter account number"
                          type="number"
                          {...modalForm.getInputProps("accountNumber")}
                          styles={{ input: inputStyle }}
                        />
                      </Group>
                    )}
                  </>
                )}

                {!processing && validated && (
                  <Box
                    bg="#EAF7EA"
                    py={12}
                    px={20}
                    mt={20}
                    style={{ borderRadius: 8 }}
                  >
                    <Group justify="space-between">
                      <Text fz={14} fw={500} c="#1D2939">
                        Information Validated Successfully
                      </Text>
                      <ThemeIcon color="#12B76A" variant="light" radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    </Group>
                  </Box>
                )}

                {processing && (
                  <Box
                    bg="#F9F6E6"
                    py={12}
                    px={20}
                    mt={20}
                    style={{ borderRadius: 8 }}
                  >
                    <Group justify="space-between">
                      <Text fz={14} fw={500} c="#1D2939">
                        Verifying Account Details
                      </Text>

                      <Loader color="#D9C136" size={20} />
                    </Group>
                  </Box>
                )}

                {modalForm.values.currency !== "GHS" && (
                  <TextInputWithInsideLabel
                    label={
                      <Text fz={12}>
                        Bank <span style={{ color: "red" }}>*</span>
                      </Text>
                    }
                    placeholder="Bank"
                    mt={20}
                    {...modalForm.getInputProps("bank")}
                    disabled={processing ?? false}
                    styles={{ input: inputStyle }}
                  />
                )}

                <TextInputWithInsideLabel
                  label={
                    <Text fz={12}>
                      Bank Address <span style={{ color: "red" }}>*</span>
                    </Text>
                  }
                  placeholder="Enter bank address"
                  mt={20}
                  {...modalForm.getInputProps("bankAddress")}
                  disabled={processing ?? false}
                  styles={{ input: inputStyle }}
                />

                <Group grow gap={20} mt={20}>
                  <SelectInputWithInsideLabel
                    searchable
                    data={countries.map((c) => c?.name)}
                    label={
                      <Text fz={12}>
                        Country <span style={{ color: "red" }}>*</span>
                      </Text>
                    }
                    placeholder="Country"
                    {...modalForm.getInputProps("country")}
                    styles={{ input: inputStyle }}
                    disabled={processing ?? false}
                  />
                  <TextInputWithInsideLabel
                    label={
                      <Text fz={12}>
                        State <span style={{ color: "red" }}>*</span>
                      </Text>
                    }
                    placeholder="State"
                    {...modalForm.getInputProps("state")}
                    styles={{ input: inputStyle }}
                    disabled={processing ?? false}
                  />
                </Group>

                <PrimaryBtn
                  text="Save as beneficiary"
                  fw={600}
                  h={48}
                  fullWidth
                  mt={24}
                  action={handleSaveBeneficiary}
                  loading={loading}
                />
              </Box>
            </TabsPanel>
          </TabsComponent>
        </Modal>

        <ModalComponent
          opened={openedDelete}
          close={closeDelete}
          icon={<IconX color="#D92D20" />}
          color="#FEF3F2"
          title="Delete Beneficiary"
          text={
            selectedBeneficiary
              ? `You are deleting beneficiary ${selectedBeneficiary.alias} (${selectedBeneficiary.Currency?.symbol}). This action cannot be undone.`
              : "You are deleting this beneficiary. This action cannot be undone."
          }
          customApproveMessage="Yes, Delete"
          action={handleDeleteBeneficiary}
          processing={deleting}
          size={400}
          btnBg="#D92D20"
          btnColor="#fff"
        />

        <Modal
          opened={openedTransactionsPreview}
          onClose={closeTransactionsPreview}
          size={"35%"}
          centered
          withCloseButton={true}
          style={{ backgroundColor: "white" }}
        >
          <Flex
            w="100%"
            align="center"
            justify="center"
            direction="column"
            px={30}
          >
            <Text fz={18} fw={500} c="#000">
              Export Transactions
            </Text>

            <DatePickerInput
              placeholder="Select Date Range"
              valueFormat="YYYY-MM-DD"
              value={dateRange}
              onChange={(value: [Date | null, Date | null]) =>
                setDateRange(value)
              }
              size="xs"
              w="100%"
              h={44}
              styles={{ input: { height: "48px" } }}
              mt={12}
              type="range"
              allowSingleDateInRange
              leftSection={<IconCalendarMonth size={20} />}
              numberOfColumns={2}
              clearable
              disabled={loading}
            />

            <SelectBox
              placeholder="Select Document Type"
              data={["CSV"]}
              value={"CSV"}
              disabled
              onChange={(value) => setDocumentType(value!)}
              mt={16}
              size="xs"
              w="100%"
              h={44}
              styles={{ input: { height: "48px" } }}
            />

            <PrimaryBtn
              action={handleExportStatement}
              loading={loadingStatement}
              text="Submit"
              mt={22}
              ml="auto"
              mb={38}
              w="100%"
              h={44}
            />
          </Flex>
        </Modal>
      </main>
    </Box>
  );
};

export default function BeneficiariesSuspense() {
  return (
    <Suspense>
      <Beneficiaries />
    </Suspense>
  );
}
