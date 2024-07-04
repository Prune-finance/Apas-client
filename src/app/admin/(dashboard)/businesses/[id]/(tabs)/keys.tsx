"use client";

import { Button, Flex, Text, TextInput, UnstyledButton } from "@mantine/core";
import { IconAB2 } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";

export default function Keys({ business }: { business: BusinessData | null }) {
  const [keys, setKeys] = useState<Key[]>([]);
  const params = useParams<{ id: string }>();

  const { live, test } = useMemo(() => {
    const live = keys.find((key) => key.staging === "LIVE");
    const test = keys.find((key) => key.staging === "TEST");

    return { live, test };
  }, [keys]);

  const fetchBusinessSecrets = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${params.id}/secrets`
      );

      setKeys(data.data);
    } catch (error) {
      console.log(error);
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
            0
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

            <Flex gap={10}>
              <Button
                leftSection={<IconAB2 color="#475467" size={14} />}
                className={styles.edit}
              >
                Reset
              </Button>
            </Flex>
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
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>

                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    Copy
                  </Text>
                </UnstyledButton>
              </Flex>
            }
            label="Test Key"
            placeholder={`${
              test ? test?.key.slice(0, 15) : ""
            }****************`}
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
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>

                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    Copy
                  </Text>
                </UnstyledButton>
              </Flex>
            }
            label="Live Key"
            placeholder={`${
              live ? live?.key.slice(0, 15) : ""
            }****************`}
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
