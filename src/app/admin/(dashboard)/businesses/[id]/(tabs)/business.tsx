"use client";
import Cookies from "js-cookie";

import {
  Button,
  Flex,
  Grid,
  GridCol,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconPencilMinus } from "@tabler/icons-react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState } from "react";
import { useForm } from "@mantine/form";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { usePricingPlan } from "@/lib/hooks/pricing-plan";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

export default function Business({
  business,
  revalidate,
}: {
  business: BusinessData;
  revalidate: () => void;
}) {
  const [editingTop, setEditingTop] = useState(false);
  const [editingBottom, setEditingBottom] = useState(false);
  const [editingBizInfo, setEditingBizInfo] = useState(false);

  const { pricingPlan } = usePricingPlan();
  const pricingPlanOptions = pricingPlan.map((plan) => ({
    label: plan.name,
    value: plan.id,
  }));

  const { handleSuccess, handleError } = useNotification();

  const initialValues = {
    name: business.name,
    domain: business.domain,
    country: business.country,
    contactNumber: business.contactNumber,
    contactEmail: business.contactEmail,
    address: business.address,
    legalEntity: business.legalEntity,
    pricingPlanId: business.pricingPlanId,
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
            <SecondaryBtn
              text="Edit"
              icon={IconPencilMinus}
              action={() => setEditingTop(true)}
            />
          ) : (
            <Group>
              <SecondaryBtn
                text="Cancel"
                action={() => setEditingTop(false)}
                fz={10}
                fw={600}
              />

              <PrimaryBtn
                fz={10}
                fw={600}
                text="Save Changes"
                action={() => {
                  handleBusinessUpdate();
                  setEditingTop(false);
                }}
              />
            </Group>
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
            <Select
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
                root: styles.input__root,
              }}
              label="Pricing Plan"
              placeholder={business.pricingPlan?.name ?? "No pricing plan"}
              // rightSection={
              //   <Text fz={10} fw={600}>
              //     Expires 24th Jul, 2024
              //   </Text>
              // }
              // rightSectionPointerEvents="none"
              data={pricingPlanOptions}
              {...form.getInputProps("pricingPlanId")}
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
            <Group>
              <SecondaryBtn
                text="Cancel"
                action={() => setEditingBottom(false)}
                fz={10}
                fw={600}
              />

              <PrimaryBtn
                fz={10}
                fw={600}
                text="Save Changes"
                action={() => {
                  handleBusinessUpdate();
                  setEditingBottom(false);
                }}
              />
            </Group>
          ) : (
            <SecondaryBtn
              text="Edit"
              icon={IconPencilMinus}
              action={() => setEditingBottom(true)}
            />
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

      <div className={styles.bottom__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Business Bio
          </Text>
          {editingBizInfo ? (
            <Group>
              <SecondaryBtn
                text="Cancel"
                action={() => setEditingBizInfo(false)}
                fz={10}
                fw={600}
              />

              <PrimaryBtn
                fz={10}
                fw={600}
                text="Save Changes"
                action={() => {
                  handleBusinessUpdate();
                  setEditingBizInfo(false);
                }}
              />
            </Group>
          ) : (
            <SecondaryBtn
              icon={IconPencilMinus}
              text="Edit"
              action={() => setEditingBizInfo(true)}
            />
          )}
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={12} className={styles.grid}>
            <Textarea
              readOnly={!editingBizInfo}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              minRows={6}
              maxRows={6}
              autosize
              label="Business Bio"
              placeholder={business?.businessBio || ""}
              {...form.getInputProps("businessBio")}
            />
          </GridCol>
        </Grid>
      </div>
    </div>
  );
}
