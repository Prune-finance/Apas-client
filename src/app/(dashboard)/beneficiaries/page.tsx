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
} from "@mantine/core";
import React, { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";

import styles from "./styles.module.scss";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  IconAlignCenter,
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
import {
  TextInputWithInsideLabel,
  SelectInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { beneficiaryModalValidate } from "@/lib/schema/debit-request";
import { IconCheck } from "@tabler/icons-react";

import EUIcon from "@/assets/EU-icon.png";
import GBIcon from "@/assets/GB.png";
import USIcon from "@/assets/USD.png";
import NGIcon from "@/assets/Nigeria.png";
import GHIcon from "@/assets/GH.png";
import CurrencyTab from "@/ui/components/CurrencyTab";
import useCurrencySwitchStore from "@/lib/store/currency-switch";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import {
  useBeneficiaryAccount,
  validateAccount,
  validateAccountGBP,
} from "@/lib/hooks/accounts";

type Beneficiary = {
  name: string;
  email: string;
  category: string;
  bank: string;
  accountNumber: string;
  currency: "EUR" | "GBP" | "USD" | "NGN" | "CAD" | "GHS";
};

const sampleBeneficiaries: Beneficiary[] = [
  {
    name: "John Smith",
    email: "john@example.com",
    category: "Vendors",
    bank: "Chase Bank",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
  {
    name: "Lukaku Tobi",
    email: "Lukaku@example.com",
    category: "Payroll",
    bank: "Bank of America",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
  {
    name: "Ebenezer Jude",
    email: "Jude@example.com",
    category: "Vendors",
    bank: "Wellsfargo",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
  {
    name: "C80 Limited",
    email: "C80@example.com",
    category: "Partner",
    bank: "Chase Bank",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
];

const tableHeaders = [
  "Name",
  "Category",
  "Bank",
  "Account Number",
  "Currency",
  "Action",
];

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
  const axios = createAxiosInstance("accounts");
  const [currency, setCurrency] = useState<string>(currencyTabs[0].value);
  const [opened, { open, close }] = useDisclosure(false);
  const { switchCurrency } = useCurrencySwitchStore();
  const [beneficiaryType, setBeneficiaryType] = useState<string>("Individual");
  const { handleError, handleSuccess } = useNotification();
  const modalForm = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
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
    console.log(payload);
    try {
      const { data: res } = await axios.post(
        "/accounts/beneficiaries",
        payload
      );
      console.log(res);
      handleSuccess(
        "Beneficiary successfully",
        "Beneficiary added successfully"
      );
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  React.useEffect(() => {
    modalForm.setFieldValue(
      "currency",
      switchCurrency || currencyTabs[0].value
    );
  }, [switchCurrency]);

  const buildBeneficiaryPayload = (v: typeof modalForm.values) => {
    const base = {
      alias: `${v.firstName} ${v.lastName}`,
      firstName: v.firstName,
      lastName: v.lastName,
      currency: v.currency,
      isFavorite: false,
      accountHolderAddress: v.bankAddress,
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
          countryCode: "GH",
        };
      return {
        ...base,
        bankName: v.bank,
        accountNumber: removeWhitespace(v.accountNumber),
        countryCode: "GH",
      };
    }

    return base;
  };
  const [processing, setProcessing] = useState(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [validated, setValidated] = useState<boolean | null>(null);

  const {
    beneficiaryAccount,
    loading: beneficiaryAccountLoading,
    revalidate: beneficiaryAccountRevalidate,
  } = useBeneficiaryAccount();

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const filteredByCurrency = useMemo(
    () => sampleBeneficiaries.filter((b) => b.currency === currency),
    [currency]
  );

  const searched = useMemo(() => {
    if (!debouncedSearch) return filteredByCurrency;
    const lower = debouncedSearch.toLowerCase();
    return filteredByCurrency.filter(
      (b) =>
        b.name.toLowerCase().includes(lower) ||
        b.email.toLowerCase().includes(lower) ||
        b.bank.toLowerCase().includes(lower) ||
        b.accountNumber.toLowerCase().includes(lower) ||
        b.category.toLowerCase().includes(lower)
    );
  }, [filteredByCurrency, debouncedSearch]);

  const rows = useMemo(
    () =>
      frontendPagination(searched, active, parseInt(limit ?? "10", 10)).map(
        (element, index) => (
          <TableTr key={`${element.email}-${index}`}>
            <TableTd>
              <Stack gap={0}>
                <Text fz={12} fw={500}>
                  {element.name}
                </Text>
                <Text fz={10} fw={400} c="#667085">
                  {element.email}
                </Text>
              </Stack>
            </TableTd>
            <TableTd>{element.category}</TableTd>
            <TableTd>{element.bank}</TableTd>
            <TableTd>{element.accountNumber}</TableTd>
            <TableTd>
              <Group gap={6}>
                {element.currency === "EUR" && (
                  <Image width={18} height={18} src={EUIcon} alt="eur" />
                )}
                {element.currency === "GBP" && (
                  <Image width={18} height={18} src={GBIcon} alt="gbp" />
                )}
                {element.currency === "USD" && (
                  <Image width={18} height={18} src={USIcon} alt="usd" />
                )}
                {element.currency === "NGN" && (
                  <Image width={18} height={18} src={NGIcon} alt="ngn" />
                )}
                {element.currency === "GHS" && (
                  <Image width={18} height={18} src={GHIcon} alt="ghs" />
                )}
                <Text fz={12} fw={500}>
                  {element.currency}
                </Text>
              </Group>
            </TableTd>
            <TableTd>
              <Group gap={10}>
                <UnstyledButton>
                  <ThemeIcon color="#EEF2F6" radius="md">
                    <IconPencil size={14} color="#475467" />
                  </ThemeIcon>
                </UnstyledButton>
                <UnstyledButton>
                  <ThemeIcon color="#FEF3F2" radius="md">
                    <IconTrash size={14} color="#D92D20" />
                  </ThemeIcon>
                </UnstyledButton>
              </Group>
            </TableTd>
          </TableTr>
        )
      ),
    [searched, active, limit]
  );

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
            tabs={currencyTabs}
            styles={{ list: { marginTop: 24 } }}
            defaultValue={currency}
            onChange={(v) => setCurrency(v || "EUR")}
          >
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
                  <SecondaryBtn
                    text="Filter"
                    icon={IconAlignCenter}
                    action={toggle}
                    fw={600}
                  />
                  <SecondaryBtn text="Export Beneficiary" fw={600} />
                </Group>
              </Group>

              <TableComponent
                head={tableHeaders}
                rows={rows}
                loading={false}
                mt={24}
              />

              <EmptyTable
                rows={searched}
                loading={false}
                title="There are no beneficiaries"
                text="When a beneficiary is created, it will appear here."
              />

              <PaginationComponent
                total={calculateTotalPages(limit, searched.length)}
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
          onClose={close}
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
            tabs={[{ value: "Individual" }, { value: "Business" }]}
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
                      label="First Name"
                      placeholder="First Name"
                      {...modalForm.getInputProps("firstName")}
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label="Last Name"
                      placeholder="Last Name"
                      {...modalForm.getInputProps("lastName")}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {beneficiaryType === "Business" && (
                  <Group grow gap={20} mt={12}>
                    <TextInputWithInsideLabel
                      label="Company Name"
                      placeholder="Company Name"
                      {...modalForm.getInputProps("firstName")}
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label="Contact Email"
                      placeholder="Email"
                      {...modalForm.getInputProps("lastName")}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {modalForm.values.currency === "EUR" && (
                  <Group grow gap={20} mt={20}>
                    <TextInputWithInsideLabel
                      label="IBAN"
                      placeholder="Enter IBAN"
                      {...modalForm.getInputProps("iban")}
                      bg="#fff"
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label="BIC"
                      placeholder="Enter BIC"
                      {...modalForm.getInputProps("bic")}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {modalForm.values.currency === "GBP" && (
                  <Group grow gap={20} mt={20}>
                    <TextInputWithInsideLabel
                      label="Account Number"
                      placeholder="Enter account number"
                      type="number"
                      {...modalForm.getInputProps("accountNumber")}
                      styles={{ input: inputStyle }}
                    />
                    <TextInputWithInsideLabel
                      label="Sort Code"
                      placeholder="Enter sort code"
                      type="number"
                      {...modalForm.getInputProps("sortCode")}
                      styles={{ input: inputStyle }}
                    />
                  </Group>
                )}

                {modalForm.values.currency === "USD" && (
                  <>
                    <SelectInputWithInsideLabel
                      label="Transfer Type"
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
                          label="IBAN"
                          placeholder="Enter IBAN"
                          {...modalForm.getInputProps("iban")}
                          styles={{ input: inputStyle }}
                        />
                        <TextInputWithInsideLabel
                          label="SWIFT/BIC"
                          placeholder="Enter SWIFT/BIC"
                          {...modalForm.getInputProps("bic")}
                          styles={{ input: inputStyle }}
                        />
                      </Group>
                    ) : (
                      <Group grow gap={20} mt={12}>
                        <TextInputWithInsideLabel
                          label="Routing Number (ABA)"
                          placeholder="Enter routing number"
                          type="number"
                          {...modalForm.getInputProps("routingNumber")}
                          styles={{ input: inputStyle }}
                        />
                        <TextInputWithInsideLabel
                          label="Account Number"
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
                      label="Transfer Type"
                      data={[
                        { value: "BankTransfer", label: "BankTransfer" },
                        { value: "MobileMoney", label: "MobileMoney" },
                      ]}
                      mt={12}
                      {...modalForm.getInputProps("gshTransferType")}
                      styles={{ input: inputStyle }}
                    />
                    {modalForm.values.gshTransferType === "MobileMoney" ? (
                      <Group grow gap={20} mt={12}>
                        <TextInputWithInsideLabel
                          label="Phone Number"
                          placeholder="Enter phone number"
                          type="number"
                          {...modalForm.getInputProps("phoneNumber")}
                          styles={{ input: inputStyle }}
                        />
                      </Group>
                    ) : (
                      <Group grow gap={20} mt={12}>
                        <TextInputWithInsideLabel
                          label="Account Number"
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

                <TextInputWithInsideLabel
                  label={
                    modalForm.values.currency === "GHS" &&
                    modalForm.values.gshTransferType === "MobileMoney"
                      ? "Provider"
                      : "Bank"
                  }
                  placeholder={
                    modalForm.values.currency === "GHS" &&
                    modalForm.values.gshTransferType === "MobileMoney"
                      ? "Provider"
                      : "Bank"
                  }
                  mt={20}
                  {...modalForm.getInputProps("bank")}
                  styles={{ input: inputStyle }}
                />

                <TextInputWithInsideLabel
                  label="Bank Address"
                  placeholder="Enter bank address"
                  mt={20}
                  {...modalForm.getInputProps("bankAddress")}
                  styles={{ input: inputStyle }}
                />

                <Group grow gap={20} mt={20}>
                  <TextInputWithInsideLabel
                    label="Country"
                    placeholder="Country"
                    {...modalForm.getInputProps("country")}
                    styles={{ input: inputStyle }}
                  />
                  <TextInputWithInsideLabel
                    label="State"
                    placeholder="State"
                    {...modalForm.getInputProps("state")}
                    styles={{ input: inputStyle }}
                  />
                </Group>

                <PrimaryBtn
                  text="Save as beneficiary"
                  fw={600}
                  h={48}
                  fullWidth
                  mt={24}
                  action={handleSaveBeneficiary}
                />
              </Box>
            </TabsPanel>
          </TabsComponent>
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
