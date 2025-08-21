import {
  Box,
  Checkbox,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import React, { useState } from "react";
import PaperContainer from "../PaperContainer";
import {
  PhoneNumberInput,
  ProfileDateInput,
  ProfileTextarea,
  ProfileTextInput,
} from "@/ui/components/InputWithLabel";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { PanelWrapper } from "./utils";
import { IconPencilMinus } from "@tabler/icons-react";
import { serviceCategories } from "@/lib/static";
import GBP from "@/assets/GB.png";
import USD from "@/assets/us.png";
import EUR from "@/assets/EU-icon.png";
import NGN from "@/assets/Nigeria.png";

import Skeleton from "../Skeleton";
import { UseFormReturnType } from "@mantine/form";
import { OnboardingType } from "@/lib/schema";
import { OnboardingBusiness } from "@/lib/interface";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
  revalidate?: () => Promise<void>;
}

export default function CompanyProfile({
  data,
  loading,
  form,
  revalidate,
}: ComponentProps) {
  const [rows, setRows] = useState([1]);

  const summaryData = {
    "Application submitted": data?.createdAt
      ? dayjs(data?.createdAt).format("DD-MM-YYYY")
      : "",
    "Submitted by": data?.consentSignedBy || "",
  };
  return (
    <PanelWrapper loading={loading} rows={rows} panelName="Company Profile">
      <Text tt="uppercase" fz={12} fw={600} c="var(--prune-text-gray-800)">
        Summary
      </Text>
      <Flex gap={16} align="center" mt={12}>
        {Object.entries(summaryData).map(([key, value]) => (
          <Stack key={key} gap={12}>
            <Text fz={12} fw={400} c="var(--prune-text-gray-600)" tt="none">
              {key}
            </Text>
            <Skeleton loading={loading} w={100}>
              <Text fz={14} fw={600} c="var(--prune-text-gray-800)">
                {value || "N/A"}
              </Text>
            </Skeleton>
          </Stack>
        ))}
      </Flex>

      <PaperContainer title="Basic information" mt={20}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <ProfileTextInput
            label="Business Name"
            {...form.getInputProps("businessName")}
            placeholder={data?.businessName || ""}
          />
          <ProfileTextInput
            label="Trading Name"
            {...form.getInputProps("businessTradingName")}
            placeholder={data?.businessTradingName || ""}
          />
          <ProfileTextInput
            label="Industry"
            {...form.getInputProps("businessIndustry")}
            placeholder={data?.businessIndustry || ""}
          />
          <ProfileTextInput
            label="Country"
            placeholder={data?.businessCountry || ""}
            {...form.getInputProps("businessCountry")}
          />
          <ProfileTextInput
            label="Address"
            placeholder={data?.businessAddress || ""}
            {...form.getInputProps("businessAddress")}
          />
          <ProfileTextInput
            label="Email"
            placeholder={data?.businessEmail || ""}
            {...form.getInputProps("businessEmail")}
          />
          <ProfileTextInput
            label="Phone Number"
            placeholder={data?.businessPhoneNumber || ""}
            {...form.getInputProps("businessPhoneNumber")}
          />
        </SimpleGrid>

        <ProfileTextarea
          mt={24}
          label="Business Description"
          placeholder={data?.businessDescription || ""}
          {...form.getInputProps("businessDescription")}
        />
      </PaperContainer>

      <ContactPerson data={data} form={form} revalidate={revalidate} />
      <CeoDetails data={data} form={form} />

      <Services data={data} />
    </PanelWrapper>
  );
}

const ContactPerson = ({
  data,
  form,
  revalidate,
}: Omit<ComponentProps, "loading">) => {
  const [editing, setEditing] = useState(false);
  const { handleSuccess } = useNotification();

  console.log(form.values);
  const { queryFn, loading } = useAxios({
    baseURL: "auth",
    endpoint: `/admin/onboardings/${data?.id}/update-contact-person`,
    method: "PATCH",
    body: {
      contactPersonFirstName: form.values.contactPersonFirstName,
      contactPersonLastName: form.values.contactPersonLastName,
      contactPersonEmail: form.values.contactPersonEmail,
      contactPersonPhoneNumber: form.values.contactPersonPhoneNumber,
      contactPersonPOAType: form.values.contactPersonPOAType,
      contactPersonPOAUrl: form.values.contactPersonPOAUrl,
      contactPersonIdType: form.values.contactPersonIdType,
      contactPersonIdUrl: form.values.contactPersonIdUrl,
      ...(form.values.contactPersonIdUrlBack
        ? { contactPersonIdUrlBack: form.values.contactPersonIdUrlBack }
        : {}),
    },
    onSuccess: () => {
      handleSuccess(
        "Contact Person Updated",
        "Contact Person updated successfully"
      );
      revalidate && revalidate();
      setEditing(false);
    },
  });

  const actionNode = (
    <Group gap={10}>
      <SecondaryBtn
        fz={12}
        fw={600}
        text={editing ? "Update" : "Edit"}
        action={() => (editing ? queryFn() : setEditing((prev) => !prev))}
        loading={loading}
        leftSection={<IconPencilMinus size={16} />}
      />
      <PrimaryBtn fw={600} fz={12} text="Send KYC Link" />
    </Group>
  );

  return (
    <PaperContainer
      title="Contact Person Information"
      actionNode={actionNode}
      mt={20}
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <ProfileTextInput
          label="First Name"
          placeholder={data?.contactPersonFirstName || ""}
          {...form.getInputProps("contactPersonFirstName")}
          editing={editing}
        />
        <ProfileTextInput
          label="Last Name"
          placeholder={data?.contactPersonLastName || ""}
          {...form.getInputProps("contactPersonLastName")}
          editing={editing}
        />
        <ProfileTextInput
          label="Email"
          placeholder={data?.contactPersonEmail || ""}
          {...form.getInputProps("contactPersonEmail")}
          editing={editing}
        />
        {editing ? (
          <PhoneNumberInput<OnboardingType>
            phoneNumberKey={"contactPersonPhoneNumber"}
            countryCodeKey="contactPersonPhoneNumberCode"
            form={form}
          />
        ) : (
          <ProfileTextInput
            label="Phone Number"
            placeholder={data?.contactPersonPhoneNumber || ""}
            {...form.getInputProps("contactPersonPhoneNumber")}
            editing={editing}
          />
        )}
        <DocumentPreview
          label="Identity Document"
          title={data?.contactPersonIdType || ""}
          value={data?.contactPersonIdUrl || ""}
          editing={editing}
          setValue={(value) => form.setFieldValue("contactPersonIdUrl", value)}
          type={form.values.contactPersonIdType}
          setType={(value) => form.setFieldValue("contactPersonIdType", value)}
        />
        {(data?.contactPersonIdUrlBack ||
          form.values.contactPersonIdType !== "Passport") && (
          <DocumentPreview
            label="Identity Document (Back)"
            title={data?.contactPersonIdType || ""}
            value={data?.contactPersonIdUrlBack || ""}
            editing={editing}
            setValue={(value) =>
              form.setFieldValue("contactPersonIdUrlBack", value)
            }
            type={form.values.contactPersonIdType}
            setType={(value) =>
              form.setFieldValue("contactPersonIdType", value)
            }
          />
        )}
        <DocumentPreview
          label="Proof of Address"
          title={data?.contactPersonPOAType || ""}
          value={data?.contactPersonPOAUrl || ""}
          editing={editing}
          setValue={(value) => form.setFieldValue("contactPersonPOAUrl", value)}
          type={form.values.contactPersonPOAType}
          setType={(value) => form.setFieldValue("contactPersonPOAType", value)}
        />
      </SimpleGrid>
    </PaperContainer>
  );
};

const CeoDetails = ({ data, form }: Omit<ComponentProps, "loading">) => {
  const [editing, setEditing] = useState(false);
  const actionNode = (
    <Group gap={10}>
      <SecondaryBtn
        fz={12}
        fw={600}
        text="Edit"
        action={() => setEditing((prev) => !prev)}
        leftSection={<IconPencilMinus size={16} />}
      />
      <PrimaryBtn fw={600} fz={12} text="Send KYC Link" />
    </Group>
  );

  return (
    <PaperContainer
      title="Ceo details"
      actionNode={actionNode}
      mt={20}
      display={data?.ceoFirstName || data?.ceoLastName ? "block" : "none"}
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <ProfileTextInput
          label="First Name"
          placeholder={data?.ceoFirstName || ""}
          {...form.getInputProps("ceoFirstName")}
          editing={editing}
        />
        <ProfileTextInput
          label="Last Name"
          placeholder={data?.ceoLastName || ""}
          {...form.getInputProps("ceoLastName")}
          editing={editing}
        />
        <ProfileTextInput
          label="Email"
          placeholder={data?.ceoEmail || ""}
          {...form.getInputProps("ceoEmail")}
          editing={editing}
        />
        {/* <ProfileTextInput
          label="Phone Number"
          placeholder={data?.ceoPhoneNumber || ""}
          {...form.getInputProps("ceoPhoneNumber")}
          editing={editing}
        /> */}
        <ProfileDateInput
          label="Date of Birth"
          placeholder={`${dayjs(data?.ceoDOB).format("DD-MM-YYYY")}`}
          editing={editing}
          {...form.getInputProps("ceoDOB")}
          valueFormat="DD-MM-YYYY"
        />
        <DocumentPreview
          label="Identity Document"
          title={data?.ceoIdType || ""}
          value={data?.ceoIdUrl || ""}
        />

        {data?.ceoIdUrlBack && (
          <DocumentPreview
            label="Identity Document"
            title={data?.ceoIdType || ""}
            value={data?.ceoIdUrlBack || ""}
          />
        )}
        <DocumentPreview
          label="Proof of Address"
          title={data?.ceoPOAType || ""}
          value={data?.ceoPOAUrl || ""}
        />
      </SimpleGrid>
    </PaperContainer>
  );
};

const Services = ({ data }: Omit<ComponentProps, "loading" | "form">) => {
  return (
    <PaperContainer
      title="Services"
      mt={20}
      display={
        Array.isArray(data?.services) &&
        (data.services.length === 0 ||
          (data.services.length === 1 &&
            Object.keys(data.services[0]).length === 0))
          ? "none"
          : undefined
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={24}>
        {serviceCategories.map((service, idx) => (
          <Stack key={idx}>
            <Checkbox
              label={service.title}
              checked={Boolean(
                data?.services.find((s) => s.name === service.title)
              )}
              onChange={() => {}}
              color="var(--prune-primary-500)"
              iconColor="var(--prune-text-gray-700)"
            />
            <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
              Account Type:
            </Text>

            <Stack>
              {service.accounts.map((currency, idx) => (
                <Group
                  key={idx}
                  gap={8}
                  style={{
                    opacity: data?.services
                      .find((s) => s.name === service.title)
                      ?.currencies.some(
                        (c) => c.includes(currency) || currency.includes(c)
                      )
                      ? 1
                      : 0.5,
                  }}
                >
                  <Image
                    src={
                      CurrencyIcon[currency as keyof typeof CurrencyIcon].src
                    }
                    w={16}
                    h={16}
                    alt={currency}
                  />
                  <Text fz={14} fw={500} c="var(--prune-text-gray-500)">
                    {currency}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Stack>
        ))}
      </SimpleGrid>
    </PaperContainer>
  );
};

const CurrencyIcon = {
  GBP,
  USD,
  EUR,
  NGN,
};
