"use client";

import {
  Badge,
  Button,
  Flex,
  Group,
  Skeleton,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconAB2, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useClipboard } from "@mantine/hooks";
import Cookies from "js-cookie";

export default function Keys({
  business,
  loading,
}: {
  business: BusinessData | null;
  loading: boolean;
}) {
  const [keys, setKeys] = useState<Key[]>([]);
  const params = useParams<{ id: string }>();
  const clipboard = useClipboard({ timeout: 500 });
  const { handleError } = useNotification();

  const { live, test } = useMemo(() => {
    const live = keys.find((key) => key.staging === "LIVE");
    const test = keys.find((key) => key.staging === "TEST");

    return { live, test };
  }, [keys]);

  const [viewLive, setViewLive] = useState(false);
  const [viewTest, setViewTest] = useState(false);

  const fetchBusinessSecrets = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${params.id}/secrets`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setKeys(data.data);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  useEffect(() => {
    fetchBusinessSecrets();
  }, []);

  return (
    <div className={styles.business__tab}>
      <Flex className={styles.api__container} gap={40}>
        <Flex flex={1} className={styles.api__key} direction="column">
          {/* <Badge
            leftSection={<IconInfoCircle />}
            tt="inherit"
            color="#D92D20"
            variant="light"
            radius={0}
            h={32}
          >
            Please do not use your test keys for production. They are only for
            test.
          </Badge> */}

          <KeyComponent keyString={test?.key} keyType="Test Key" />

          {live && live.key && (
            <KeyComponent keyString={live?.key} keyType="Live Key" />
          )}

          {/* <KeyComponent keyString={live?.key} keyType="Test Webhook URL" /> */}
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
    </div>
  );
}

interface Key {
  id: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  staging: string;
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
    <Group gap={28}>
      <Text fz={12} fw={400} c="var(--prune-text-gray-500)" w="20ch">
        {keyType}
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
              onClick={() => setView(!view)}
              className={styles.input__right__section}
            >
              <Text fw={600} fz={10} c="#475467">
                {!view ? "View" : "Hide"}
              </Text>
            </UnstyledButton>

            <Tooltip label="No key found" withArrow disabled={!!keyString}>
              <UnstyledButton
                onClick={() => clipboard.copy(keyString)}
                className={styles.input__right__section}
                style={{ cursor: !keyString ? "not-allowed" : "pointer" }}
                disabled={!keyString}
              >
                <Text fw={600} fz={10} c="#475467">
                  {clipboard.copied ? "Copied" : "Copy"}
                </Text>
              </UnstyledButton>
            </Tooltip>
          </Flex>
        }
        // label="Test Key"
        placeholder={
          !view
            ? `${keyString ? keyString.slice(0, 15) : ""}****************`
            : `${keyString ? keyString.slice(0, 50) : ""}....`
        }
      />
    </Group>
  );
};
