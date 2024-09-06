import { DefaultAccount } from "@/lib/hooks/accounts";
import { formatNumber } from "@/lib/utils";
import { inter } from "@/ui/fonts";
import { Box, Divider, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React from "react";
import { PrimaryBtn } from "../Buttons";

interface PreviewStateProps {
  requestForm?: any;
  companyRequestForm?: any;
  sectionState: string;
  account: DefaultAccount | null;
  closePreview: () => void;
  sendMoneyRequest: () => void;
  processing: boolean;
}

function PreviewState({
  requestForm,
  account,
  sectionState,
  closePreview,
  sendMoneyRequest,
  companyRequestForm,
  processing,
}: PreviewStateProps) {
  const beneficiaryDetails = {
    "First Name": requestForm?.firstName,
    "Last Name": requestForm?.lastName,
    IBAN: requestForm?.destinationIBAN,
    BIC: requestForm?.destinationBIC,
    Bank: requestForm?.destinationBank,
    "Bank Address": requestForm?.bankAddress,
    Country: requestForm?.destinationCountry,
    invoice: requestForm?.invoice,
    // Amount: requestForm?.amount,
    narration: requestForm?.narration,
  };

  const companyRequestFormDetails = {
    "Company Name": companyRequestForm?.companyName,
    IBAN: companyRequestForm?.destinationIBAN,
    BIC: companyRequestForm?.destinationBIC,
    Bank: companyRequestForm?.destinationBank,
    "Bank Address": companyRequestForm?.bankAddress,
    // amount: companyRequestForm?.amount,
    invoice: companyRequestForm?.invoice || "",
    narration: companyRequestForm?.narration,
  };

  return (
    <Paper px={0} pt={0} pb={10}>
      <Flex
        gap={10}
        align="center"
        justify="space-between"
        w="100%"
        style={{ borderBottom: "1px solid #f9f9f9" }}
      >
        <Flex px={30} align="center" justify="space-between" w="100%" py={10}>
          <Text fz={24} fw={600} c="#1d2939">
            Preview Details
          </Text>

          <Flex
            align="flex-start"
            justify="flex-start"
            w={32}
            h={32}
            style={{ borderRadius: "100%", cursor: "pointer" }}
          >
            <IconX color="#344054" size={16} onClick={closePreview} />
          </Flex>
        </Flex>
      </Flex>
      <Box style={{ borderRadius: "4px" }} mt={10} px={30}>
        <Flex
          align="flex-start"
          justify="flex-start"
          direction="column"
          h={"100%"}
        >
          <Text fz={14} fw={500} c="#667085" mb={0}>
            Amount
          </Text>
          <Text fz={32} fw={600} c="#97ad05" mt={0}>
            {sectionState === "Individual"
              ? formatNumber(requestForm?.amount ?? 0, true, "EUR")
              : formatNumber(companyRequestForm?.amount ?? 0, true, "EUR")}
          </Text>
        </Flex>

        <Divider my={20} />

        {sectionState === "Individual" ? (
          <Stack gap={24}>
            {Object.entries(beneficiaryDetails).map(([key, value]) => (
              <Group justify="space-between" key={key}>
                <Text fz={12} c="var(--prune-text-gray-500)" tt="capitalize">
                  {key}:
                </Text>

                <Text
                  fz={12}
                  c="var(--prune-text-gray-700)"
                  fw={600}
                  tt="capitalize"
                >
                  {value}
                </Text>
              </Group>
            ))}
          </Stack>
        ) : (
          <Stack gap={24}>
            {Object.entries(companyRequestFormDetails).map(([key, value]) => (
              <Group justify="space-between" key={key}>
                <Text fz={12} c="var(--prune-text-gray-500)" tt="capitalize">
                  {key}:
                </Text>

                <Text
                  fz={12}
                  c="var(--prune-text-gray-700)"
                  fw={600}
                  tt="capitalize"
                >
                  {value}
                </Text>
              </Group>
            ))}
          </Stack>
        )}
        <Divider my={20} />

        <PrimaryBtn
          action={sendMoneyRequest}
          loading={processing}
          text="Send Money"
          fw={600}
          w={"100%"}
          h={40}
          mt={10}
        />
      </Box>
    </Paper>
  );
}

export default PreviewState;
