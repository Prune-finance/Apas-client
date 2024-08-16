"use client";
import Cookies from "js-cookie";

import Image from "next/image";
import {
  Badge,
  Button,
  Group,
  Skeleton,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
  IconArrowLeft,
  IconBuildingSkyscraper,
  IconCurrencyEuro,
  IconDownload,
  IconFiles,
  IconKey,
  IconPointFilled,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

import ActiveBadge from "@/assets/active-badge.svg";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/singlebusiness.module.scss";

import Business from "./(tabs)/business";
import Documents from "./(tabs)/documents";
import Directors from "./(tabs)/directors";
import Shareholders from "./(tabs)/shareholder";
import Accounts from "./(tabs)/accounts";
import Keys from "./(tabs)/keys";

import { useSingleBusiness } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import { useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { activeBadgeColor } from "@/lib/utils";

export default function SingleBusiness() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { loading, business, revalidate } = useSingleBusiness(params.id);

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab")?.toLowerCase() || "business";

  const { handleSuccess, handleError } = useNotification();
  const [processingLink, setProcessingLink] = useState(false);
  const [processingActive, setProcessingActive] = useState(false);

  const handleBusinessTrust = async () => {
    try {
      const currentState = business?.kycTrusted;

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/kyc/${params.id}`,
        { trustKyc: !currentState },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      handleSuccess(
        "Action Completed",
        `This business is ${currentState ? "not trusted" : "now trusted"}`
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  const sendActivationLink = async () => {
    setProcessingLink(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/registration-link`,
        { email: business?.contactEmail, companyId: business?.id },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess("Action Completed", `Activation Link sent`);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingLink(false);
    }
  };

  const toggleBusinessActivation = async () => {
    setProcessingActive(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${params.id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess("Action Completed", `Company status updated`);
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingActive(false);
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },

          {
            title: `${business?.name}`,
            href: `/admin/businesses/${params.id}`,
            loading: loading,
          },
        ]}
      />

      <div className={styles.page__container}>
        <Group gap={8} mb={24}>
          <UnstyledButton onClick={router.back}>
            <ThemeIcon variant="transparent" radius="lg">
              <IconArrowLeft
                color="#1D2939"
                style={{ width: "70%", height: "70%" }}
              />
            </ThemeIcon>
          </UnstyledButton>

          <Text fz={14} c="var(--prune-text-gray-500)" fw={400}>
            Business
          </Text>
        </Group>
        <div className={styles.container__header}>
          <div className={styles.header__left}>
            {business ? (
              <Text fz={18} fw={600}>
                {business.name}
              </Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}

            {business?.kycTrusted && (
              <Image
                width={20}
                height={20}
                src={ActiveBadge}
                alt="active badge"
              />
            )}

            {business && (
              <Badge
                tt="capitalize"
                variant="light"
                color={activeBadgeColor(business.companyStatus)}
                w={82}
                h={24}
                fw={400}
                fz={12}
              >
                {business.companyStatus.toLowerCase()}
              </Badge>
            )}
          </div>

          <div className={styles.header__right}>
            <Button size="xs" className={styles.header__right__cta}>
              <IconDownload color="#344054" stroke={2} size={16} />
            </Button>

            {business?.companyStatus && (
              <Button
                // className={styles.header__cta}
                radius={4}
                variant="filled"
                color="#f6f6f6"
                c="var(--prune-text-gray-700)"
                fz={12}
                h={32}
                onClick={toggleBusinessActivation}
                loading={processingActive}
                style={{ border: "1px solid var(--prune-text-gray-200)" }}
              >
                {business?.companyStatus === "ACTIVE"
                  ? "Deactivate"
                  : "Activate"}
              </Button>
            )}

            <div className={styles.biz_trust}>
              <Text fw={600} fz={12} className={styles.biz__trust__text}>
                Trust this business
              </Text>
              {!loading && (
                <Switch
                  defaultChecked={business?.kycTrusted}
                  onChange={handleBusinessTrust}
                  // color="rgba(212, 243, 7)"
                  color="var(--prune-success-500)"
                  size="xs"
                />
              )}
            </div>

            <Button
              // className={styles.header__cta}
              variant="filled"
              color="var(--prune-primary-600)"
              onClick={sendActivationLink}
              loading={processingLink}
              radius={4}
              fz={12}
              h={32}
              c="var(--prune-text-gray-700)"
            >
              Send Activation Link
            </Button>
          </div>
        </div>

        <div className={styles.container__body}>
          <Tabs
            defaultValue={tab}
            variant="pills"
            classNames={{
              root: styles.tabs,
              list: styles.tabs__list,
              tab: styles.tab,
            }}
          >
            <TabsList>
              {tabs.map((tab) => (
                <TabsTab
                  key={tab.value}
                  value={tab.value}
                  leftSection={<tab.icon size={14} />}
                  tt="capitalize"
                >
                  {tab.title || tab.value}
                </TabsTab>
              ))}
            </TabsList>

            <TabsPanel value="business">
              {business && (
                <Business business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="documents">
              {business && (
                <Documents business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="directors">
              {business && (
                <Directors business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="shareholders">
              {business && (
                <Shareholders business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="accounts">
              <Accounts business={business} />
            </TabsPanel>

            <TabsPanel value="keys">
              <Keys business={business} />
            </TabsPanel>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

const tabs = [
  {
    title: "Business Information",
    value: "business",
    icon: IconBuildingSkyscraper,
  },
  { value: "documents", icon: IconFiles },
  { value: "directors", icon: IconUsers },
  { title: "Key Shareholders", value: "shareholders", icon: IconUsersGroup },
  { value: "accounts", icon: IconCurrencyEuro },
  { title: "API Keys", value: "keys", icon: IconKey },
];
