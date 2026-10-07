"use client";

import {
  Badge,
  Box,
  Flex,
  Grid,
  GridCol,
  Group,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck, IconCircleDashed, IconPencilMinus } from "@tabler/icons-react";
import { BusinessDetail } from "@/lib/hooks/businesses";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

const questAxios = createAxiosInstance("questionnaire");

interface Props {
  detail: BusinessDetail;
  revalidate?: () => void;
  editing?: boolean;
  onEditingChange?: (v: boolean) => void;
}

export default function ApplicationOverview({ detail, revalidate, editing = false, onEditingChange }: Props) {
  const contact = detail.contactPerson;
  const progress = detail.progress;

  return (
    <div className={styles.business__tab}>
      <BusinessInfoSection detail={detail} revalidate={revalidate} externalEditing={editing} onEditingChange={onEditingChange} />
      {contact && <ContactPersonSection detail={detail} revalidate={revalidate} />}
      {progress && (
        <div className={styles.bottom__container}>
          <Group justify="space-between" mb={16}>
            <Text fz={12} fw={600} tt="uppercase">
              Application Progress
            </Text>
            <Badge
              variant="light"
              color={progress.isComplete ? "green" : "yellow"}
              fz={11}
            >
              {progress.isComplete
                ? "Complete"
                : `${progress.lastCompletedSection} of ${progress.sections.length} sections`}
            </Badge>
          </Group>
          <Box style={{ overflowX: "auto" }}>
            <Group gap={0} wrap="nowrap" align="flex-start">
              {progress.sections.map((section, i) => (
                <Box
                  key={section.number}
                  style={{ flex: 1, minWidth: 120, position: "relative" }}
                >
                  <Group gap={0} align="center" wrap="nowrap">
                    <Box
                      style={{
                        flex: 1,
                        height: 2,
                        background:
                          i === 0
                            ? "transparent"
                            : progress.sections[i - 1].completed
                            ? "var(--prune-success-500)"
                            : "var(--mantine-color-gray-3)",
                      }}
                    />
                    <ThemeIcon
                      size={28}
                      radius="xl"
                      color={section.completed ? "var(--prune-success-500)" : "gray"}
                      variant={section.completed ? "filled" : "light"}
                      style={{ flexShrink: 0 }}
                    >
                      {section.completed ? (
                        <IconCheck size={14} />
                      ) : (
                        <IconCircleDashed size={14} />
                      )}
                    </ThemeIcon>
                    <Box
                      style={{
                        flex: 1,
                        height: 2,
                        background:
                          i === progress.sections.length - 1
                            ? "transparent"
                            : section.completed
                            ? "var(--prune-success-500)"
                            : "var(--mantine-color-gray-3)",
                      }}
                    />
                  </Group>
                  <Text
                    fz={12}
                    fw={section.completed ? 600 : 400}
                    c={section.completed ? "inherit" : "dimmed"}
                    mt={8}
                    ta="center"
                  >
                    {section.title}
                  </Text>
                </Box>
              ))}
            </Group>
          </Box>
        </div>
      )}
    </div>
  );
}

function BusinessInfoSection({
  detail,
  revalidate,
  externalEditing = false,
  onEditingChange,
}: {
  detail: BusinessDetail;
  revalidate?: () => void;
  externalEditing?: boolean;
  onEditingChange?: (v: boolean) => void;
}) {
  const biz = detail.business;
  const [editing, setEditing] = useState(externalEditing);

  const setEdit = (v: boolean) => {
    setEditing(v);
    onEditingChange?.(v);
  };
  const [processing, setProcessing] = useState(false);
  const { handleSuccess, handleError } = useNotification();

  const form = useForm({
    initialValues: {
      businessName: biz?.businessName ?? "",
      tradingName: biz?.tradingName ?? "",
      businessIndustry: biz?.businessIndustry ?? "",
      countryCode: biz?.countryCode ?? "",
      businessAddress: biz?.businessAddress ?? "",
      businessEmail: biz?.businessEmail ?? "",
      businessPhone: biz
        ? `${biz.businessPhoneCountryCode} ${biz.businessPhoneNumber}`
        : "",
      businessWebsite: biz?.businessWebsite ?? "",
      businessDescription: biz?.businessDescription ?? "",
    },
  });

  const handleSave = async () => {
    if (!detail.reference) return;
    setProcessing(true);
    try {
      await questAxios.patch(
        `/business/onboarding/admin/${detail.reference}/sections/1`,
        {
          businessName: form.values.businessName,
          tradingName: form.values.tradingName,
          businessIndustry: form.values.businessIndustry,
          countryCode: form.values.countryCode,
          businessAddress: form.values.businessAddress,
          businessEmail: form.values.businessEmail,
          businessWebsite: form.values.businessWebsite,
          businessDescription: form.values.businessDescription,
        }
      );
      handleSuccess("Business Updated", "Business information saved");
      setEdit(false);
      revalidate?.();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.top__container}>
      <Flex justify="space-between" align="center">
        <Text fz={12} fw={600} tt="uppercase">
          Business Information
        </Text>
        {!editing ? (
          <SecondaryBtn
            text="Edit"
            icon={IconPencilMinus}
            action={() => setEdit(true)}
          />
        ) : (
          <Group>
            <SecondaryBtn
              text="Cancel"
              action={() => {
                form.reset();
                setEdit(false);
              }}
              fz={10}
              fw={600}
            />
            <PrimaryBtn
              fz={10}
              fw={600}
              text="Save Changes"
              action={handleSave}
              loading={processing}
            />
          </Group>
        )}
      </Flex>

      <Grid mt={20} className={styles.grid__container}>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Business Name"
            {...form.getInputProps("businessName")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Trading Name"
            {...form.getInputProps("tradingName")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Industry"
            {...form.getInputProps("businessIndustry")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Country"
            {...form.getInputProps("countryCode")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Address"
            {...form.getInputProps("businessAddress")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Email"
            {...form.getInputProps("businessEmail")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly
            classNames={{ input: styles.input, label: styles.label }}
            label="Phone"
            {...form.getInputProps("businessPhone")}
          />
        </GridCol>
        {(biz?.businessWebsite || editing) && (
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editing}
              classNames={{ input: styles.input, label: styles.label }}
              label="Website"
              {...form.getInputProps("businessWebsite")}
            />
          </GridCol>
        )}
        <GridCol span={8} className={styles.grid}>
          <Textarea
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Business Description"
            minRows={3}
            autosize
            {...form.getInputProps("businessDescription")}
          />
        </GridCol>
      </Grid>
    </div>
  );
}

function ContactPersonSection({
  detail,
  revalidate,
}: {
  detail: BusinessDetail;
  revalidate?: () => void;
}) {
  const contact = detail.contactPerson;
  const [editing, setEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { handleSuccess, handleError } = useNotification();

  const form = useForm({
    initialValues: {
      firstName: contact?.firstName ?? "",
      lastName: contact?.lastName ?? "",
      email: contact?.email ?? "",
      phone: contact
        ? `${contact.phoneCountryCode} ${contact.phoneNumber}`
        : "",
      identityType: contact?.identityType ?? "",
      proofOfAddressType: contact?.proofOfAddressType ?? "",
    },
  });

  const handleSave = async () => {
    if (!detail.reference) return;
    setProcessing(true);
    try {
      await questAxios.patch(
        `/business/onboarding/admin/${detail.reference}/sections/1`,
        {
          contactPerson: {
            firstName: form.values.firstName,
            lastName: form.values.lastName,
            email: form.values.email,
          },
        }
      );
      handleSuccess("Contact Updated", "Contact person information saved");
      setEditing(false);
      revalidate?.();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.bottom__container}>
      <Flex justify="space-between" align="center">
        <Text fz={12} fw={600} tt="uppercase">
          Contact Person
        </Text>
        {!editing ? (
          <SecondaryBtn
            text="Edit"
            icon={IconPencilMinus}
            action={() => setEditing(true)}
          />
        ) : (
          <Group>
            <SecondaryBtn
              text="Cancel"
              action={() => {
                form.reset();
                setEditing(false);
              }}
              fz={10}
              fw={600}
            />
            <PrimaryBtn
              fz={10}
              fw={600}
              text="Save Changes"
              action={handleSave}
              loading={processing}
            />
          </Group>
        )}
      </Flex>

      <Grid mt={20} className={styles.grid__container}>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="First Name"
            {...form.getInputProps("firstName")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Last Name"
            {...form.getInputProps("lastName")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{ input: styles.input, label: styles.label }}
            label="Email"
            {...form.getInputProps("email")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly
            classNames={{ input: styles.input, label: styles.label }}
            label="Phone"
            {...form.getInputProps("phone")}
          />
        </GridCol>
        {contact?.identityType && (
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{ input: styles.input, label: styles.label }}
              label="Identity Type"
              value={contact.identityType}
            />
          </GridCol>
        )}
        {contact?.proofOfAddressType && (
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{ input: styles.input, label: styles.label }}
              label="Proof of Address"
              value={contact.proofOfAddressType}
            />
          </GridCol>
        )}
      </Grid>
    </div>
  );
}
