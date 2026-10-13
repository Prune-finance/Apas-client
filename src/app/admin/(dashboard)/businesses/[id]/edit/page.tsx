"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconHandStop } from "@tabler/icons-react";
import { Center, Divider, Flex, Loader, Paper, Stepper, Text, Tooltip } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "../../new/styles.module.scss";
import { BackBtn, SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";
import SuccessModal from "@/ui/components/SuccessModal";
import SuccessModalImage from "@/assets/success-modal-image.png";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import useAxios from "@/lib/hooks/useAxios";
import { useBusinessDetail } from "@/lib/hooks/businesses";
import type { BusinessDetail } from "@/lib/hooks/businesses";

import {
  CEOSchema,
  newOnboardingValue,
  onboardingBasicInfoSchema,
  onboardingDirectors,
  onboardingDocumentSchema,
  onboardingShareholders,
  OnboardingType,
  OnboardingDirectorValues,
  OnboardingShareholderValues,
} from "@/lib/schema";

import {
  BusinessInfo,
  CEOInfo,
  DocumentInfo,
  AddDirectorsInfo,
  AddShareholdersInfo,
  ReviewInfo,
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
  "Review",
];

function buildInitialValues(detail: BusinessDetail): OnboardingType {
  const biz = detail.business;
  const contact = detail.contactPerson;
  const ceo = detail.ceo as Record<string, any> | null | undefined;
  const docs = detail.documents;

  return {
    businessName: biz?.businessName ?? "",
    businessTradingName: biz?.tradingName ?? "",
    businessWebsite: biz?.businessWebsite ?? "",
    businessCountry: biz?.countryCode ?? null,
    businessType: (biz as any)?.businessType ?? null,
    businessIndustry: biz?.businessIndustry ?? null,
    businessPhoneNumber: biz?.businessPhoneNumber ?? "+234",
    businessPhoneNumberCode: biz?.businessPhoneCountryCode ?? "+234",
    businessEmail: biz?.businessEmail ?? "",
    businessDescription: biz?.businessDescription ?? "",
    businessAddress: biz?.businessAddress ?? "",
    makeContactPersonInitiator: (biz as any)?.contactIsInitiator ?? false,

    contactPersonFirstName: contact?.firstName ?? "",
    contactPersonLastName: contact?.lastName ?? "",
    contactPersonEmail: contact?.email ?? "",
    contactPersonPhoneNumberCode: contact?.phoneCountryCode ?? "+234",
    contactPersonPhoneNumber: contact?.phoneNumber ?? "+234",
    contactPersonIdType: contact?.identityType ?? "",
    contactPersonPOAType: contact?.proofOfAddressType ?? "",
    contactPersonIdUrl: (contact?.identityDocument as any) ?? "",
    contactPersonIdUrlBack: "",
    contactPersonPOAUrl: (contact?.proofOfAddressDocument as any) ?? "",

    ceoFirstName: ceo?.firstName ?? "",
    ceoLastName: ceo?.lastName ?? "",
    ceoEmail: ceo?.email ?? "",
    ceoDOB: ceo?.dateOfBirth ? new Date(ceo.dateOfBirth as string) : null,
    ceoIdType: ceo?.identityType ?? "",
    ceoIdUrl: (ceo?.identityDocument as any)?.id ?? "",
    ceoIdUrlBack: (ceo?.identityDocumentBack as any)?.id ?? "",
    ceoPOAUrl: (ceo?.proofOfAddressDocument as any)?.id ?? "",
    ceoPOAType: ceo?.proofOfAddressType ?? "",

    cacCertificate: docs?.incorporationCertificate ?? "",
    mermat: docs?.memart ?? "",
    amlCompliance: docs?.amlFramework ?? "",
    operationalLicense: docs?.operationalLicence ?? null,

    directors: (detail.directors as any[])?.length
      ? (detail.directors as any[]).map((d) => ({
          id: d.id ?? crypto.randomUUID(),
          first_name: d.firstName ?? "",
          last_name: d.lastName ?? "",
          email: d.email ?? "",
          date_of_birth: d.dateOfBirth ? new Date(d.dateOfBirth) : null,
          identityType: d.identityType ?? null,
          proofOfAddress: d.proofOfAddressType ?? null,
          identityFileUrl: d.identityDocument?.id ?? null,
          identityFileUrlBack: d.identityDocumentBack?.id ?? null,
          proofOfAddressFileUrl: d.proofOfAddressDocument?.id ?? null,
        }))
      : [OnboardingDirectorValues],

    shareholders: (detail.shareholders as any[])?.length
      ? (detail.shareholders as any[]).map((s) => ({
          id: s.id ?? crypto.randomUUID(),
          first_name: s.firstName ?? "",
          last_name: s.lastName ?? "",
          email: s.email ?? "",
          date_of_birth: s.dateOfBirth ? new Date(s.dateOfBirth) : null,
          identityType: s.identityType ?? null,
          proofOfAddress: s.proofOfAddressType ?? null,
          identityFileUrl: s.identityDocument?.id ?? null,
          identityFileUrlBack: s.identityDocumentBack?.id ?? null,
          proofOfAddressFileUrl: s.proofOfAddressDocument?.id ?? null,
        }))
      : [OnboardingShareholderValues],
  };
}

export default function EditBusiness() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { handleError, handleSuccess } = useNotification();

  const { loading, business: detail } = useBusinessDetail(params.id);

  const [active, setActive] = useState(0);
  const [adminReference, setAdminReference] = useState<string | null>(null);
  const [refData, setRefData] = useState<ReferenceData>(DEFAULT_REF_DATA);
  const [initialized, setInitialized] = useState(false);

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

  useEffect(() => {
    if (!loading && detail && !initialized) {
      form.setValues(buildInitialValues(detail));
      // Start at the next incomplete section (lastCompletedSection is 1-indexed)
      setActive(detail.progress?.lastCompletedSection ?? 0);
      setAdminReference(detail.reference ?? null);
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, detail]);

  const handleCloseSuccessModal = () => {
    router.push(`/admin/businesses/${params.id}`);
    closeSuccess();
  };

  const handleHandOver = async () => {
    if (!adminReference) return;
    try {
      await questAxios.post(
        `/business/onboarding/admin/${adminReference}/hand-over`
      );
      handleSuccess(
        "Application Handed Over",
        "The application has been handed over to the user"
      );
      closeHandOver();
      router.push(`/admin/businesses/${params.id}`);
    } catch (error) {
      handleError("Hand Over Failed", parseError(error));
    }
  };

  const completedSections = detail?.progress?.sections ?? [];
  const isSectionCompleted = (stepIndex: number) =>
    completedSections[stepIndex]?.completed ?? false;

  if (loading || !initialized) {
    return (
      <main className={styles.main}>
        <Center h={400}>
          <Loader color="var(--prune-primary-700)" />
        </Center>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },
          {
            title: detail?.business?.businessName ?? "Business",
            href: `/admin/businesses/${params.id}`,
          },
          { title: "Edit Application", href: `/admin/businesses/${params.id}/edit` },
        ]}
      />

      <Paper py={32} px={28} mt={20}>
        <Flex align="center" justify="space-between">
          <BackBtn link={`/admin/businesses/${params.id}`} />
          {active > 0 && (
            <Tooltip
              label="Hand over to user to complete"
              withArrow
              position="left"
            >
              <span>
                <SecondaryBtn
                  text="Hand Over"
                  leftSection={<IconHandStop size={16} />}
                  fw={600}
                  action={openHandOver}
                />
              </span>
            </Tooltip>
          )}
        </Flex>

        <Text
          fz={24}
          fw={600}
          c="var(--prune-text-gray-700)"
          mt={28}
          style={{ fontFamily: "'EksellDisplay', serif" }}
        >
          Edit Application
        </Text>

        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect
          color="var(--prune-primary-700)"
          size="xs"
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
          <Stepper.Completed>{null}</Stepper.Completed>
        </Stepper>

        <Divider my={20} />

        {active === 0 && (
          <BusinessInfo
            form={form}
            active={active}
            setActive={setActive}
            refData={refData}
            adminReference={adminReference ?? undefined}
            noFloatingLabel
            isAdmin
            alreadyCompleted={isSectionCompleted(0)}
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
            alreadyCompleted={isSectionCompleted(1)}
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
            alreadyCompleted={isSectionCompleted(3)}
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
            alreadyCompleted={isSectionCompleted(4)}
          />
        )}
        {active === 5 && (
          <ReviewInfo form={form} active={active} setActive={setActive} />
        )}
        {active === 6 && (
          <TermsOfUseInfo
            form={form}
            active={active}
            setActive={(next) => {
              const n = typeof next === "function" ? next(active) : next;
              setActive(n);
              if (n > 6) openSuccess();
            }}
            adminReference={adminReference ?? undefined}
            isAdmin
          />
        )}
      </Paper>

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
