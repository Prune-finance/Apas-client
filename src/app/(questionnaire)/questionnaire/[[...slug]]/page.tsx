"use client";

import { Box, Center, Flex, Loader, Progress, Stack, Text, Title, Tooltip } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@mantine/form";
import { z } from "zod";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";

import Services from "./Services";
import { QuestionnaireNav } from "./QuestionnaireNav";
import OperationsAccount from "./OperationsAccount";
import VirtualAccount from "./VirtualAccount";
import BasicInfo, { SUPPORTED_ISO_CODES } from "./BasicInfo";
import ConsentModal from "./ConsentModal";
import ContactEntry from "./ContactEntry";

import {
  QuestionnaireFormProvider,
  useQuestionnaireForm,
} from "@/lib/store/questionnaire";
import Turnover from "./Turnover";
import {
  BizBasicInfoSchema,
  OperationsAccountSchema,
  questionnaireValues,
  QuestionnaireType,
  ServicesSchema,
  TurnoverSchema,
  VirtualAccountSchema,
} from "@/lib/schema";
import useAxios from "@/lib/hooks/useAxios";
import { Onboarding } from "@/lib/interface";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

const DRAFT_KEY = "questionnaire_draft";

const STEP_TITLES: Record<number, string> = {
  0: "Tell Us About Your Business.",
  2: "What service(s) is this Entity interested in?",
  3: "Virtual Accounts Service",
  4: "Operations Account",
};
const questAxios = createAxiosInstance("questionnaire");

export default function Questionnaire() {
  const { handleSuccess, handleError } = useNotification();

  const [entryDone, setEntryDone] = useState(false);
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const questionnaireId = params?.slug?.[0] as string | undefined;
  const resumeToken = searchParams?.get("token");
  const isResume = Boolean(questionnaireId && resumeToken);

  const [resumeLoading, setResumeLoading] = useState(isResume);

  // Baseline snapshot — set when data loads; compared on each "Save & Continue"
  const savedRef = useRef<QuestionnaireType | null>(null);

  // Refs for stale-closure-safe reads inside URL-sync effect
  const activeRef = useRef(active);
  const entryDoneRef = useRef(entryDone);
  const resumeLoadingRef = useRef(resumeLoading);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { entryDoneRef.current = entryDone; }, [entryDone]);
  useEffect(() => { resumeLoadingRef.current = resumeLoading; }, [resumeLoading]);

  // Push current step into the URL so each step gets a browser history entry
  const pushStepToURL = (step: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("step", String(step));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Sync URL → state when the browser back/forward button is used
  useEffect(() => {
    if (resumeLoadingRef.current) return;
    const stepParam = searchParams?.get("step");
    if (!entryDoneRef.current) return;
    if (stepParam === null) {
      // Browser backed past the first step — return to ContactEntry
      setEntryDone(false);
      return;
    }
    const step = parseInt(stepParam, 10);
    if (!isNaN(step) && step >= 0 && step <= 4 && step !== activeRef.current) {
      setActive(step);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const form = useQuestionnaireForm({
    initialValues: questionnaireValues,
    mode: "controlled",
    validate: (values) => {
      if (active === 0)
        return zodResolver(
          BizBasicInfoSchema.superRefine((data, ctx) => {
            if (
              data.isRegulated === "yes" &&
              !data.regulatoryDetails?.trim()
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please provide details of the regulatory license",
                path: ["regulatoryDetails"],
              });
            }
          })
        )(values);
      if (active === 1) return zodResolver(TurnoverSchema)(values);
      if (active === 2)
        return zodResolver(z.object({ services: ServicesSchema }))(values);
      if (active === 3)
        return zodResolver(z.object({ virtualAccounts: VirtualAccountSchema }))(
          values
        );
      if (active === 4)
        return zodResolver(
          z.object({ operationsAccounts: OperationsAccountSchema })
        )(values);
      return {};
    },
  });

  const hasVirtualAccount = Boolean(
    form.values.services.find((service) => service.name === "VIRTUAL_ACCOUNTS")
  );

  const hasOperationsAccount = Boolean(
    form.values.services.find((service) => service.name === "OPERATIONS_ACCOUNT")
  );

  // Resume flow: fetch existing questionnaire when URL has reference + token
  useEffect(() => {
    if (!isResume) return;

    try {
      sessionStorage.setItem("quest_reference", questionnaireId!);
      sessionStorage.setItem("quest_token", resumeToken!);
    } catch {}

    const load = async () => {
      try {
        const { data: res } = await questAxios.get(
          `/business/questionnaire/${questionnaireId}`,
          { params: { token: resumeToken } }
        );

        const a = res.data?.answers ?? {};
        const progress = res.data?.progress;

        // Map API field names → form field names
        const partial: Partial<QuestionnaireType> = {
          businessName: a.legalBusinessName ?? "",
          businessTradingName: a.tradingName ?? "",
          businessEmail: a.businessEmail ?? "",
          businessAddress: a.businessAddress ?? "",
          businessIndustry: a.businessIndustry ?? "",
          businessCountry: a.countryCode ?? "",
          countryCode: a.phoneCountryCode ?? "+234",
          businessPhoneNumber: a.phoneNumber ?? "",
          isRegulated: a.isRegulated ? "yes" : "no",
          regulatoryDetails: a.regulatoryLicence ?? "",
          geoFootprint: a.geographicFootprint ?? "",
          businessDescription: a.businessDescription ?? "",
          annualTurnover: a.annualTurnover ?? "",
          services: a.services?.length
            ? a.services.map((service: { service?: string; name?: string; currencies: string[] }) => ({
                name: service.service ?? service.name ?? "",
                currencies: service.currencies,
              }))
            : questionnaireValues.services,
          virtualAccounts: a.virtualAccounts
            ? {
                day_one_requirement: a.virtualAccounts.dayOneAccounts ?? "",
                total_number_of_virtual_accounts: a.virtualAccounts.fullCapacityAccounts ?? "",
                max_value_per_transaction: {
                  daily: a.virtualAccounts.singleAccountMaxDaily ?? "",
                  monthly: a.virtualAccounts.singleAccountMaxMonthly ?? "",
                  annually: a.virtualAccounts.singleAccountMaxAnnually ?? "",
                },
                max_value_all_virtual_accounts: {
                  daily: a.virtualAccounts.allAccountsMaxDaily ?? "",
                  monthly: a.virtualAccounts.allAccountsMaxMonthly ?? "",
                  annually: a.virtualAccounts.allAccountsMaxAnnually ?? "",
                },
                total_highest_transaction_count: {
                  daily: a.virtualAccounts.highestTransactionCount ?? "",
                },
              }
            : questionnaireValues.virtualAccounts,
          operationsAccounts: a.operationsBalance
            ? { estimated_balance: String(a.operationsBalance) }
            : questionnaireValues.operationsAccounts,
        };

        form.setValues({ ...questionnaireValues, ...partial });
        savedRef.current = { ...questionnaireValues, ...partial };

        // Section 1 = ContactEntry (done), section 2 = BasicInfo (active 0), etc.
        const isComplete = progress?.isComplete === true || progress?.nextSection === null;
        let resolvedStep: number;

        if (isComplete) {
          resolvedStep = 4;
        } else {
          const nextSection = progress?.nextSection ?? 2;
          const nextActive = Math.max(0, Math.min(4, nextSection - 2));
          const needsVirtualAccount = partial.services?.some(
            (service) => service.name === "VIRTUAL_ACCOUNTS"
          );
          resolvedStep = nextActive === 3 && !needsVirtualAccount ? 4 : nextActive;
        }

        setActive(resolvedStep);
        setEntryDone(true);
        pushStepToURL(resolvedStep);
        if (isComplete) open();
      } catch {
        // If fetch fails, show ContactEntry so user can re-enter
      } finally {
        setResumeLoading(false);
      }
    };

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useAxios<Onboarding>({
    baseURL: "auth",
    endpoint: `/onboarding/get-questionnaire-by-id/${questionnaireId}`,
    enabled: !!!questionnaireId,
    dependencies: [questionnaireId],
    onSuccess: (data) => {
      const partial = {
        ...data,
        isRegulated: (data.isRegulated ? "yes" : "no") as "yes" | "no",
        virtualAccounts:
          Object.keys(data.virtualAccounts).length === 0
            ? questionnaireValues.virtualAccounts
            : data.virtualAccounts,
        operationsAccounts:
          Object.keys(data.operationsAccounts).length === 0
            ? questionnaireValues.operationsAccounts
            : data.operationsAccounts,
      };
      form.setValues(partial);
      // Merge with defaults so snapshot covers all QuestionnaireType fields
      savedRef.current = { ...questionnaireValues, ...partial };
    },
  });

  const isDirty = () =>
    JSON.stringify(form.values) !== JSON.stringify(savedRef.current);

  // Helpers to get reference + token from URL or sessionStorage fallback
  const getReference = () =>
    questionnaireId ??
    (typeof window !== "undefined" ? sessionStorage.getItem("quest_reference") : null);

  const getResumeToken = () =>
    resumeToken ??
    (typeof window !== "undefined" ? sessionStorage.getItem("quest_token") : null);

  // Map form values → API payload for each section
  const buildSectionPayload = (step: number) => {
    if (step === 0) {
      const v = form.values;
      return {
        businessEmail: v.businessEmail,
        legalBusinessName: v.businessName,
        tradingName: v.businessTradingName,
        countryCode: v.businessCountry,
        businessAddress: v.businessAddress,
        businessIndustry: v.businessIndustry,
        phoneCountryCode: v.countryCode,
        phoneNumber: String(v.businessPhoneNumber).replace(/[^0-9]/g, ""),
        businessDescription: v.businessDescription,
        geographicFootprint: v.geoFootprint,
        isRegulated: v.isRegulated === "yes",
        regulatoryLicence: v.regulatoryDetails ?? "",
      };
    }
    if (step === 1) {
      return { annualTurnover: form.values.annualTurnover };
    }
    if (step === 2) {
      return {
        services: form.values.services.map((s) => ({
          service: s.name,
          currencies: s.currencies,
        })),
      };
    }
    if (step === 3) {
      const va = form.values.virtualAccounts;
      return {
        dayOneAccounts: Number(va.day_one_requirement),
        fullCapacityAccounts: Number(va.total_number_of_virtual_accounts),
        singleAccountMaxDaily: String(va.max_value_per_transaction?.daily ?? ""),
        singleAccountMaxMonthly: String(va.max_value_per_transaction?.monthly ?? ""),
        singleAccountMaxAnnually: String(va.max_value_per_transaction?.annually ?? ""),
        allAccountsMaxDaily: String(va.max_value_all_virtual_accounts?.daily ?? ""),
        allAccountsMaxMonthly: String(va.max_value_all_virtual_accounts?.monthly ?? ""),
        allAccountsMaxAnnually: String(va.max_value_all_virtual_accounts?.annually ?? ""),
        highestTransactionCount: Number(va.total_highest_transaction_count?.daily ?? 0),
      };
    }
    if (step === 4) {
      return { operationsBalance: form.values.operationsAccounts.estimated_balance };
    }
    return {};
  };

  const persistToStorage = () => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form.values));
    } catch {}
  };

  // Save without validation — PATCH /sections/{n}
  const saveDraft = async () => {
    persistToStorage();

    const reference = getReference();
    const token = getResumeToken();

    if (!reference || !token) {
      handleError("Unable to save", "Session reference not found. Please refresh and try again.");
      return;
    }

    setSavingDraft(true);
    try {
      await questAxios.patch(
        `/business/questionnaire/${reference}/sections/${active + 2}`,
        buildSectionPayload(active),
        { headers: { "X-Resume-Token": token } }
      );
      handleSuccess("Progress saved", "Your progress has been saved successfully.");
    } catch (err: unknown) {
      let msg = parseError(err);
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const res = (err as { response?: { data?: { issues?: { field: string; message: string }[] } } }).response?.data;
        if (res?.issues?.length) {
          msg = res.issues.map((i) => i.message).join(", ");
        }
      }
      handleError("Save failed", msg);
    } finally {
      setSavingDraft(false);
    }
  };

  const goNext = () => {
    if (active === 4) return open();
    if (active === 3 && !hasOperationsAccount) return open();

    if (active === 2 && !hasVirtualAccount) {
      if (!hasOperationsAccount) return open();
      setActive(4);
      pushStepToURL(4);
      return;
    }

    const nextStep = Math.min(active + 1, 4);
    setActive(nextStep);
    pushStepToURL(nextStep);
  };

  const goPrev = () => {
    if (active === 0) return;
    const prevStep = active === 4 && !hasVirtualAccount ? 2 : Math.max(active - 1, 0);
    setActive(prevStep);
    pushStepToURL(prevStep);
  };

  // Save with validation — POST /sections/{n}/complete
  const handleNext = async () => {
    if (
      active === 0 &&
      form.values.businessCountry &&
      !SUPPORTED_ISO_CODES.has(form.values.businessCountry.toUpperCase())
    ) return;
    if (form.validate().hasErrors) return;
    if (!isDirty()) { goNext(); return; }

    setSaving(true);
    try {
      const reference = getReference();
      const token = getResumeToken();

      savedRef.current = { ...form.values };
      persistToStorage();

      if (reference && token) {
        const completeSection = active + 2;
        const { data: apiRes } = await questAxios.post(
          `/business/questionnaire/${reference}/sections/${completeSection}/complete`,
          buildSectionPayload(active),
          { headers: { "X-Resume-Token": token } }
        );
        const progress = apiRes?.data?.progress;
        if (progress?.isComplete === true || progress?.nextSection === null) {
          open();
        } else if (progress?.nextSection != null) {
          const nextActive = (progress.nextSection as number) - 2;
          setActive(nextActive);
          pushStepToURL(nextActive);
        } else {
          goNext();
        }
      } else {
        goNext();
      }
    } catch {
      // errors surface via notifications
    } finally {
      setSaving(false);
    }
  };

  if (resumeLoading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Stack align="center" gap={16}>
          <Loader color="var(--prune-primary-600)" size="lg" />
          <Text fz={14} c="var(--prune-text-gray-600)">
            Loading your questionnaire...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!entryDone) {
    return (
      <Box px={{ base: 24, sm: 48, lg: 120 }} py={48}>
        <ContactEntry
          onComplete={() => {
            setEntryDone(true);
            pushStepToURL(0);
          }}
          onReturning={(step) => {
            setEntryDone(true);
            setActive(step);
            pushStepToURL(step);
          }}
        />
      </Box>
    );
  }

  return (
    <QuestionnaireFormProvider form={form}>
      <Box pos="sticky" top={0} style={{ zIndex: 100 }} bg="#FCFCFD">
        <Box px={{ base: 24, sm: 48, lg: 120 }} pt={32} pb={15}>
          <Title
            order={3}
            ta="left"
            mb={15}
            c="var(--prune-text-gray-700)"
          >
            Prune Onboarding: Company Profile
          </Title>
          <Progress
            value={((active + 1) / 5) * 100}
            color="var(--prune-primary-600)"
            transitionDuration={300}
          />
        </Box>
      </Box>

      <Box
        px={{ base: 24, sm: 48, lg: 120 }}
        mt={40}
      >
        <Flex align="center" justify="space-between" mb={32}>
          {STEP_TITLES[active] && (
            <Text fz={24} fw={700} c="var(--prune-text-gray-700)" style={{ fontFamily: "'EksellDisplay', serif" }}>
              {STEP_TITLES[active]}
            </Text>
          )}
          {active !== 1 && active !== 4 && (
            <Box ml="auto">
              <Tooltip label="Save progress" withArrow position="left">
                <PrimaryBtn
                  text="Save progress"
                  icon={IconDeviceFloppy}
                  showIcon
                  h={36}
                  fz={13}
                  fw={500}
                  loading={savingDraft}
                  disabled={saving}
                  action={() => { saveDraft(); }}
                />
              </Tooltip>
            </Box>
          )}
        </Flex>

        {active === 0 && <BasicInfo />}
        {active === 1 && <Turnover />}
        {active === 2 && <Services />}
        {active === 3 && <VirtualAccount />}
        {active === 4 && <OperationsAccount />}

        <QuestionnaireNav
          onNext={handleNext}
          loading={saving}
          disabled={
            savingDraft ||
            (active === 2 && form.values.services.length === 0) ||
            (active === 0 &&
              Boolean(form.values.businessCountry) &&
              !SUPPORTED_ISO_CODES.has(form.values.businessCountry.toUpperCase()))
          }
          onPrevious={goPrev}
          nextText={active === 4 ? "Submit" : "Save & Continue"}
        />
      </Box>

      <ConsentModal opened={opened} close={close} />
    </QuestionnaireFormProvider>
  );
}
