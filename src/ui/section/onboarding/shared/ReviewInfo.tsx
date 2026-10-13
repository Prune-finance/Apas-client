import { Box, Button, Divider, Flex, Grid, GridCol, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { OnboardingType } from "@/lib/schema";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { eksellStyle } from "./utils";

interface ReviewInfoProps {
  form: UseFormReturnType<OnboardingType>;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <Box>
    <Text fz={11} fw={500} c="var(--prune-text-gray-400)" tt="uppercase" mb={4}>
      {label}
    </Text>
    <Text fz={14} fw={500} c={value ? "var(--prune-text-gray-700)" : "var(--prune-text-gray-300)"}>
      {value || "—"}
    </Text>
  </Box>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text fz={13} fw={700} c="var(--prune-text-gray-500)" tt="uppercase" mb={16} style={{ letterSpacing: "0.04em" }}>
    {children}
  </Text>
);

export const ReviewInfo = ({ form, active, setActive }: ReviewInfoProps) => {
  const v = form.values;

  const formatDate = (d: Date | null | undefined) => {
    if (!d) return null;
    try {
      return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return null;
    }
  };

  return (
    <Box>
      {/* Business Information */}
      <Box mb={28}>
        <SectionTitle>Business Information</SectionTitle>
        <Grid gutter={20}>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Business Name" value={v.businessName} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Trading Name" value={v.businessTradingName} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Country" value={v.businessCountry} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Business Type" value={v.businessType} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Industry" value={v.businessIndustry} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Website" value={v.businessWebsite} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Email" value={v.businessEmail} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Phone" value={v.businessPhoneNumber} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Address" value={v.businessAddress} /></GridCol>
          <GridCol span={12}><Field label="Description" value={v.businessDescription} /></GridCol>
        </Grid>
      </Box>

      <Divider mb={28} />

      {/* Contact Person */}
      <Box mb={28}>
        <SectionTitle>Contact Person</SectionTitle>
        <Grid gutter={20}>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="First Name" value={v.contactPersonFirstName} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Last Name" value={v.contactPersonLastName} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Email" value={v.contactPersonEmail} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Phone" value={v.contactPersonPhoneNumber} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Identity Type" value={v.contactPersonIdType} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Proof of Address Type" value={v.contactPersonPOAType} /></GridCol>
        </Grid>
      </Box>

      <Divider mb={28} />

      {/* CEO Details */}
      <Box mb={28}>
        <SectionTitle>CEO Details</SectionTitle>
        <Grid gutter={20}>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="First Name" value={v.ceoFirstName} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Last Name" value={v.ceoLastName} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Email" value={v.ceoEmail} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Date of Birth" value={formatDate(v.ceoDOB)} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Identity Type" value={v.ceoIdType} /></GridCol>
          <GridCol span={{ base: 12, sm: 4 }}><Field label="Proof of Address Type" value={v.ceoPOAType} /></GridCol>
        </Grid>
      </Box>

      <Divider mb={28} />

      {/* Documents */}
      <Box mb={28}>
        <SectionTitle>Documents</SectionTitle>
        <Grid gutter={20}>
          <GridCol span={{ base: 12, sm: 3 }}>
            <Field label="CAC Certificate" value={v.cacCertificate ? "✓ Uploaded" : "Not uploaded"} />
          </GridCol>
          <GridCol span={{ base: 12, sm: 3 }}>
            <Field label="MEMAT" value={v.mermat ? "✓ Uploaded" : "Not uploaded"} />
          </GridCol>
          <GridCol span={{ base: 12, sm: 3 }}>
            <Field label="AML Compliance" value={v.amlCompliance ? "✓ Uploaded" : "Not uploaded"} />
          </GridCol>
          <GridCol span={{ base: 12, sm: 3 }}>
            <Field label="Operational License" value={v.operationalLicense ? "✓ Uploaded" : "Not uploaded"} />
          </GridCol>
        </Grid>
      </Box>

      <Divider mb={28} />

      {/* Directors */}
      <Box mb={28}>
        <SectionTitle>Directors ({v.directors?.length ?? 0})</SectionTitle>
        {v.directors?.map((d, i) => (
          <Box key={d.id ?? i}>
            {i > 0 && <Divider my={20} variant="dashed" />}
            <Text fz={12} fw={600} c="var(--prune-text-gray-500)" mb={12}>
              Director {i + 1}
            </Text>
            <Grid gutter={20}>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="First Name" value={d.first_name} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Last Name" value={d.last_name} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Email" value={d.email} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Date of Birth" value={formatDate(d.date_of_birth)} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Identity Type" value={d.identityType} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Proof of Address Type" value={d.proofOfAddress} /></GridCol>
            </Grid>
          </Box>
        ))}
      </Box>

      <Divider mb={28} />

      {/* Shareholders */}
      <Box mb={32}>
        <SectionTitle>Shareholders ({v.shareholders?.length ?? 0})</SectionTitle>
        {v.shareholders?.map((s, i) => (
          <Box key={s.id ?? i}>
            {i > 0 && <Divider my={20} variant="dashed" />}
            <Text fz={12} fw={600} c="var(--prune-text-gray-500)" mb={12}>
              Shareholder {i + 1}
            </Text>
            <Grid gutter={20}>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="First Name" value={s.first_name} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Last Name" value={s.last_name} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Email" value={s.email} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Date of Birth" value={formatDate(s.date_of_birth)} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Identity Type" value={s.identityType} /></GridCol>
              <GridCol span={{ base: 12, sm: 4 }}><Field label="Proof of Address Type" value={s.proofOfAddress} /></GridCol>
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Navigation */}
      <Flex align="center" justify="space-between" w="100%">
        <Box />
        <Flex gap={20} align="center">
          <Button
            radius={9999}
            px={18}
            h={40}
            fz={14}
            fw={500}
            c="#344054"
            onClick={() => setActive(active - 1)}
            styles={{ root: { backgroundColor: "#F2F4F7", border: "1px solid #EAECF0", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" } }}
          >
            Previous
          </Button>
          <PrimaryBtn
            text="Proceed to Terms"
            fw={600}
            action={() => setActive(active + 1)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
