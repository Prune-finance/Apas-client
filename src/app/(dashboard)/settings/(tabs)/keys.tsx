"use client";
import Cookies from "js-cookie";

import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconAB2, IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import styles from "../styles.module.scss";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useUserBusiness } from "@/lib/hooks/businesses";
import ModalComponent from "@/ui/components/Modal";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { matches, useForm, UseFormReturnType } from "@mantine/form";
import { LiveDateModal } from "../LiveDateModal";
import { notifications } from "@mantine/notifications";

export default function Keys() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [webHook, setWebHook] = useState<WebHook[]>([]);
  const params = useParams<{ id: string }>();
  const { handleError, handleSuccess, handleInfo } = useNotification();
  const [loadingKey, setLoadingKey] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingWebHook, setProcessingWebHook] = useState(false);
  const [processingKeyRequest, setProcessingKeyRequest] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [editWebHook, setEditWebHook] = useState(false);

  const [liveDate, setLiveDate] = useState<Date | null>(null);

  const { business, loading, meta, revalidate } = useUserBusiness();

  const { live, test } = useMemo(() => {
    const live = keys.find((key) => key.staging === "LIVE");
    const test = keys.find((key) => key.staging === "TEST");

    return { live, test };
  }, [keys]);

  const initialValues = {
    eventURL: webHook.find((hook) => hook.type === "EVENT")?.url ?? "",
    callbackURL: webHook.find((hook) => hook.type === "CALLBACK")?.url ?? "",
  };

  const webHookForm = useForm({
    initialValues: initialValues,
    validate: {
      eventURL: matches(/^https?:\/\/.+$/, "Please enter a valid URL"),
      callbackURL: matches(/^https?:\/\/.+$/, "Please enter a valid URL"),
    },
  });

  const fetchBusinessSecrets = async () => {
    setLoadingKey(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/key/secrets`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setKeys(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingKey(false);
    }
  };

  const fetchWebHooks = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/webhooks/dashboard`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setWebHook(data.data);
      const eventURL = data.data.find(
        (hook: WebHook) => hook.type === "EVENT"
      )?.url;
      const callbackURL = data.data.find(
        (hook: WebHook) => hook.type === "CALLBACK"
      )?.url;
      webHookForm.setValues({ eventURL, callbackURL });
    } catch (error) {
      console.log(error);
    }
  };

  const patchWebHooks = async () => {
    const { eventURL, callbackURL } = webHookForm.values;
    if (webHookForm.validate().hasErrors) return;
    setProcessingWebHook(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/webhooks/dashboard`,
        { eventURL, callbackURL },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      handleSuccess("Webhooks Updated", "Webhooks updated successfully");
      await fetchWebHooks();
    } catch (error) {
      handleError("Webhooks Update Failed", parseError(error));
    } finally {
      setProcessingWebHook(false);
      setEditWebHook(false);
    }
  };

  const resetSecrets = async () => {
    setProcessing(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/key/secrets/regenerate`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setKeys(data.data);
      handleSuccess(
        "Successful! Secret Key Reset",
        "Secret key reset successfully"
      );
      close();
    } catch (error) {
      handleError("Secret Key Reset Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchBusinessSecrets();
  }, []);

  useEffect(() => {
    fetchWebHooks();
  }, [live?.key]);

  const requestLiveKey = async () => {
    notifications.clean();
    if (!liveDate)
      return handleInfo("Please select a date to request a live key", "");

    setProcessingKeyRequest(true);
    try {
      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/key/secrets/live/request`,
        { date: liveDate },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      closeModal();
      handleSuccess(
        "Request Sent",
        "You have successfully requested for Live keys . Once it is generated by the Super  Admin, it would appear here."
      );
      revalidate();
    } catch (error) {
      handleError("Request for Live Key failed", parseError(error));
    } finally {
      setProcessingKeyRequest(false);
    }
  };

  return (
    <div className={styles.business__tab}>
      <Flex className={styles.api__container} gap={40}>
        <Flex flex={1} className={styles.api__key} direction="column">
          <Group justify="space-between" mb={14}>
            <Group gap={5}>
              <Text fz={12} fw={600} tt="uppercase">
                API KEYS:
              </Text>
              <Tooltip
                label="Please do not use your test keys for production. They are only for test."
                multiline
                color="red"
                w={220}
              >
                <IconInfoCircle size={16} color="var(--prune-warning)" />
              </Tooltip>
            </Group>

            {/* {!Boolean(meta?.hasLiveKey) && (
              <PrimaryBtn
                text={
                  Boolean(meta?.activeLKReq)
                    ? "Live Key Requested"
                    : "Request Live Keys"
                }
                {...(Boolean(meta?.activeLKReq) && {
                  icon: IconCheck,
                })}
                loading={loading}
                loaderProps={{ type: "dots" }}
                disabled={Boolean(meta?.activeLKReq)}
                fw={600}
                justify="center"
                action={openModal}
              />
            )} */}
          </Group>

          <Paper
            radius={8}
            style={{ border: "1px solid var(--prune-text-gray-100)" }}
            p={24}
          >
            <Group justify="flex-end">
              <PrimaryBtn
                text="Reset Keys"
                variant="transparent"
                td="underline"
                fw={700}
                c="var(--prune-primary-800)"
                action={open}
              />
            </Group>

            <Stack gap={10}>
              {loadingKey ? (
                <Skeleton h={30} w={"100%"} mt={30} />
              ) : (
                <KeyComponent keyString={test?.key} keyType="Secret Test Key" />
              )}

              {Boolean(meta?.hasLiveKey) && (
                <KeyComponent keyString={live?.key} keyType="Secret Live Key" />
              )}
            </Stack>
          </Paper>

          <Group justify="space-between" mb={14} mt={32}>
            <Text fz={12} fw={600} tt="uppercase">
              Webhooks:
            </Text>

            {editWebHook ? (
              <Group>
                <SecondaryBtn
                  text="Cancel"
                  fw={600}
                  disabled={processingWebHook}
                  action={() => setEditWebHook(false)}
                />

                <PrimaryBtn
                  text="Save Changes"
                  fw={600}
                  action={patchWebHooks}
                  loading={processingWebHook}
                />
              </Group>
            ) : (
              <SecondaryBtn
                text="Edit Webhooks"
                fw={600}
                action={() => setEditWebHook(true)}
              />
            )}
          </Group>
          <Paper
            radius={8}
            style={{ border: "1px solid var(--prune-text-gray-100)" }}
            p={24}
          >
            <Stack gap={10}>
              <WebHookComponent
                webHookType="Event Webhook URL"
                edit={editWebHook}
                form={webHookForm}
                formKey="eventURL"
              />

              <WebHookComponent
                webHookType="Callback Webhook URL"
                edit={editWebHook}
                form={webHookForm}
                formKey="callbackURL"
              />
            </Stack>
          </Paper>
        </Flex>

        <Flex
          // h="fit-content"
          className={styles.api__calls}
          direction="column"
        >
          <Text tt="uppercase" fz={10} className="grey-600">
            Total Api Calls
          </Text>
          {!loading ? (
            <Text mt={16} fz={24} className="primary-700">
              {business?.apiCalls}
            </Text>
          ) : (
            <Skeleton h={20} w={100} mt={16} />
          )}

          <Text mt={24} fz={10} className="grey-500">
            Total API calls made in the system
          </Text>
        </Flex>
      </Flex>

      <ModalComponent
        opened={opened}
        close={close}
        title="Reset Keys?"
        text="Are you sure you want to reset your keys?"
        action={resetSecrets}
        icon={<IconAB2 color="#475467" size={14} />}
        color="var(--prune-text-gray-300)"
        processing={processing}
      />

      <LiveDateModal
        opened={openedModal}
        close={closeModal}
        processing={processingKeyRequest}
        action={requestLiveKey}
        date={liveDate}
        setDate={setLiveDate}
      />
    </div>
  );
}

export interface Key {
  id: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  staging: string;
  companyId: string;
}

export interface WebHook {
  id: string;
  type: "EVENT" | "CALLBACK";
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  companyId: string;
}

const KeyComponent = ({
  keyString,
  keyType,
}: {
  keyString?: string;
  keyType: string;
}) => {
  const [view, setView] = useState(false);
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <Box w="100%">
      <TextInput
        label={`${keyType}:`}
        labelProps={{
          fw: 400,
          fz: 12,
          c: "var(--prune-text-gray-500)",
        }}
        // flex={1}
        w="100%"
        readOnly
        classNames={{
          // root: styles.root,
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSectionPointerEvents="none"
        rightSection={
          <Flex gap={10}>
            <UnstyledButton
              onClick={() => setView(!view)}
              className={styles.input__right__section}
            >
              <Text fw={600} fz={10} c="#475467">
                {!view ? "View" : "Hide"}
              </Text>
            </UnstyledButton>

            <UnstyledButton
              onClick={() => clipboard.copy(keyString)}
              className={styles.input__right__section}
            >
              <Text fw={600} fz={10} c="#475467">
                {clipboard.copied ? "Copied" : "Copy"}
              </Text>
            </UnstyledButton>
          </Flex>
        }
        // label="Test Key"
        placeholder={
          !view
            ? `${keyString ? keyString.slice(0, 15) : ""}****************`
            : `${keyString}`
        }
      />
    </Box>
  );
};

interface WebHookForm {
  eventURL: string;
  callbackURL: string;
}
const WebHookComponent = ({
  webHookType,
  edit,
  form,
  formKey,
}: {
  webHookType: string;
  edit?: boolean;
  form: UseFormReturnType<WebHookForm>;
  formKey: keyof WebHookForm;
}) => {
  const [view, setView] = useState(false);
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <Box w="100%">
      <TextInput
        label={`${webHookType}:`}
        labelProps={{
          fw: 400,
          fz: 12,
          c: "var(--prune-text-gray-500)",
        }}
        // flex={1}
        w="100%"
        readOnly={!edit}
        classNames={{
          // root: styles.root,
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        styles={{
          input: {
            border: edit ? "1px solid var(--prune-text-gray-200, gray.5)" : "",
          },
        }}
        leftSectionPointerEvents="none"
        rightSection={
          <Flex gap={10}>
            {/* <UnstyledButton
              onClick={() => setView(!view)}
              className={styles.input__right__section}
            >
              <Text fw={600} fz={10} c="#475467">
                {!view ? "View" : "Hide"}
              </Text>
            </UnstyledButton> */}
            <Tooltip
              label="No web hook found"
              withArrow
              disabled={!!form.values[formKey]}
            >
              <UnstyledButton
                onClick={() => clipboard.copy(form.values[formKey])}
                className={styles.input__right__section}
                style={{
                  cursor: !form.values[formKey] ? "not-allowed" : "pointer",
                }}
                disabled={!form.values[formKey]}
              >
                <Text fw={600} fz={10} c="#475467">
                  {clipboard.copied ? "Copied" : "Copy"}
                </Text>
              </UnstyledButton>
            </Tooltip>
          </Flex>
        }
        placeholder={`Enter ${webHookType}`}
        {...form.getInputProps(formKey)}
      />
    </Box>
  );
};
