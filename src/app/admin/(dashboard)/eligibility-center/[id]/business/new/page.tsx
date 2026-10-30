"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconHandStop } from "@tabler/icons-react";
import { Box, Center, Divider, Flex, Loader, Modal, Paper, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";
import SuccessModal from "@/ui/components/SuccessModal";
import SuccessModalImage from "@/assets/img/success-modal-image.png";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import useAxios from "@/lib/hooks/useAxios";
import { ReferenceData, DEFAULT_REF_DATA } from "@/ui/section/onboarding/shared";

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

function NewBusiness() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleError, handleSuccess } = useNotification();

  const [active, setActive] = useState(0);
  const [adminReference, setAdminReference] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [handingOver, setHandingOver] = useState(false);
  const [refData, setRefData] = useState<ReferenceData>(DEFAULT_REF_DATA);
  const syncingFromUrl = useRef(false);

  const [openedHandOver, { open: openHandOver, close: closeHandOver }] =
    useDisclosure(false);
  const [openedFinalStep, { open: openFinalStep, close: closeFinalStep }] =
    useDisclosure(false);
  const [openedSuccess, { close: closeSuccess }] =
    useDisclosure(false);

  useAxios<ReferenceData>({
    baseURL: "questionnaire",
    endpoint: "/business/onboarding/reference-data",
    method: "GET",
    dependencies: [],
    onSuccess: (data) => setRefData(data),
  });

  // Push step to URL so the browser back button restores the previous step
  useEffect(() => {
    if (syncingFromUrl.current) {
      syncingFromUrl.current = false;
      return;
    }
    router.push(`?step=${active}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Restore active from URL when the browser back/forward button is used
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam === null) return;
    const step = parseInt(stepParam, 10);
    if (isNaN(step) || step === active) return;
    // Only navigate forward if adminReference is already set
    if (step > 0 && !adminReference) return;
    syncingFromUrl.current = true;
    setActive(Math.min(step, STEP_LABELS.length - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCloseSuccessModal = () => {
    router.push("/admin/eligibility-center");
    closeSuccess();
  };

  const handleHandOver = async () => {
    if (!adminReference) return;
    setHandingOver(true);
    try {
      await questAxios.post(
        `/business/onboarding/admin/${adminReference}/hand-over`
      );
      handleSuccess("Application Handed Over", "The application has been handed over to the user");
      closeHandOver();
      closeFinalStep();
      router.push("/admin/eligibility-center");
    } catch (error) {
      handleError("Hand Over Failed", parseError(error));
    } finally {
      setHandingOver(false);
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Eligibility Center", href: "/admin/eligibility-center" },
          { title: "Create New Profile", href: "#" },
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
                  text="Hand Over to User"
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
          Create New Profile
        </Text>

        <AdminStepper active={active} steps={STEP_LABELS} />

        <Divider my={20} />

        <Box style={{ display: active === 0 ? "block" : "none" }}>
          <AdminStep1BusinessInfo
            refData={refData}
            adminReference={adminReference ?? undefined}
            onComplete={(ref) => {
              if (ref) setAdminReference(ref);
              setActive(1);
            }}
          />
        </Box>

        {adminReference && (
          <Box style={{ display: active !== 0 ? "block" : "none" }}>
            <Box style={{ display: active === 1 ? "block" : "none" }}>
              <AdminStep2Services
                adminReference={adminReference}
                onBack={() => setActive(0)}
                onComplete={(services) => {
                  setSelectedServices(services);
                  setActive(2);
                }}
              />
            </Box>
            <Box style={{ display: active === 2 ? "block" : "none" }}>
              <AdminStep3Financials
                adminReference={adminReference}
                selectedServices={selectedServices}
                onBack={() => setActive(1)}
                onComplete={() => setActive(3)}
              />
            </Box>
            <Box style={{ display: active === 3 ? "block" : "none" }}>
              <AdminStep4People
                adminReference={adminReference}
                refData={refData}
                onBack={() => setActive(2)}
                onComplete={() => setActive(4)}
              />
            </Box>
            <Box style={{ display: active === 4 ? "block" : "none" }}>
              <AdminStep5Documents
                adminReference={adminReference}
                onBack={() => setActive(3)}
                onComplete={openFinalStep}
              />
            </Box>
          </Box>
        )}
      </Paper>

      <Modal
        opened={openedFinalStep}
        onClose={closeFinalStep}
        centered
        size="sm"
        withCloseButton={false}
        padding="xl"
        radius="md"
      >
        <Stack align="center" gap={16}>
          <ThemeIcon
            size={64}
            radius="xl"
            color="hsl(from var(--prune-primary-700) h s l / .1)"
          >
            <IconHandStop size={32} color="var(--prune-primary-700)" />
          </ThemeIcon>
          <Text fz={18} fw={700} c="var(--prune-text-gray-700)" ta="center" style={{ fontFamily: "'EksellDisplay', serif" }}>
            One More Step!
          </Text>
          <Text fz={14} c="var(--prune-text-gray-500)" ta="center">
            All admin steps are complete. The next step is for the customer to review and agree to the terms & conditions and complete the consent form. Hand over to the customer to proceed.
          </Text>
          <Flex gap={12} mt={8} w="100%" justify="center">
            <SecondaryBtn text="Do It Later" action={closeFinalStep} fw={600} />
            <PrimaryBtn text="Hand Over to User" action={handleHandOver} fw={600} loading={handingOver} leftSection={<IconHandStop size={16} />} />
          </Flex>
        </Stack>
      </Modal>

      <ModalComponent
        opened={openedHandOver}
        close={closeHandOver}
        icon={<IconHandStop color="var(--prune-primary-700)" />}
        title="Hand Over Application?"
        text="Are you sure you want to hand over this application to the user to complete? You will no longer be able to edit it."
        action={handleHandOver}
        processing={handingOver}
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

export default function NewBusinessPage() {
  return (
    <Suspense fallback={<Center h={400}><Loader color="var(--prune-primary-700)" /></Center>}>
      <NewBusiness />
    </Suspense>
  );
}
