import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import dayjs from "dayjs";

interface DirectorInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturnType<OnboardingType>;
}

function DirectorInfoCard({ setActive, form }: DirectorInfoCard) {
  const { directors } = form.values;
  const data = form.getValues().directors.map((director, index) => ({
    "First name": director.first_name,
    "Last Name": director.last_name,
    "Date of Birth": dayjs(director.date_of_birth).format("DD-MM-YYYY"),
    Email: director.email,
    "Identity Type": director.identityType,
    "Proof of Address": director.proofOfAddress,
  }));

  return (
    <Box p={24} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Directors
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(3)}
        />
      </Flex>

      {data.map((director, directorIndex) => (
        <React.Fragment key={directorIndex}>
          <Text
            c="var(--prune-text-gray-700)"
            fz={12}
            fw={600}
            mt={24}
            tt="uppercase"
          >
            Director {directorIndex + 1}
          </Text>

          <Stack gap={10} mt={20}>
            {Object.entries(director).map(([key, value]) => (
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
                  title={directors[directorIndex].identityType || ""}
                  value={directors[directorIndex].identityFileUrl || ""}
                />
                <DocumentPreview
                  label="Proof of Address"
                  title={directors[directorIndex].proofOfAddress || ""}
                  value={directors[directorIndex].proofOfAddressFileUrl || ""}
                />
              </Flex>
            </Box>

            <Divider
              mt={20}
              color="var(--prune-text-gray-200)"
              display={directorIndex !== data.length - 1 ? "block" : "none"}
            />
          </Stack>
        </React.Fragment>
      ))}
    </Box>
  );
}

export default DirectorInfoCard;
