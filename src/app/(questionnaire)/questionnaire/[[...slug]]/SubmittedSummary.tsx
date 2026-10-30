"use client";

import { Alert, Box, Divider, Grid, GridCol, Text, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { QuestionnaireType } from "@/lib/schema";

// Answers that only exist on the API response (not part of the form values)
export interface SubmittedContact {
  contactEmail?: string | null;
  contactName?: string | null;
  contactDesignation?: string | null;
  contactPhone?: string | null;
}

interface Props {
  values: QuestionnaireType;
  contact: SubmittedContact;
}

// "VIRTUAL_ACCOUNTS" → "Virtual accounts"
const humanize = (value?: string | null) =>
  value
    ? value
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
    : null;

const formatNumber = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  // Range options such as "ONE_TO_FIVE_MILLION" aren't numbers — show them as text
  return Number.isFinite(n) ? n.toLocaleString("en-GB") : humanize(String(value));
};

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <Box>
    <Text fz={11} fw={500} c="var(--prune-text-gray-400)" tt="uppercase" mb={4}>
      {label}
    </Text>
    <Text
      fz={14}
      fw={500}
      c={value ? "var(--prune-text-gray-700)" : "var(--prune-text-gray-300)"}
      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
    >
      {value || "—"}
    </Text>
  </Box>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box>
    <Text
      fz={13}
      fw={700}
      c="var(--prune-text-gray-500)"
      tt="uppercase"
      mb={16}
      style={{ letterSpacing: "0.04em" }}
    >
      {title}
    </Text>
    <Grid gutter={20}>{children}</Grid>
    <Divider my={28} color="#EAECF0" />
  </Box>
);

const third = { base: 12, sm: 6, md: 4 };

/** Read-only view of a submitted questionnaire: every answer, no inputs or actions. */
export default function SubmittedSummary({ values: v, contact }: Props) {
  const services = v.services.filter((s) => s.name);
  const hasVirtualAccounts = services.some((s) => s.name === "VIRTUAL_ACCOUNTS");
  const hasOperationsAccount = services.some((s) => s.name === "OPERATIONS_ACCOUNT");
  const va = v.virtualAccounts;

  return (
    <Box>
      <Alert
        mb={32}
        radius={8}
        color="var(--prune-primary-600)"
        variant="light"
        icon={
          <ThemeIcon variant="transparent" color="var(--prune-primary-700)" size={20}>
            <IconCircleCheck size={20} />
          </ThemeIcon>
        }
      >
        <Text fz={14} fw={500} c="var(--prune-text-gray-700)">
          This questionnaire has been submitted
        </Text>
        <Text fz={13} c="#667085" mt={4}>
          Here is a copy of your answers. They can no longer be changed.
        </Text>
      </Alert>

      <Section title="Contact Details">
        <GridCol span={third}><Field label="Full Name" value={contact.contactName} /></GridCol>
        <GridCol span={third}><Field label="Designation" value={contact.contactDesignation} /></GridCol>
        <GridCol span={third}><Field label="Email Address" value={contact.contactEmail} /></GridCol>
        <GridCol span={third}><Field label="Phone Number" value={contact.contactPhone} /></GridCol>
      </Section>

      <Section title="Business Information">
        <GridCol span={third}><Field label="Legal Business Name" value={v.businessName} /></GridCol>
        <GridCol span={third}><Field label="Trading Name" value={v.businessTradingName} /></GridCol>
        <GridCol span={third}><Field label="Company Email" value={v.businessEmail} /></GridCol>
        <GridCol span={third}><Field label="Country" value={v.businessCountry} /></GridCol>
        <GridCol span={third}><Field label="Business Industry" value={v.businessIndustry} /></GridCol>
        <GridCol span={third}>
          <Field
            label="Phone Number"
            value={v.businessPhoneNumber ? `${v.countryCode ?? ""} ${v.businessPhoneNumber}`.trim() : null}
          />
        </GridCol>
        <GridCol span={12}><Field label="Business Address" value={v.businessAddress} /></GridCol>
        <GridCol span={12}><Field label="Business Description" value={v.businessDescription} /></GridCol>
        <GridCol span={12}>
          <Field label="Geographic footprint and typical customer base" value={v.geoFootprint} />
        </GridCol>
        <GridCol span={third}>
          <Field label="Regulated" value={v.isRegulated === "yes" ? "Yes" : "No"} />
        </GridCol>
        {v.isRegulated === "yes" && (
          <GridCol span={{ base: 12, md: 8 }}>
            <Field label="Regulatory licence (name and reference number)" value={v.regulatoryDetails} />
          </GridCol>
        )}
      </Section>

      <Section title="Annual Turnover">
        <GridCol span={12}><Field label="Annual turnover" value={humanize(v.annualTurnover)} /></GridCol>
      </Section>

      <Section title="Services">
        {services.length ? (
          services.map((s) => (
            <GridCol span={third} key={s.name}>
              <Field label={humanize(s.name) ?? "Service"} value={s.currencies?.join(", ")} />
            </GridCol>
          ))
        ) : (
          <GridCol span={12}><Field label="Services" value={null} /></GridCol>
        )}
      </Section>

      {hasVirtualAccounts && (
        <Section title="Virtual Accounts">
          <GridCol span={{ base: 12, md: 6 }}>
            <Field label="Day one requirement" value={formatNumber(va.day_one_requirement)} />
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Field label="Total at full capacity" value={formatNumber(va.total_number_of_virtual_accounts)} />
          </GridCol>
          <GridCol span={third}><Field label="Max per transaction (single account) · daily" value={formatNumber(va.max_value_per_transaction?.daily)} /></GridCol>
          <GridCol span={third}><Field label="· monthly" value={formatNumber(va.max_value_per_transaction?.monthly)} /></GridCol>
          <GridCol span={third}><Field label="· yearly" value={formatNumber(va.max_value_per_transaction?.annually)} /></GridCol>
          <GridCol span={third}><Field label="Max per transaction (all accounts) · daily" value={formatNumber(va.max_value_all_virtual_accounts?.daily)} /></GridCol>
          <GridCol span={third}><Field label="· monthly" value={formatNumber(va.max_value_all_virtual_accounts?.monthly)} /></GridCol>
          <GridCol span={third}><Field label="· yearly" value={formatNumber(va.max_value_all_virtual_accounts?.annually)} /></GridCol>
          <GridCol span={12}>
            <Field
              label="Highest daily transaction count (all accounts)"
              value={formatNumber(va.total_highest_transaction_count?.daily)}
            />
          </GridCol>
        </Section>
      )}

      {hasOperationsAccount && (
        <Section title="Operations Account">
          <GridCol span={12}>
            <Field
              label="Estimated balance held in the operating account(s)"
              value={formatNumber(v.operationsAccounts?.estimated_balance)}
            />
          </GridCol>
        </Section>
      )}
    </Box>
  );
}
