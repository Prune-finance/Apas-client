import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import dayjs from "dayjs";

interface ShareholderInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturnType<OnboardingType>;
  active: number;
}

function ShareholderInfoCard({ setActive, form, active }: ShareholderInfoCard) {
  const { shareholders } = form.values;
  const data = form.getValues().shareholders?.map((shareholder, index) => ({
    "First name": shareholder.first_name,
    "Last Name": shareholder.last_name,
    "Date of Birth": dayjs(shareholder.date_of_birth).format("DD-MM-YYYY"),
    Email: shareholder.email,
    "Identity Type": shareholder.identityType,
    "Proof of Address": shareholder.proofOfAddress,
  }));
  return (
    <Box p={24} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Key Shareholders
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(4)}
          disabled={active === 7}
        />
      </Flex>

      {(data || []).map((shareholder, shareholderIdx) => (
        <React.Fragment key={shareholderIdx}>
          <Text
            c="var(--prune-text-gray-700)"
            fz={12}
            fw={600}
            mt={24}
            tt="uppercase"
          >
            Shareholder {shareholderIdx + 1}
          </Text>

          <Stack gap={10} mt={20}>
            {Object.entries(shareholder).map(([key, value]) => (
              <Group key={key} justify="space-between" align="start">
                <Text c="#667085" fz={12}>
                  {key}:
                </Text>
                <Text
                  c="#344054"
                  ta="right"
                  w={244}
                  fz={12}
                  tt={key === "Email" ? "lowercase" : "capitalize"}
                >
                  {value}
                </Text>
              </Group>
            ))}
            <Box mt={16}>
              <Text c="var(--prune-text-gray-700)" fz={14} fw={600}>
                Uploaded Documents
              </Text>

              <Flex gap={24} w="100%" mt={16}>
                <DocumentPreview
                  label="Identity Document"
                  title={shareholders?.[shareholderIdx].identityType || ""}
                  value={shareholders?.[shareholderIdx].identityFileUrl || ""}
                />
                <DocumentPreview
                  label="Proof of Address"
                  title={shareholders?.[shareholderIdx].proofOfAddress || ""}
                  value={
                    shareholders?.[shareholderIdx].proofOfAddressFileUrl || ""
                  }
                />
              </Flex>
            </Box>

            <Divider
              mt={20}
              color="var(--prune-text-gray-200)"
              display={
                shareholderIdx !== (data ?? []).length - 1 ? "block" : "none"
              }
            />
          </Stack>
        </React.Fragment>
      ))}
    </Box>
  );
}

export default ShareholderInfoCard;
