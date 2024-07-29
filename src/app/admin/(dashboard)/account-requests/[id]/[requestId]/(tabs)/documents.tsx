"use client";

import {
  Button,
  Flex,
  Grid,
  GridCol,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconJpg,
  IconPdf,
  IconPencilMinus,
  IconPlus,
} from "@tabler/icons-react";

import styles from "@/ui/styles/singlebusiness.module.scss";

export default function Documents() {
  return (
    <div className={styles.document__tab}>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Documents
          </Text>
          <Button
            leftSection={<IconPencilMinus color="#475467" size={14} />}
            className={styles.edit}
          >
            Edit
          </Button>
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
                section: styles.section,
              }}
              leftSection={<IconPdf />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="CAC Document"
              placeholder="CAC-doc.pdf"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              leftSection={<IconJpg />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="Directors"
              placeholder="Dir-backup-img.jpg"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              leftSection={<IconJpg />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="Shareholders"
              placeholder="sharhld.jpg"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              leftSection={<IconPdf />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="MerMat Document"
              placeholder="File.pdf"
            />
          </GridCol>
        </Grid>
      </div>

      <UnstyledButton mt={20}>
        <Flex align="center">
          <div className={styles.add__new__container}>
            <IconPlus color="#344054" size={14} />
          </div>
          <Text ml={8} fz={12}>
            Add New
          </Text>
        </Flex>
      </UnstyledButton>
    </div>
  );
}
