"use client";

import { Button, Flex, Text, TextInput, UnstyledButton } from "@mantine/core";
import { IconAB2 } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useClipboard } from "@mantine/hooks";

export default function Keys({ business }: { business: BusinessData | null }) {
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${params.id}/secrets`
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
      <Flex className={styles.api__container} gap={20}>
        <Flex h="fit-content" className={styles.api__calls} direction="column">
          <Text tt="uppercase" fz={10} className="grey-600">
            Total Api Calls
          </Text>

          <Text mt={16} fz={24} className="primary-700">
            {business?.apiCalls}
          </Text>

          <Text mt={24} fz={10} className="grey-500">
            Total API calls made in the system
          </Text>
        </Flex>

        <Flex flex={1} className={styles.api__key} direction="column">
          <Flex justify="space-between" align="center">
            <Text fz={12} fw={600} tt="uppercase">
              API KEYS
            </Text>

            {/* <Flex gap={10}>
              <Button
                leftSection={<IconAB2 color="#475467" size={14} />}
                className={styles.edit}
              >
                Reset
              </Button>
            </Flex> */}
          </Flex>

          <TextInput
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
                  <Text fw={600} fz={10} c="##475467">
                    {!viewTest ? "View" : "Hide"}
                  </Text>
                </UnstyledButton>

                <UnstyledButton
                  onClick={() => clipboard.copy(test?.key)}
                  className={styles.input__right__section}
                >
                  <Text fw={600} fz={10} c="##475467">
                    {clipboard.copied ? "Copied" : "Copy"}
                  </Text>
                </UnstyledButton>
              </Flex>
            }
            label="Test Key"
            placeholder={
              !viewTest
                ? `${test ? test?.key.slice(0, 15) : ""}****************`
                : `${test ? test?.key.slice(0, 50) : ""}....`
            }
          />

          <TextInput
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
                  <Text fw={600} fz={10} c="##475467">
                    {viewLive ? "Hide" : "View"}
                  </Text>
                </UnstyledButton>

                <UnstyledButton
                  onClick={() => clipboard.copy(live?.key)}
                  className={styles.input__right__section}
                >
                  <Text fw={600} fz={10} c="##475467">
                    {clipboard.copied ? "Copied" : "Copy"}
                  </Text>
                </UnstyledButton>
              </Flex>
            }
            label="Live Key"
            placeholder={
              !viewLive
                ? `${live ? live?.key.slice(0, 15) : ""}****************`
                : `${live ? live?.key.slice(0, 50) : ""}....`
            }
          />
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
