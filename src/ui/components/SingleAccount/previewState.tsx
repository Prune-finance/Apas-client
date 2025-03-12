import { DefaultAccount } from "@/lib/hooks/accounts";
import { formatNumber } from "@/lib/utils";
import { inter } from "@/ui/fonts";
import {
  Box,
  Divider,
  Flex,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { PrimaryBtn } from "../Buttons";
import FileDisplay from "../DocumentViewer";
import { useDisclosure } from "@mantine/hooks";
import useDebtorStore from "@/lib/store/debtor";

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
  const { debtorRequestForm } = useDebtorStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const beneficiaryDetails = {
    "First Name": requestForm?.firstName,
    "Last Name": requestForm?.lastName,
    IBAN: requestForm?.destinationIBAN,
    BIC: requestForm?.destinationBIC,
    Bank: requestForm?.destinationBank,
    "Bank Address": requestForm?.bankAddress,
    Country: requestForm?.destinationCountry,
    "Supporting document": requestForm?.invoice ? (
      <Text
        fz={12}
        fw={600}
        style={{ cursor: "pointer" }}
        td="underline"
        onClick={() => {
          setFileUrl(requestForm?.invoice);
          open();
        }}
      >
        View
      </Text>
    ) : (
      "N/A"
    ),
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
    "Supporting document": companyRequestForm?.invoice ? (
      <Text
        fz={12}
        fw={600}
        style={{ cursor: "pointer" }}
        td="underline"
        onClick={() => {
          setFileUrl(companyRequestForm?.invoice);
          open();
        }}
      >
        View
      </Text>
    ) : (
      "N/A"
    ),
    narration: companyRequestForm?.narration,
  };

  const selfDebtorDetails = {
    fullName: debtorRequestForm?.fullName,
    address: debtorRequestForm?.address,
    country: debtorRequestForm?.country,
    postCode: debtorRequestForm?.postCode,
    state: debtorRequestForm?.state,
    city: debtorRequestForm?.city,
    website: debtorRequestForm?.website,
    "Business Reg No": debtorRequestForm?.businessRegNo,
  };

  return (
    <>
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
              <Text fz={14} fw={600}>
                Beneficiary Details
              </Text>
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

              <Text fz={14} fw={600}>
                Ultimate Debtor Details
              </Text>

              {Object.entries(selfDebtorDetails).map(([key, value]) => (
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

      <Modal
        opened={opened}
        onClose={close}
        size={800}
        centered
        title={
          <Text fz={14} fw={500}>
            Document Preview
          </Text>
        }
      >
        <Box>
          <FileDisplay fileUrl={fileUrl} />
        </Box>
      </Modal>
    </>
  );
}

export default PreviewState;
