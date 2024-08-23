"use client";
import Cookies from "js-cookie";

import {
  Alert,
  Badge,
  Button,
  Flex,
  Group,
  Skeleton,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { IconAB2, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import styles from "../styles.module.scss";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useUserBusiness } from "@/lib/hooks/businesses";
import ModalComponent from "@/ui/components/Modal";

export default function Keys() {
  const [keys, setKeys] = useState<Key[]>([]);
  const params = useParams<{ id: string }>();
  const clipboard = useClipboard({ timeout: 500 });
  const liveClipboard = useClipboard({ timeout: 500 });
  const hookClipboard = useClipboard({ timeout: 500 });
  const { handleError, handleSuccess } = useNotification();
  const [processing, setProcessing] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const { business, loading, meta } = useUserBusiness();

  const { live, test } = useMemo(() => {
    const live = keys.find((key) => key.staging === "LIVE");
    const test = keys.find((key) => key.staging === "TEST");

    return { live, test };
  }, [keys]);

  const [viewLive, setViewLive] = useState(false);
  const [viewTest, setViewTest] = useState(false);
  const [viewHook, setViewHook] = useState(false);

  const fetchBusinessSecrets = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/key/secrets`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setKeys(data.data);
    } catch (error) {
      console.log(error);
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

  const icon = <IconInfoCircle />;

  return (
    <div className={styles.business__tab}>
      <Flex className={styles.api__container} gap={40}>
        <Flex flex={1} className={styles.api__key} direction="column">
          <Flex justify="space-between" align="center">
            {/* <Text fz={12} fw={600} tt="uppercase">
              API KEYS
            </Text> */}

            <Badge
              leftSection={icon}
              tt="inherit"
              color="#D92D20"
              variant="light"
              radius={0}
              h={32}
            >
              Please do not use your test keys for production. They are only for
              test.
            </Badge>

            <Flex gap={10}>
              <Button
                leftSection={<IconAB2 color="#475467" size={14} />}
                onClick={open}
                // onClick={resetSecrets}
                className={styles.edit}
                // loading={processing}
                // loaderProps={{ color: "var(--prune-primary-700)" }}
              >
                Reset
              </Button>
            </Flex>
          </Flex>

          <Group gap={28}>
            <Text fz={12} fw={400} c="var(--prune-text-gray-500)" w="20ch">
              Test Key
            </Text>
            <TextInput
              flex={1}
              readOnly
              mt={30}
              classNames={{
                root: styles.root,
                input: styles.input,
                label: styles.label,
                section: styles.section,
              }}
              leftSectionPointerEvents="none"
              rightSection={
                <Flex gap={10}>
                  <UnstyledButton
                    onClick={() => setViewTest(!viewTest)}
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="#475467">
                      {!viewTest ? "View" : "Hide"}
                    </Text>
                  </UnstyledButton>

                  <UnstyledButton
                    onClick={() => clipboard.copy(test?.key)}
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
                !viewTest
                  ? `${test ? test?.key.slice(0, 15) : ""}****************`
                  : `${test ? test?.key.slice(0, 50) : ""}....`
              }
            />
          </Group>

          <Group gap={28}>
            <Text fz={12} fw={400} c="var(--prune-text-gray-500)" w="20ch">
              Live Key
            </Text>
            <TextInput
              flex={1}
              readOnly
              mt={30}
              classNames={{
                root: styles.root,
                input: styles.input,
                label: styles.label,
                section: styles.section,
              }}
              leftSectionPointerEvents="none"
              rightSection={
                <Flex gap={10}>
                  <UnstyledButton
                    onClick={() => setViewLive(!viewLive)}
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="#475467">
                      {viewLive ? "Hide" : "View"}
                    </Text>
                  </UnstyledButton>

                  <UnstyledButton
                    onClick={() => liveClipboard.copy(live?.key)}
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="#475467">
                      {liveClipboard.copied ? "Copied" : "Copy"}
                    </Text>
                  </UnstyledButton>
                </Flex>
              }
              // label="Live Key"
              placeholder={
                !viewLive
                  ? `${live ? live?.key.slice(0, 15) : ""}****************`
                  : `${live ? live?.key.slice(0, 50) : ""}....`
              }
            />
          </Group>

          <Group gap={28}>
            <Text fz={12} fw={400} c="var(--prune-text-gray-500)" w="20ch">
              Test Webhook URL:
            </Text>
            <TextInput
              flex={1}
              readOnly
              mt={30}
              classNames={{
                root: styles.root,
                input: styles.input,
                label: styles.label,
                section: styles.section,
              }}
              leftSectionPointerEvents="none"
              rightSection={
                <Flex gap={10}>
                  <UnstyledButton
                    onClick={() => setViewHook(!viewHook)}
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="#475467">
                      {viewHook ? "Hide" : "View"}
                    </Text>
                  </UnstyledButton>

                  <UnstyledButton
                    onClick={() => hookClipboard.copy(live?.key)}
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="#475467">
                      {hookClipboard.copied ? "Copied" : "Copy"}
                    </Text>
                  </UnstyledButton>
                </Flex>
              }
              // label="Live Key"
              placeholder={
                !viewHook
                  ? `${live ? live?.key.slice(0, 15) : ""}****************`
                  : `${live ? live?.key.slice(0, 50) : ""}....`
              }
            />
          </Group>
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
