"use client";
import Cookies from "js-cookie";

import { Button, Flex, Grid, GridCol, Text, TextInput } from "@mantine/core";
import { IconPencilMinus } from "@tabler/icons-react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState } from "react";
import { useForm } from "@mantine/form";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

export default function Business({
  business,
  revalidate,
}: {
  business: BusinessData;
  revalidate: () => void;
}) {
  const [editingTop, setEditingTop] = useState(false);
  const [editingBottom, setEditingBottom] = useState(false);

  const { handleSuccess, handleError } = useNotification();

  const initialValues = {
    name: business.name,
    domain: business.domain,
    country: business.country,
    contactNumber: business.contactNumber,
    contactEmail: business.contactEmail,
    address: business.address,
    legalEntity: business.legalEntity,
  };

  const form = useForm({
    initialValues,
    // validate: zodResolver(validateNewBusiness),
  });

  const handleBusinessUpdate = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          ...form.values,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess("Business Updated", "");
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  return (
    <div className={styles.business__tab}>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Basic Information
          </Text>
          {!editingTop ? (
            <Button
              onClick={() => setEditingTop(true)}
              leftSection={<IconPencilMinus color="#475467" size={14} />}
              className={styles.edit}
            >
              Edit
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleBusinessUpdate();
                setEditingTop(false);
              }}
              // className={styles.edit}
              variant="filled"
              color="#D4F307"
              style={{ fontSize: "10px", color: "#475467" }}
            >
              Save Changes
            </Button>
          )}
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Business Name"
              placeholder={business?.name}
              {...form.getInputProps("name")}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Country of Origin"
              placeholder={business?.country || ""}
              {...form.getInputProps("country")}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Legal Entity"
              placeholder={business?.legalEntity || ""}
              {...form.getInputProps("legalEntity")}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Business Address"
              placeholder={business?.address || ""}
              {...form.getInputProps("address")}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Domain"
              placeholder={business?.domain}
              {...form.getInputProps("domain")}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
                root: styles.input__root,
              }}
              label="Pricing Plan"
              placeholder="Standard"
              rightSection={
                <Text fz={10} fw={600}>
                  Expires 24th Jul, 2024
                </Text>
              }
              rightSectionPointerEvents="none"
            />
          </GridCol>
        </Grid>
      </div>

      <div className={styles.bottom__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Contact Information
          </Text>
          {editingBottom ? (
            <Button
              onClick={() => {
                handleBusinessUpdate();
                setEditingBottom(false);
              }}
              // className={styles.edit}
              variant="filled"
              color="#D4F307"
              style={{ fontSize: "10px", color: "#475467" }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={() => setEditingBottom(true)}
              leftSection={<IconPencilMinus color="#475467" size={14} />}
              className={styles.edit}
            >
              Edit
            </Button>
          )}
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingBottom}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Phone Number"
              placeholder={business?.contactNumber || ""}
              {...form.getInputProps("contactNumber")}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingBottom}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Email"
              placeholder={business?.contactEmail}
              {...form.getInputProps("contactEmail")}
            />
          </GridCol>
        </Grid>
      </div>
    </div>
  );
}
