"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconHandStop } from "@tabler/icons-react";
import { Box, Center, Divider, Flex, Loader, Paper, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import { SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";
import SuccessModal from "@/ui/components/SuccessModal";
import SuccessModalImage from "@/assets/img/success-modal-image.png";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import useAxios from "@/lib/hooks/useAxios";
import { useBusinessDetail } from "@/lib/hooks/businesses";
import { ReferenceData, DEFAULT_REF_DATA } from "@/ui/section/onboarding/shared";
import countries from "@/assets/countries.json";

import AdminStep1BusinessInfo from "@/ui/section/admin-new-business/AdminStep1BusinessInfo";
import AdminStep2Services from "@/ui/section/admin-new-business/AdminStep2Services";
import AdminStep3Financials from "@/ui/section/admin-new-business/AdminStep3Financials";
import AdminStep4People from "@/ui/section/admin-new-business/AdminStep4People";
import AdminStep5Documents from "@/ui/section/admin-new-business/AdminStep5Documents";

const questAxios = createAxiosInstance("questionnaire");

const STEP_LABELS = [
  "Business Information",
  "Services",
  "Financials",
  "People",
  "Documents",
];

const PRIMARY = "var(--prune-primary-700)";
const GRAY_LINE = "#EAECF0";
const GRAY_BORDER = "#D0D5DD";
const GRAY_TEXT = "#667085";

function AdminStepper({ active, steps }: { active: number; steps: string[] }) {
  return (
    <Box w="100%" mt={32} mb={4}>
      <Flex align="flex-start" w="100%">
        {steps.map((label, idx) => {
          const isDone = idx < active;
          const isCurrent = idx === active;

          const leftLineColor = idx <= active ? PRIMARY : GRAY_LINE;
          const rightLineColor = idx < active ? PRIMARY : GRAY_LINE;

          const circleStyle: React.CSSProperties = isDone
            ? {
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: PRIMARY,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                paddingBottom: 2,
              }
            : isCurrent
            ? {
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#fff",
                border: `1px solid ${PRIMARY}`,
                boxShadow: "0px 0px 0px 4px rgba(117, 134, 4, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                paddingBottom: 2,
              }
            : {
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#fff",
                border: `1px solid ${GRAY_BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                paddingBottom: 2,
              };

          const numColor = isDone ? "#fff" : isCurrent ? PRIMARY : GRAY_TEXT;

          return (
            <Box key={label} style={{ flex: "1 0 0", minWidth: 1 }}>
              <Flex align="center" gap={4} w="100%">
                <Box style={{ flex: "1 0 0", minWidth: 1, height: 2, background: leftLineColor }} />
                <Box style={circleStyle}>
                  <Text fz={14} fw={600} c={numColor} lh={1}>
                    {idx + 1}
                  </Text>
                </Box>
                <Box style={{ flex: "1 0 0", minWidth: 1, height: 2, background: rightLineColor }} />
              </Flex>
              <Flex justify="center" px={12} mt={10}>
                <Text fz={12} fw={700} c="#344054" ta="center">
                  {label}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

export default function EditBusiness() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { handleError, handleSuccess } = useNotification();

  const { loading, business: detail } = useBusinessDetail(params.id);

  const [active, setActive] = useState(0);
  const [adminReference, setAdminReference] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [refData, setRefData] = useState<ReferenceData>(DEFAULT_REF_DATA);
  const [initialized, setInitialized] = useState(false);

  const [openedHandOver, { open: openHandOver, close: closeHandOver }] =
    useDisclosure(false);
  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  useAxios<ReferenceData>({
    baseURL: "questionnaire",
    endpoint: "/business/onboarding/reference-data",
    method: "GET",
    dependencies: [],
    onSuccess: (data) => setRefData(data),
  });

  const codeToCountryName = (code: string | null | undefined): string => {
    if (!code) return "";
    return countries.find((c) => c.code.toUpperCase() === code.toUpperCase())?.name ?? "";
  };

  useEffect(() => {
    if (!loading && detail && !initialized) {
      const ref = detail.reference ?? params.id;
      setAdminReference(ref);

      const services = (detail.wizard?.answers?.["2"]?.services ?? []).map((s) => s.service);
      setSelectedServices(services);

      const nextStep = detail.wizard?.nextStep ?? 1;
      setActive(Math.min(nextStep - 1, STEP_LABELS.length - 1));
      setInitialized(true);
    }
  }, [loading, detail, initialized, params.id]);

  const step1Answers = detail?.wizard?.answers?.["1"];
  const contactPersonAnswers = step1Answers?.contactPerson;
  const contactPerson = detail?.contactPerson;

  const step1InitialValues = step1Answers
    ? {
        businessName: step1Answers.businessName ?? "",
        tradingName: step1Answers.tradingName ?? "",
        businessType: step1Answers.businessType ?? "",
        businessIndustry: step1Answers.businessIndustry ?? "",
        country: codeToCountryName(step1Answers.countryCode),
        businessAddress: step1Answers.businessAddress ?? "",
        businessEmail: step1Answers.businessEmail ?? "",
        phoneNumberCode: step1Answers.phoneCountryCode ?? "+234",
        phoneNumber: step1Answers.phoneNumber ?? "",
        businessWebsite: step1Answers.businessWebsite ?? "",
        businessDescription: step1Answers.businessDescription ?? "",
        isRegulated: step1Answers.isRegulated ?? false,
        regulatoryLicence: step1Answers.regulatoryLicence ?? "",
        annualTurnover: step1Answers.annualTurnover ?? "",
        contactFirstName: contactPersonAnswers?.name?.split(" ")[0] ?? contactPerson?.firstName ?? "",
        contactLastName: contactPersonAnswers?.name?.split(" ").slice(1).join(" ") || contactPerson?.lastName || "",
        contactDesignation: contactPersonAnswers?.designation ?? "",
        contactEmail: contactPersonAnswers?.email ?? contactPerson?.email ?? "",
        contactPhoneNumberCode: contactPersonAnswers?.phoneCountryCode ?? contactPerson?.phoneCountryCode ?? "+234",
        contactPhoneNumber: contactPersonAnswers?.phoneNumber ?? contactPerson?.phoneNumber ?? "",
        contactIdentityType: contactPersonAnswers?.identityType ?? contactPerson?.identityType ?? "",
        contactProofOfAddressType: contactPersonAnswers?.proofOfAddressType ?? contactPerson?.proofOfAddressType ?? "",
        contactIdentityDocumentId: contactPersonAnswers?.identityDocument ?? "",
        contactIdentityDocumentBackId: contactPersonAnswers?.identityDocumentBack ?? "",
        contactProofOfAddressDocumentId: contactPersonAnswers?.proofOfAddressDocument ?? "",
      }
    : undefined;

  const businessName = detail?.business?.businessName ?? "";

  const handleCloseSuccessModal = () => {
    router.push(`/admin/eligibility-center/${params.id}`);
    closeSuccess();
  };

  const handleHandOver = async () => {
    if (!adminReference) return;
    try {
      await questAxios.post(`/business/onboarding/admin/${adminReference}/hand-over`);
      handleSuccess("Application Handed Over", "The application has been handed over to the user");
      closeHandOver();
      router.push(`/admin/eligibility-center/${params.id}`);
    } catch (error) {
      handleError("Hand Over Failed", parseError(error));
    }
  };

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
          { title: "Eligibility Center", href: "/admin/eligibility-center" },
          {
            title: businessName || "Business",
            href: `/admin/eligibility-center/${params.id}`,
          },
          { title: "Edit Business", href: "#" },
        ]}
      />

      <Paper py={32} px={28} mt={20}>
        <Flex align="center" justify="flex-end">
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
          Edit Business
        </Text>

        <AdminStepper active={active} steps={STEP_LABELS} />

        <Divider my={20} />

        <Box style={{ display: active === 0 ? "block" : "none" }}>
          <AdminStep1BusinessInfo
            refData={refData}
            adminReference={adminReference ?? undefined}
            initialValues={step1InitialValues}
            onComplete={() => setActive(1)}
          />
        </Box>
        <Box style={{ display: active === 1 ? "block" : "none" }}>
          <AdminStep2Services
            adminReference={adminReference!}
            onBack={() => setActive(0)}
            onComplete={(services) => {
              setSelectedServices(services);
              setActive(2);
            }}
          />
        </Box>
        <Box style={{ display: active === 2 ? "block" : "none" }}>
          <AdminStep3Financials
            adminReference={adminReference!}
            selectedServices={selectedServices}
            onBack={() => setActive(1)}
            onComplete={() => setActive(3)}
          />
        </Box>
        <Box style={{ display: active === 3 ? "block" : "none" }}>
          <AdminStep4People
            adminReference={adminReference!}
            refData={refData}
            onBack={() => setActive(2)}
            onComplete={() => setActive(4)}
          />
        </Box>
        <Box style={{ display: active === 4 ? "block" : "none" }}>
          <AdminStep5Documents
            adminReference={adminReference!}
            onBack={() => setActive(3)}
            onComplete={openSuccess}
          />
        </Box>
      </Paper>

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
