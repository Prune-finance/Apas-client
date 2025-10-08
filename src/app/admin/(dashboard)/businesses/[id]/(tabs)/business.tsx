"use client";

import {
  Checkbox,
  Flex,
  Grid,
  GridCol,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconPencilMinus } from "@tabler/icons-react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import {
  BusinessData,
  Service,
  ServiceIdentifier,
  SingleBizMeta,
} from "@/lib/hooks/businesses";
import { useState } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { usePricingPlan } from "@/lib/hooks/pricing-plan";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { BasicInfoType } from "@/lib/schema";
import { ContactDocumentTextInput } from "./utils";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import createAxiosInstance from "@/lib/axios";
import { useDisclosure } from "@mantine/hooks";

dayjs.extend(advancedFormat);

export default function Business({
  business,
  revalidate,
  services,
  revalidateServices,
  meta,
}: {
  business: BusinessData;
  revalidate: () => void;
  revalidateServices: () => Promise<void>;
  services: Service[];
  meta: SingleBizMeta | null;
}) {
  const axios = createAxiosInstance("auth");
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
    businessBio: business.businessBio,
    contactFirstName: business.contactFirstName,
    contactLastName: business.contactLastName,
    contactIdType: business.contactIdType,
    contactIdUrl: business.contactIdUrl,
    contactIdUrlBack: business.contactIdUrlBack,
    contactPOAType: business.contactPOAType,
    contactPOAUrl: business.contactPOAUrl,
    tradingName: business.tradingName,
    // documents: business.documents,
  };

  const form = useForm({
    initialValues,
    // validate: zodResolver(validateNewBusiness),
  });

  const handleBusinessUpdate = async () => {
    try {
      await axios.patch(`/admin/company/${business.id}`, {
        // ...business,
        ...form.values,
      });

      handleSuccess("Business Updated", "");
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  return (
    <div className={styles.business__tab}>
      <BasicInformation
        form={form as unknown as UseFormReturnType<BasicInfoType>}
        handleBusinessUpdate={handleBusinessUpdate}
        business={business}
      />

      <ContactInfo
        form={form as unknown as UseFormReturnType<BasicInfoType>}
        handleBusinessUpdate={handleBusinessUpdate}
        business={business}
        meta={meta}
      />

      <Services
        services={services}
        businessId={business.id}
        revalidate={revalidateServices}
      />

      <BusinessBio
        form={form as unknown as UseFormReturnType<BasicInfoType>}
        handleBusinessUpdate={handleBusinessUpdate}
        business={business}
      />
    </div>
  );
}

interface NewBusinessType {
  name: string;
  domain: string;
  country: string;
  contactNumber: string;
  contactEmail: string;
  address: string;
  legalEntity: string;
  pricingPlanId: string | null;
  businessBio: string | null;
}

interface IProps {
  business: BusinessData;
  form: UseFormReturnType<BasicInfoType>;
  handleBusinessUpdate: () => Promise<void>;
  meta?: SingleBizMeta | null;
}

const BasicInformation = ({ business, form, handleBusinessUpdate }: IProps) => {
  const [editingTop, setEditingTop] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { pricingPlan } = usePricingPlan();
  const pricingPlanOptions = pricingPlan.map((plan) => ({
    label: plan.name,
    value: plan.id,
  }));

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      await handleBusinessUpdate();
      setEditingTop(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
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
                handleSubmit();
              }}
              loading={processing}
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
            label="Legal Business Name"
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
            label="Trading Name"
            placeholder={business?.tradingName}
            {...form.getInputProps("tradingName")}
          />
        </GridCol>

        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editingTop}
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            label="Country"
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
            label="Type"
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
  );
};

const ContactInfo = ({
  form,
  business,
  handleBusinessUpdate,
  meta,
}: IProps) => {
  const [editingBottom, setEditingBottom] = useState(false);
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);

  const { handleError, handleSuccess } = useNotification();

  const axios = createAxiosInstance("auth");

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      await handleBusinessUpdate();
      setEditingBottom(false);
    } finally {
      setProcessing(false);
    }
  };

  const addBusinessUser = async () => {
    if (!email) return;
    setProcessing(true);

    try {
      await axios.post(`/admin/company/${business.id}/users/add`, { email });

      toggle();
      handleSuccess(
        `Successful! User Added`,
        `User added to ${business?.name} successfully`
      );
      setEmail("");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };
  console.log(meta);

  return (
    <div className={styles.bottom__container}>
      <Flex justify="space-between" align="center">
        <Text fz={12} fw={600} tt="uppercase">
          Contact Person Information
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
                handleSubmit();
              }}
              loading={processing}
            />
          </Group>
        ) : (
          <Group pos="relative">
            {Boolean(meta?.activationLinkCount) && !Boolean(meta?.users) && (
              <Popover
                position="bottom"
                // offset={23}
                withinPortal={false}
                trapFocus
                width={300}
                withArrow
                shadow="md"
                opened={opened}
                offset={{ mainAxis: 10, crossAxis: 0 }}
              >
                <PopoverTarget>
                  <PrimaryBtn
                    text="Send Activation Link to alternate email"
                    // action={() => setEditingBottom(true)}
                    variant="light"
                    td="underline"
                    c="var(--prune-primary-800)"
                    type="button"
                    action={toggle}
                  />
                </PopoverTarget>

                <PopoverDropdown top={40}>
                  <Stack>
                    <TextInput
                      label="Email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                    <PrimaryBtn
                      text="Submit"
                      action={addBusinessUser}
                      loading={processing}
                    />
                  </Stack>
                </PopoverDropdown>
              </Popover>
            )}

            <SecondaryBtn
              text="Edit"
              icon={IconPencilMinus}
              action={() => setEditingBottom(true)}
            />
          </Group>
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
            label="First Name"
            placeholder={business?.contactFirstName || ""}
            {...form.getInputProps("contactFirstName")}
          />
        </GridCol>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editingBottom}
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            label="Last Name"
            placeholder={business?.contactLastName || ""}
            {...form.getInputProps("contactLastName")}
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
          <ContactDocumentTextInput
            editing={editingBottom}
            form={form}
            formKey="contactIdType"
            documentKey="contactIdUrl"
            label="Identity Type"
            title={business.contactIdType}
            business={business as BasicInfoType}
          />
        </GridCol>

        {form.values.contactIdType !== "Passport" && (
          <GridCol span={4} className={styles.grid}>
            <ContactDocumentTextInput
              editing={editingBottom}
              form={form}
              formKey="contactIdType"
              documentKey="contactIdUrlBack"
              label="Identity Type (Back)"
              title={business.contactIdType}
              business={business as BasicInfoType}
            />
          </GridCol>
        )}

        <GridCol span={4} className={styles.grid}>
          <ContactDocumentTextInput
            editing={editingBottom}
            form={form}
            formKey="contactPOAType"
            documentKey="contactPOAUrl"
            label="Proof of Address"
            title={business.contactPOAType}
            business={business as BasicInfoType}
          />
        </GridCol>

        {business.contactSignup && (
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              // w={324}
              label="Date & Time of Activation"
              placeholder={dayjs(business.contactSignup).format(
                "Do MMMM, YYYY - hh:mm A"
              )}
              // {...form.getInputProps("contactEmail")}
            />
          </GridCol>
        )}
      </Grid>
    </div>
  );
};

const BusinessBio = ({ business, form, handleBusinessUpdate }: IProps) => {
  const [editingBizInfo, setEditingBizInfo] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      await handleBusinessUpdate();
      setEditingBizInfo(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
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
                handleSubmit();
              }}
              loading={processing}
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
  );
};

const Services = ({
  services,
  businessId,
  revalidate,
}: {
  services: Service[];
  businessId: string;
  revalidate: () => Promise<void>;
}) => {
  const { handleError, handleSuccess } = useNotification();
  const axios = createAxiosInstance("auth");
  const [serviceId, setServiceId] = useState<ServiceIdentifier | null>(null);
  const handleServiceChange = async (service: Service) => {
    try {
      await axios.post(
        `/admin/service/${service.id}/company/${businessId}/toggle`,
        {}
      );

      await revalidate();

      handleSuccess(
        `${service.title} Toggled`,
        `This service has been successfully ${
          service.active ? "disabled" : "enabled"
        }`
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setServiceId(null);
    }
  };

  return (
    <div className={styles.bottom__container}>
      <Text fz={12} fw={600} tt="uppercase">
        Services
      </Text>

      <Grid mt={20} className={styles.grid__container}>
        {services.map((service) => (
          <GridCol span={4} className={styles.grid} key={service.id}>
            <Checkbox
              label={service.title}
              checked={
                service.serviceIdentifier === "ACCOUNT_SERVICE"
                  ? true
                  : service.active
              }
              onChange={() => {
                setServiceId(service.serviceIdentifier);
                service.serviceIdentifier === "LIVE_MODE_SERVICE"
                  ? handleServiceChange(service)
                  : handleServiceChange(service);
              }}
              disabled={serviceId === service.serviceIdentifier}
              // indeterminate={serviceId === service.serviceIdentifier}
              color="var(--prune-primary-700)"
              classNames={{
                root: styles.input,
                label: styles.label,
              }}
              styles={{
                root: {
                  padding: "12px 16px",
                },
              }}
            />
          </GridCol>
        ))}
        {/* <GridCol span={4} className={styles.grid}>
          <Checkbox
            label={"Account Service"}
            // checked={true}
            // onChange={() => handleServiceChange("service.id")}
            classNames={{
              root: styles.input,
              label: styles.label,
            }}
            styles={{
              root: {
                padding: "12px 16px",
              },
            }}
          />
        </GridCol> */}
      </Grid>
    </div>
  );
};
