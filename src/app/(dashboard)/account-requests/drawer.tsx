import { useUserBusiness } from "@/lib/hooks/businesses";
import styles from "./styles.module.scss";
import { RequestData } from "@/lib/hooks/requests";
import { BadgeComponent } from "@/ui/components/Badge";
import {
  Drawer,
  Flex,
  Box,
  Divider,
  Stack,
  Group,
  TextInput,
  UnstyledButton,
  Text,
  TabsPanel,
} from "@mantine/core";
import { IconX, IconPdf } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import TabsComponent from "@/ui/components/Tabs";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { notifications } from "@mantine/notifications";
import useNotification from "@/lib/hooks/notification";

dayjs.extend(advancedFormat);

type Props = {
  close: () => void;
  opened: boolean;
  selectedRequest: RequestData | null;
};

export const AccountRequestsDrawer = ({
  close,
  opened,
  selectedRequest,
}: Props) => {
  const { business } = useUserBusiness();

  const accountDetails = [
    {
      label: "Account Name",
      value: `${selectedRequest?.firstName ?? ""} ${
        selectedRequest?.lastName ?? ""
      }`,
    },
    {
      label: "Country",
      value: selectedRequest?.country ?? "N/A",
    },
    {
      label: "Account Type",
      value: selectedRequest?.accountType.toLowerCase(),
    },
    {
      label: "Date Created",
      value: dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY"),
    },
    {
      label: "Status",
      value: <BadgeComponent status={selectedRequest?.status ?? ""} />,
    },
  ];

  const contactPerson = {
    Name: "N/A",
    Email: business?.contactEmail,
    "Phone Number": business?.contactNumber,
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      // withCloseButton={false}
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
      title={
        <Text fz={18} fw={600} c="#1D2939" ml={28}>
          Account Request Details
        </Text>
      }
      padding={0}
      size={selectedRequest?.accountType === "USER" ? "30%" : "40%"}
    >
      <Divider mb={20} />

      <Box px={28} pb={28}>
        <Text
          fz={16}
          mb={24}
          tt="uppercase"
          c="var(--prune-text-gray-800)"
          fw={600}
        >
          Account Details
        </Text>

        <Stack gap={28}>
          {accountDetails.map((item, index) => (
            <Group justify="space-between" key={index}>
              <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
                {item.label}
              </Text>
              {
                <Text
                  fz={14}
                  fw={600}
                  c="var(--prune-text-gray-600)"
                  tt="capitalize"
                >
                  {item.value}
                </Text>
              }
            </Group>
          ))}
        </Stack>

        {selectedRequest?.accountType === "USER" && (
          <Stack gap={28}>
            <Divider mt={30} />
            <Text
              fz={16}
              // mb={24}
              tt="uppercase"
              c="var(--prune-text-gray-800)"
              fw={600}
            >
              Supporting Documents
            </Text>

            <TextInputWithFile
              label="ID"
              placeholder={"Identification card"}
              url={selectedRequest.documentData.idFileURL}
            />

            <TextInputWithFile
              label="Proof of Address"
              placeholder={"Utility Bill"}
              url={selectedRequest.documentData.poaFileURL}
            />
          </Stack>
        )}

        {selectedRequest?.accountType === "CORPORATE" && (
          <Box mt={28}>
            <Divider mb={20} />
            <Text
              fz={16}
              tt="uppercase"
              c="var(--prune-text-gray-800)"
              fw={600}
            >
              Other Details
            </Text>

            <TabsComponent tabs={tabs} fz={8} mt={28} tt="capitalize">
              {/* <TabsPanel value={tabs[0].value} mt={28}>
                <Stack gap={28}>
                  {Object.entries(contactPerson).map(([key, value], index) => (
                    <Group justify="space-between" key={index}>
                      <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
                        {key}:
                      </Text>
                      {
                        <Text fz={14} fw={600} c="var(--prune-text-gray-600)">
                          {value}
                        </Text>
                      }
                    </Group>
                  ))}
                </Stack>
              </TabsPanel> */}

              <TabsPanel value={tabs[0].value}>
                {Object.keys(selectedRequest.documentData.directors).length >
                0 ? (
                  <>
                    {Object.keys(selectedRequest.documentData.directors).map(
                      (director, index) => (
                        <Stack gap={28} key={index} mt={28}>
                          <Text fz={14} c="var(--prune-text-gray-800)">
                            Director {index + 1}:
                          </Text>
                          <TextInputWithFile
                            label="ID"
                            placeholder={
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].idType
                            }
                            url={
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].idFile
                            }
                            // url={director.identityFileUrl}
                          />

                          <TextInputWithFile
                            label="Proof of Address"
                            placeholder={
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].poaType
                            }
                            url={
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].poaFile
                            }
                            // url={director.proofOfAddressFileUrl}
                            // url={director.proofOfAddressFileUrl}
                          />
                        </Stack>
                      )
                    )}
                  </>
                ) : (
                  <Text
                    fz={14}
                    w="100%"
                    // ta="center"
                    mt={28}
                    c="var(--prune-text-gray-800)"
                  >
                    No Directors
                  </Text>
                )}
              </TabsPanel>

              <TabsPanel value={tabs[1].value}>
                {Object.keys(selectedRequest.documentData.shareholders).length >
                0 ? (
                  <>
                    {Object.keys(selectedRequest.documentData.shareholders).map(
                      (shareholder, index) => (
                        <Stack gap={28} key={index} mt={28}>
                          <Text fz={14} c="var(--prune-text-gray-800)">
                            Shareholder {index + 1}:
                          </Text>

                          <TextInputWithFile
                            label="ID"
                            placeholder={
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].idType
                            }
                            url={
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].idFile
                            }
                            // url={shareholder.identityFileUrl}
                            // url={shareholder.identityFileUrl}
                          />

                          <TextInputWithFile
                            label="Proof of Address"
                            placeholder={
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].poaType
                            }
                            url={
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].poaFile
                            }
                            // url={shareholder.proofOfAddressFileUrl}
                            // url={shareholder.proofOfAddressFileUrl}
                          />
                        </Stack>
                      )
                    )}
                  </>
                ) : (
                  <Text
                    fz={14}
                    w="100%"
                    // ta="center"
                    mt={28}
                    c="var(--prune-text-gray-800)"
                  >
                    No Shareholders
                  </Text>
                )}
              </TabsPanel>
            </TabsComponent>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

const tabs = [
  //   { value: "Documents" },
  // { value: "Contact Person" },
  { value: "Directors" },
  { value: "Shareholders" },
];

interface TextInputWithFileProps {
  label: string;
  placeholder: string;
  url: string;
}

const TextInputWithFile = ({
  label,
  url,
  placeholder,
}: TextInputWithFileProps) => {
  const { handleInfo } = useNotification();
  return (
    <TextInput
      readOnly
      classNames={{
        input: styles.input,
        label: styles.label,
        section: styles.section,
        root: styles.input__root2,
      }}
      leftSection={<IconPdf />}
      leftSectionPointerEvents="none"
      rightSection={
        <UnstyledButton
          onClick={() => {
            notifications.clean();
            if (!url) return handleInfo("No file provided", "");
            return window.open(url, "_blank");
          }}
          className={styles.input__right__section}
        >
          <Text fw={600} fz={10} c="#475467">
            View
          </Text>
        </UnstyledButton>
      }
      label={label}
      placeholder={`${placeholder}`}
    />
  );
};
