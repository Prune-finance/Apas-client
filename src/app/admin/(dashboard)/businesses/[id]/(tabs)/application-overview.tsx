"use client";

import {
  Badge,
  Box,
  Grid,
  GridCol,
  Group,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck, IconCircleDashed } from "@tabler/icons-react";
import { BusinessDetail } from "@/lib/hooks/businesses";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "@mantine/form";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { DocumentViewCard } from "@/ui/section/onboarding/shared";

const questAxios = createAxiosInstance("questionnaire");

export interface ApplicationOverviewHandle {
  save(): Promise<void>;
  saving: boolean;
}

interface Props {
  detail: BusinessDetail;
  revalidate?: () => void;
  editing?: boolean;
  onEditingChange?: (v: boolean) => void;
}

const ApplicationOverview = forwardRef<ApplicationOverviewHandle, Props>(
  function ApplicationOverview({ detail, revalidate, editing = false }, ref) {
    const contact = detail.contactPerson;
    const biz = detail.business;
    const progress = detail.progress;
    const { handleSuccess, handleError } = useNotification();
    const [saving, setSaving] = useState(false);

    const bizForm = useForm({
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

    const contactForm = useForm({
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

    useImperativeHandle(ref, () => ({
      saving,
      async save() {
        if (!detail.reference) return;
        setSaving(true);
        try {
          await questAxios.patch(
            `/business/onboarding/admin/${detail.reference}/sections/1`,
            {
              businessName: bizForm.values.businessName,
              tradingName: bizForm.values.tradingName,
              businessIndustry: bizForm.values.businessIndustry,
              countryCode: bizForm.values.countryCode,
              businessAddress: bizForm.values.businessAddress,
              businessEmail: bizForm.values.businessEmail,
              businessWebsite: bizForm.values.businessWebsite,
              businessDescription: bizForm.values.businessDescription,
              contactPerson: {
                firstName: contactForm.values.firstName,
                lastName: contactForm.values.lastName,
                email: contactForm.values.email,
              },
            }
          );
          handleSuccess("Saved", "Application details updated");
          revalidate?.();
        } catch (error) {
          handleError("An error occurred", parseError(error));
          throw error;
        } finally {
          setSaving(false);
        }
      },
    }));

    return (
      <div className={styles.business__tab}>
        {/* Business Information */}
        <div className={styles.top__container}>
          <Text fz={12} fw={600} tt="uppercase" mb={20}>
            Business Information
          </Text>
          <Grid className={styles.grid__container}>
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly={!editing}
                classNames={{ input: styles.input, label: styles.label }}
                label="Business Name"
                {...bizForm.getInputProps("businessName")}
              />
            </GridCol>
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly={!editing}
                classNames={{ input: styles.input, label: styles.label }}
                label="Trading Name"
                {...bizForm.getInputProps("tradingName")}
              />
            </GridCol>
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly={!editing}
                classNames={{ input: styles.input, label: styles.label }}
                label="Industry"
                {...bizForm.getInputProps("businessIndustry")}
              />
            </GridCol>
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly={!editing}
                classNames={{ input: styles.input, label: styles.label }}
                label="Country"
                {...bizForm.getInputProps("countryCode")}
              />
            </GridCol>
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly={!editing}
                classNames={{ input: styles.input, label: styles.label }}
                label="Address"
                {...bizForm.getInputProps("businessAddress")}
              />
            </GridCol>
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly={!editing}
                classNames={{ input: styles.input, label: styles.label }}
                label="Email"
                {...bizForm.getInputProps("businessEmail")}
              />
            </GridCol>
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{ input: styles.input, label: styles.label }}
                label="Phone"
                {...bizForm.getInputProps("businessPhone")}
              />
            </GridCol>
            {(biz?.businessWebsite || editing) && (
              <GridCol span={4} className={styles.grid}>
                <TextInput
                  readOnly={!editing}
                  classNames={{ input: styles.input, label: styles.label }}
                  label="Website"
                  {...bizForm.getInputProps("businessWebsite")}
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
                {...bizForm.getInputProps("businessDescription")}
              />
            </GridCol>
          </Grid>
        </div>

        {/* Contact Person */}
        {contact && (
          <div className={styles.bottom__container}>
            <Text fz={12} fw={600} tt="uppercase" mb={20}>
              Contact Person
            </Text>
            <Grid className={styles.grid__container}>
              <GridCol span={4} className={styles.grid}>
                <TextInput
                  readOnly={!editing}
                  classNames={{ input: styles.input, label: styles.label }}
                  label="First Name"
                  {...contactForm.getInputProps("firstName")}
                />
              </GridCol>
              <GridCol span={4} className={styles.grid}>
                <TextInput
                  readOnly={!editing}
                  classNames={{ input: styles.input, label: styles.label }}
                  label="Last Name"
                  {...contactForm.getInputProps("lastName")}
                />
              </GridCol>
              <GridCol span={4} className={styles.grid}>
                <TextInput
                  readOnly={!editing}
                  classNames={{ input: styles.input, label: styles.label }}
                  label="Email"
                  {...contactForm.getInputProps("email")}
                />
              </GridCol>
              <GridCol span={4} className={styles.grid}>
                <TextInput
                  readOnly
                  classNames={{ input: styles.input, label: styles.label }}
                  label="Phone"
                  {...contactForm.getInputProps("phone")}
                />
              </GridCol>
              {contact.identityType && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Identity Type"
                    value={contact.identityType}
                  />
                </GridCol>
              )}
              {contact.proofOfAddressType && (
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

            {/* Document files */}
            {((contact as any).identityDocument || (contact as any).proofOfAddressDocument) && (
              <Box mt={16} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {(contact as any).identityDocument && (
                  <DocumentViewCard
                    label="Identity Document"
                    title={(contact as any).identityDocument.fileName || "Identity Document"}
                    fileId={(contact as any).identityDocument.id}
                    isAdmin
                  />
                )}
                {(contact as any).proofOfAddressDocument && (
                  <DocumentViewCard
                    label="Proof of Address"
                    title={(contact as any).proofOfAddressDocument.fileName || "Proof of Address"}
                    fileId={(contact as any).proofOfAddressDocument.id}
                    isAdmin
                  />
                )}
              </Box>
            )}
          </div>
        )}

        {/* Application Progress */}
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
                        color={
                          section.completed ? "var(--prune-success-500)" : "gray"
                        }
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
);

export default ApplicationOverview;
