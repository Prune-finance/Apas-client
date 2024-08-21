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
  console.log(selectedRequest, business);
  const accountDetails = [
    {
      label: "Account Name",
      value: `${selectedRequest?.firstName ?? ""} ${
        selectedRequest?.lastName ?? ""
      }`,
    },
    {
      label: "Country",
      value: selectedRequest?.Company.country ?? "N/A",
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
    Email: business?.contactEmail,
    "Phone Number": business?.contactNumber,
  };
  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      withCloseButton={false}
      size={selectedRequest?.accountType === "USER" ? "30%" : "40%"}
    >
      <Flex justify="space-between" pb={28}>
        <Text fz={18} fw={600} c="#1D2939">
          Account Request Details
        </Text>

        <IconX onClick={close} />
      </Flex>

      <Box>
        <Divider mb={20} />

        <Text fz={16} mb={24}>
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
                  fw={500}
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
            <Text fz={16}>Supporting Documents</Text>

            <TextInputWithFile
              label="ID"
              placeholder={"Identification card"}
              url={selectedRequest.documentData.idFileUrl}
            />

            <TextInputWithFile
              label="Proof of Address"
              placeholder={"Utility Bill"}
              url={selectedRequest.documentData.poaFileUrl}
            />

            <Text fz={16}>Contact Person Details</Text>

            <Stack gap={28}>
              {Object.entries(contactPerson).map(([key, value], index) => (
                <Group justify="space-between" key={index}>
                  <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
                    {key}
                  </Text>
                  {
                    <Text fz={14} fw={500} c="var(--prune-text-gray-600)">
                      {value}
                    </Text>
                  }
                </Group>
              ))}
            </Stack>
          </Stack>
        )}

        {selectedRequest?.accountType === "CORPORATE" && (
          <Box mt={28}>
            <Divider mb={20} />
            <Text fz={16}>Other Details</Text>

            <TabsComponent tabs={tabs} fz={8} mt={28}>
              <TabsPanel value={tabs[0].value} mt={28}>
                <Stack gap={28}>
                  {Object.entries(contactPerson).map(([key, value], index) => (
                    <Group justify="space-between" key={index}>
                      <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
                        {key}:
                      </Text>
                      {
                        <Text fz={14} fw={500} c="var(--prune-text-gray-600)">
                          {value}
                        </Text>
                      }
                    </Group>
                  ))}
                </Stack>
              </TabsPanel>

              <TabsPanel value={tabs[1].value}>
                {business?.directors.map((director, index) => (
                  <Stack gap={28} key={index} mt={28}>
                    <Text fz={14} c="var(--prune-text-gray-800)">
                      Director {index + 1}:
                    </Text>
                    <TextInputWithFile
                      label="ID"
                      placeholder={director.identityType}
                      url={director.identityFileUrl}
                    />

                    <TextInputWithFile
                      label="Proof of Address"
                      placeholder={director.proofOfAddress}
                      url={director.proofOfAddressFileUrl}
                    />
                  </Stack>
                ))}
              </TabsPanel>

              <TabsPanel value={tabs[2].value}>
                {business?.shareholders.map((shareholder, index) => (
                  <Stack gap={28} key={index} mt={28}>
                    <Text fz={14} c="var(--prune-text-gray-800)">
                      Shareholder {index + 1}:
                    </Text>

                    <TextInputWithFile
                      label="ID"
                      placeholder={shareholder.identityType}
                      url={shareholder.identityFileUrl}
                    />

                    <TextInputWithFile
                      label="Proof of Address"
                      placeholder={shareholder.proofOfAddress}
                      url={shareholder.proofOfAddressFileUrl}
                    />
                  </Stack>
                ))}
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
  { value: "Contact Person" },
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
          onClick={() => window.open(url || "", "_blank")}
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
