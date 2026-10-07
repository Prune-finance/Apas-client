"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconHandStop, IconX } from "@tabler/icons-react";
import { Divider, Flex, Paper, Stepper, Text, Tooltip } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import { BackBtn, SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";
import SuccessModal from "@/ui/components/SuccessModal";
import SuccessModalImage from "@/assets/success-modal-image.png";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import useAxios from "@/lib/hooks/useAxios";

import {
  CEOSchema,
  newOnboardingValue,
  onboardingBasicInfoSchema,
  onboardingDirectors,
  onboardingDocumentSchema,
  onboardingShareholders,
  OnboardingType,
} from "@/lib/schema";

import {
  BusinessInfo,
  CEOInfo,
  DocumentInfo,
  AddDirectorsInfo,
  AddShareholdersInfo,
  TermsOfUseInfo,
  ReferenceData,
  DEFAULT_REF_DATA,
} from "@/ui/section/onboarding/shared";

const questAxios = createAxiosInstance("questionnaire");

const STEP_LABELS = [
  "Business Information",
  "CEO Details",
  "Documents",
  "Directors",
  "Shareholders",
];

export default function NewBusiness() {
  const router = useRouter();
  const { handleError, handleSuccess } = useNotification();

  const [active, setActive] = useState(0);
  const [adminReference, setAdminReference] = useState<string | null>(null);
  const [refData, setRefData] = useState<ReferenceData>(DEFAULT_REF_DATA);

  const [opened, { open, close }] = useDisclosure(false);
  const [openedHandOver, { open: openHandOver, close: closeHandOver }] =
    useDisclosure(false);
  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  const form = useForm<OnboardingType>({
    initialValues: newOnboardingValue,
    validate: (values) => {
      if (active === 0) return zodResolver(onboardingBasicInfoSchema)(values);
      if (active === 1) return zodResolver(CEOSchema)(values);
      if (active === 2) return zodResolver(onboardingDocumentSchema)(values);
      if (active === 3) return zodResolver(onboardingDirectors)(values);
      if (active === 4) return zodResolver(onboardingShareholders)(values);
      return {};
    },
  });

  useAxios<ReferenceData>({
    baseURL: "questionnaire",
    endpoint: "/business/onboarding/reference-data",
    method: "GET",
    dependencies: [],
    onSuccess: (data) => setRefData(data),
  });

  const handleCloseSuccessModal = () => {
    router.push("/admin/businesses");
    closeSuccess();
  };

  const handleHandOver = async () => {
    if (!adminReference) return;
    try {
      await questAxios.post(
        `/business/onboarding/admin/${adminReference}/hand-over`
      );
      handleSuccess("Application Handed Over", "The application has been handed over to the user");
      closeHandOver();
      router.push("/admin/businesses");
    } catch (error) {
      handleError("Hand Over Failed", parseError(error));
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },
          { title: "Create New Business", href: "/admin/businesses/new" },
        ]}
      />

      <Paper py={32} px={28} mt={20}>
        <Flex align="center" justify="space-between">
          <BackBtn />
          <Tooltip
            label={
              adminReference
                ? "Hand over to user to complete"
                : "Save section 1 first to enable hand over"
            }
            withArrow
            position="left"
          >
            <span>
              <SecondaryBtn
                text="Hand Over"
                leftSection={<IconHandStop size={16} />}
                fw={600}
                disabled={!adminReference}
                action={openHandOver}
              />
            </span>
          </Tooltip>
        </Flex>

        <Text
          fz={24}
          fw={600}
          c="var(--prune-text-gray-700)"
          mt={28}
          style={{ fontFamily: "'EksellDisplay', serif" }}
        >
          Create New Business
        </Text>

        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          color="var(--prune-primary-700)"
          classNames={{
            stepWrapper: styles.stepWrapper,
            stepLabel: styles.stepLabel,
            stepBody: styles.stepBody,
            steps: styles.steps,
            separator: styles.separator,
            stepIcon: styles.stepIcon,
            step: styles.step,
          }}
          mt={32}
        >
          {STEP_LABELS.map((label) => (
            <Stepper.Step key={label} label={label} />
          ))}
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Divider my={20} />

        {active === 0 && (
          <BusinessInfo
            form={form}
            active={active}
            setActive={setActive}
            refData={refData}
            adminReference={adminReference ?? undefined}
            onReferenceObtained={(ref) => setAdminReference(ref)}
            noFloatingLabel
          />
        )}
        {active === 1 && (
          <CEOInfo
            form={form}
            active={active}
            setActive={setActive}
            refData={refData}
            adminReference={adminReference ?? undefined}
            noFloatingLabel
          />
        )}
        {active === 2 && (
          <DocumentInfo
            form={form}
            active={active}
            setActive={setActive}
            refData={refData}
            adminReference={adminReference ?? undefined}
          />
        )}
        {active === 3 && (
          <AddDirectorsInfo
            form={form}
            active={active}
            setActive={setActive}
            refData={refData}
            adminReference={adminReference ?? undefined}
            noFloatingLabel
          />
        )}
        {active === 4 && (
          <AddShareholdersInfo
            form={form}
            active={active}
            setActive={setActive}
            shareholders={form.values.shareholders}
            refData={refData}
            adminReference={adminReference ?? undefined}
            noFloatingLabel
          />
        )}
        {active === 5 && (
          <TermsOfUseInfo
            form={form}
            active={active}
            setActive={(next) => {
              const n = typeof next === "function" ? next(active) : next;
              setActive(n);
              if (n > 5) openSuccess();
            }}
            adminReference={adminReference ?? undefined}
          />
        )}
      </Paper>

      {/* Clear form modal */}
      <ModalComponent
        opened={opened}
        close={close}
        icon={<IconX color="var(--prune-warning)" />}
        title="Clear Form?"
        text="Are you sure you want to clear this form? All entered data will be permanently lost."
        action={() => {
          form.reset();
          close();
        }}
        color="hsl(from var(--prune-warning) h s l / .1)"
      />

      {/* Hand over confirmation modal */}
      <ModalComponent
        opened={openedHandOver}
        close={closeHandOver}
        icon={<IconHandStop color="var(--prune-primary-700)" />}
        title="Hand Over Application?"
        text="Are you sure you want to hand over this application to the user to complete? You will no longer be able to edit it."
        action={handleHandOver}
        color="hsl(from var(--prune-primary-700) h s l / .1)"
      />

      <SuccessModal
        openedSuccess={openedSuccess}
        handleCloseSuccessModal={handleCloseSuccessModal}
        image={SuccessModalImage.src}
      />
    </main>
  );
}
