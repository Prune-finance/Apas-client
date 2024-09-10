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
  Alert,
  FileButton,
  Modal,
} from "@mantine/core";
import {
  IconX,
  IconPdf,
  IconFileTypePdf,
  IconInfoCircle,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import TabsComponent from "@/ui/components/Tabs";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { notifications } from "@mantine/notifications";
import useNotification from "@/lib/hooks/notification";
import { camelCaseToTitleCase, getUserType } from "@/lib/utils";
import { getNestedDocValue } from "@/lib/helpers/document-status";
import axios from "axios";
import Cookies from "js-cookie";
import { parseError } from "@/lib/actions/auth";
import { Dispatch, SetStateAction, useState } from "react";
import FileDisplay from "@/ui/components/DocumentViewer";
import { useDisclosure } from "@mantine/hooks";

dayjs.extend(advancedFormat);

type Props = {
  close: () => void;
  opened: boolean;
  selectedRequest: RequestData | null;
  setSelectedRequest: Dispatch<SetStateAction<RequestData | null>>;
  revalidate: () => void;
};

export const AccountRequestsDrawer = ({
  close,
  opened,
  selectedRequest,
  setSelectedRequest,
  revalidate,
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
      value: getUserType(selectedRequest?.accountType ?? "USER"),
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
        {selectedRequest?.status === "REJECTED" && (
          <Alert
            variant="light"
            color="#B49800"
            title=""
            icon={<IconInfoCircle />}
            styles={{ message: { color: "#B49800" } }}
            mt={20}
            mb={28}
          >
            This request has been rejected because it didn’t meet the criteria
            or standards. Please review and make corrections or contact our
            support team.
          </Alert>
        )}

        <Text
          fz={14}
          mb={24}
          tt="uppercase"
          c="var(--prune-text-gray-800)"
          fw={600}
        >
          Account Information
        </Text>

        <Stack gap={28}>
          {accountDetails.map((item, index) => (
            <Group justify="space-between" key={index}>
              <Text fz={12} fw={400} c="var(--prune-text-gray-500)">
                {item.label}:
              </Text>
              {
                <Text
                  fz={12}
                  fw={600}
                  c="var(--prune-text-gray-700)"
                  tt="capitalize"
                >
                  {item.value}
                </Text>
              }
            </Group>
          ))}
        </Stack>

        {selectedRequest?.reason && (
          <Box mt={24}>
            <Divider mt={30} mb={24} />
            <Text
              fz={14}
              fw={600}
              c="var(--prune-text-gray-800)"
              tt="uppercase"
              mb={24}
            >
              Reason:
            </Text>

            <div
              style={{
                marginTop: "15px",
                background: "#F9F9F9",
                padding: "12px 16px",
              }}
            >
              <Text fz={12} c="var(--prune-text-gray-600)">
                {selectedRequest?.reason || ""}
              </Text>
            </div>
          </Box>
        )}

        {selectedRequest?.accountType === "USER" && (
          <Stack gap={28}>
            <Divider mt={30} />
            <Text
              fz={14}
              // mb={24}
              tt="uppercase"
              c="var(--prune-text-gray-800)"
              fw={600}
            >
              Supporting Documents
            </Text>

            <TextInputWithFile
              label="ID"
              placeholder={camelCaseToTitleCase(
                selectedRequest.documentData.idType
              )}
              url={selectedRequest.documentData.idFileURL}
              path="idFileURL"
              revalidate={revalidate}
              request={selectedRequest}
              setRequest={setSelectedRequest}
            />

            <TextInputWithFile
              label="Proof of Address"
              placeholder={camelCaseToTitleCase(
                selectedRequest.documentData.poaType
              )}
              url={selectedRequest.documentData.poaFileURL}
              path="poaFileURL"
              request={selectedRequest}
              revalidate={revalidate}
              setRequest={setSelectedRequest}
            />
          </Stack>
        )}

        {selectedRequest?.accountType === "CORPORATE" && (
          <Box mt={28}>
            <Divider mb={20} />
            <Text
              fz={14}
              tt="uppercase"
              c="var(--prune-text-gray-800)"
              fw={600}
            >
              Other Details
            </Text>

            <TabsComponent tabs={tabs} fz={12} mt={28} tt="capitalize">
              <TabsPanel value={tabs[0].value} mt={28}>
                {selectedRequest?.documentData?.certOfInc ? (
                  <Stack gap={28}>
                    <TextInputWithFile
                      label="Certificate of Incorporation"
                      placeholder="Certificate of Incorporation"
                      url={selectedRequest.documentData.certOfInc}
                      path="certOfInc"
                      request={selectedRequest}
                      revalidate={revalidate}
                      setRequest={setSelectedRequest}
                    />
                  </Stack>
                ) : null}

                {selectedRequest.documentData?.mermat ? (
                  <Stack gap={28} mt={20}>
                    <TextInputWithFile
                      label="Mermat"
                      placeholder="Mermat"
                      url={selectedRequest.documentData.mermat}
                      path={`mermat`}
                      request={selectedRequest}
                      revalidate={revalidate}
                      setRequest={setSelectedRequest}
                    />
                  </Stack>
                ) : null}

                {!selectedRequest?.documentData?.certOfInc &&
                  !selectedRequest?.documentData?.mermat && (
                    <Text
                      fz={14}
                      w="100%"
                      // ta="center"
                      mt={28}
                      c="var(--prune-text-gray-800)"
                    >
                      No Documents
                    </Text>
                  )}
              </TabsPanel>

              <TabsPanel value={tabs[1].value}>
                {Object.keys(selectedRequest.documentData.directors).length >
                0 ? (
                  <>
                    {Object.keys(selectedRequest.documentData.directors).map(
                      (director, index, arr) => (
                        <Stack gap={28} key={index} mt={28}>
                          <Text fz={14} fw={600} c="var(--prune-text-gray-800)">
                            Director {index + 1}:
                          </Text>
                          <TextInputWithFile
                            label="ID"
                            placeholder={camelCaseToTitleCase(
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].idType
                            )}
                            url={
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].idFile
                            }
                            path={`directors.director_${index + 1}.idFile`}
                            request={selectedRequest}
                            revalidate={revalidate}
                            setRequest={setSelectedRequest}
                          />

                          {selectedRequest.documentData.directors[
                            `director_${index + 1}`
                          ].idFileBack && (
                            <TextInputWithFile
                              label="ID (Back)"
                              placeholder={camelCaseToTitleCase(
                                selectedRequest.documentData.directors[
                                  `director_${index + 1}`
                                ].idType
                              )}
                              url={
                                selectedRequest.documentData.directors[
                                  `director_${index + 1}`
                                ].idFileBack ?? ""
                              }
                              path={`directors.director_${
                                index + 1
                              }.idFileBack`}
                              revalidate={revalidate}
                              request={selectedRequest}
                              setRequest={setSelectedRequest}
                            />
                          )}

                          <TextInputWithFile
                            label="Proof of Address"
                            placeholder={camelCaseToTitleCase(
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].poaType
                            )}
                            url={
                              selectedRequest.documentData.directors[
                                `director_${index + 1}`
                              ].poaFile
                            }
                            path={`directors.director_${index + 1}.poaFile`}
                            request={selectedRequest}
                            revalidate={revalidate}
                            setRequest={setSelectedRequest}
                          />

                          {arr.length - 1 !== index && <Divider mt={20} />}
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

              <TabsPanel value={tabs[2].value}>
                {Object.keys(selectedRequest.documentData.shareholders).length >
                0 ? (
                  <>
                    {Object.keys(selectedRequest.documentData.shareholders).map(
                      (shareholder, index, arr) => (
                        <Stack gap={28} key={index} mt={28}>
                          <Text fz={14} fw={600} c="var(--prune-text-gray-800)">
                            Shareholder {index + 1}:
                          </Text>

                          <TextInputWithFile
                            label="ID"
                            placeholder={camelCaseToTitleCase(
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].idType
                            )}
                            url={
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].idFile
                            }
                            path={`shareholders.shareholder_${
                              index + 1
                            }.idFile`}
                            request={selectedRequest}
                            revalidate={revalidate}
                            setRequest={setSelectedRequest}
                          />

                          {selectedRequest.documentData.shareholders[
                            `shareholder_${index + 1}`
                          ].idFileBack && (
                            <TextInputWithFile
                              label="ID (Back)"
                              placeholder={camelCaseToTitleCase(
                                selectedRequest.documentData.shareholders[
                                  `shareholder_${index + 1}`
                                ].idType
                              )}
                              url={
                                selectedRequest.documentData.shareholders[
                                  `shareholder_${index + 1}`
                                ].idFileBack ?? ""
                              }
                              path={`shareholders.shareholder_${
                                index + 1
                              }.idFileBack`}
                              request={selectedRequest}
                              revalidate={revalidate}
                              setRequest={setSelectedRequest}
                            />
                          )}

                          <TextInputWithFile
                            label="Proof of Address"
                            placeholder={camelCaseToTitleCase(
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].poaType
                            )}
                            url={
                              selectedRequest.documentData.shareholders[
                                `shareholder_${index + 1}`
                              ].poaFile
                            }
                            path={`shareholders.shareholder_${
                              index + 1
                            }.poaFile`}
                            request={selectedRequest}
                            revalidate={revalidate}
                            setRequest={setSelectedRequest}
                          />

                          {arr.length - 1 !== index && <Divider mt={20} />}
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
  { value: "Documents" },
  // { value: "Contact Person" },
  { value: "Directors" },
  { value: "Shareholders" },
];

interface TextInputWithFileProps {
  label: string;
  placeholder: string;
  url: string;
  path: string;
  request: RequestData;
  setRequest: Dispatch<SetStateAction<RequestData | null>>;
  revalidate: () => void;
  // status: string;
}

export const TextInputWithFile = ({
  label,
  url,
  placeholder,
  path,
  revalidate,
  request,
  setRequest,
}: TextInputWithFileProps) => {
  const [processing, setProcessing] = useState(false);
  const { handleError, handleInfo, handleSuccess } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);

  const handleUpload = async (file: File | null) => {
    // formKey: string;
    // setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/upload`,
        formData,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      return data.data.url;

      // if (formKey) {
      //   form.setFieldValue(formKey, data.data.url);
      // }
      // setUploaded(true);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  const reUpload = async (file: File | null) => {
    const url = await handleUpload(file);
    if (!url) return;
    setProcessing(true);
    try {
      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/dashboard/requests/${request.id}/document/upload`,
        {
          path,
          url,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      handleSuccess(
        "Upload Successful",
        "You have successfully uploaded the document"
      );
      revalidate();
      setRequest(res.data);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <TextInput
        readOnly
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
          root: styles.input__root2,
        }}
        leftSection={<IconFileTypePdf color="#475467" />}
        leftSectionPointerEvents="none"
        rightSectionWidth={70}
        rightSection={
          getNestedDocValue(request.documentApprovals, path) === false ? (
            <FileButton
              disabled={processing}
              onChange={(file) => reUpload(file)}
              accept="image/png, image/jpeg, application/pdf"
            >
              {(props) => (
                <UnstyledButton
                  w={"100%"}
                  className={styles.input__right__section}
                  {...props}
                >
                  <Text fw={600} fz={10} c="#475467">
                    Re-upload
                  </Text>
                </UnstyledButton>
              )}
            </FileButton>
          ) : (
            <UnstyledButton
              // onClick={() => {
              //   notifications.clean();
              //   if (!url) return handleInfo("No file provided", "");
              //   return window.open(url, "_blank");
              // }}
              onClick={open}
              className={styles.input__right__section}
              mr={20}
              w={"100%"}
            >
              <Text fw={600} fz={10} c="#475467">
                View
              </Text>
            </UnstyledButton>
          )
        }
        label={
          <Text fz={12} mb={2}>
            {label}
          </Text>
        }
        placeholder={`${placeholder}`}
      />
      <Modal
        opened={opened}
        onClose={close}
        size={"lg"}
        centered
        title={
          <Text fz={18} fw={600}>
            Document Preview
          </Text>
        }
      >
        <Box mah={400}>
          <FileDisplay fileUrl={url} />
        </Box>
      </Modal>
    </>
  );
};
