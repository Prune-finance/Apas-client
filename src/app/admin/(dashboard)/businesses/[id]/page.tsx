"use client";

import Image from "next/image";
import {
  Button,
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
import { useParams, useRouter } from "next/navigation";
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

export default function SingleBusiness() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { loading, business, revalidate } = useSingleBusiness(params.id);

  const { handleSuccess, handleError } = useNotification();
  const [processingLink, setProcessingLink] = useState(false);
  const [processingActive, setProcessingActive] = useState(false);

  const handleBusinessTrust = async () => {
    try {
      const currentState = business?.kycTrusted;

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/kyc/${params.id}`,
        { trustKyc: !currentState },
        { withCredentials: true }
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
        { withCredentials: true }
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
        { withCredentials: true }
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
          ...(!loading
            ? [
                {
                  title: `${business?.name}`,
                  href: `/admin/businesses/${params.id}`,
                },
              ]
            : []),
        ]}
      />

      <div className={styles.page__container}>
        <div className={styles.container__header}>
          <div className={styles.header__left}>
            <UnstyledButton onClick={router.back}>
              <ThemeIcon color="rgba(212, 243, 7)" radius="lg">
                <IconArrowLeft
                  color="#1D2939"
                  style={{ width: "70%", height: "70%" }}
                />
              </ThemeIcon>
            </UnstyledButton>

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
              <div
                className={styles.business__status}
                style={{
                  background:
                    business?.companyStatus === "INACTIVE"
                      ? "#FFFAEB"
                      : "#ECFDF3",
                }}
              >
                {business?.companyStatus === "ACTIVE" ? (
                  <>
                    <IconPointFilled size={14} color="#12B76A" />
                    <Text tt="capitalize" fz={12} c="#12B76A">
                      Active
                    </Text>
                  </>
                ) : (
                  <>
                    <IconPointFilled size={14} color="#C6A700" />
                    <Text tt="capitalize" fz={12} c="#C6A700">
                      Inactive
                    </Text>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={styles.header__right}>
            {business?.companyStatus && (
              <Button
                className={styles.header__cta}
                variant="outline"
                color="#D0D5DD"
                onClick={toggleBusinessActivation}
                loading={processingActive}
              >
                {business?.companyStatus === "ACTIVE"
                  ? "Deactivate"
                  : "Activate"}
              </Button>
            )}

            <Button size="xs" className={styles.header__right__cta}>
              <IconDownload color="#344054" stroke={2} size={16} />
            </Button>

            <div className={styles.biz_trust}>
              <Text fw={600} fz={12} className={styles.biz__trust__text}>
                Trust this business
              </Text>
              {!loading && (
                <Switch
                  defaultChecked={business?.kycTrusted}
                  onChange={handleBusinessTrust}
                  color="rgba(212, 243, 7)"
                  size="xs"
                />
              )}
            </div>

            <Button
              className={styles.header__cta}
              variant="filled"
              color="#D4F307"
              onClick={sendActivationLink}
              loading={processingLink}
            >
              Send Activation Link
            </Button>
          </div>
        </div>

        <div className={styles.container__body}>
          <Tabs
            defaultValue="Business"
            variant="pills"
            classNames={{
              root: styles.tabs,
              list: styles.tabs__list,
              tab: styles.tab,
            }}
          >
            <TabsList>
              <TabsTab
                value="Business"
                leftSection={<IconBuildingSkyscraper size={14} />}
              >
                Business Information
              </TabsTab>
              <TabsTab value="Documents" leftSection={<IconFiles size={14} />}>
                Documents
              </TabsTab>
              <TabsTab value="Directors" leftSection={<IconUsers size={14} />}>
                Directors
              </TabsTab>
              <TabsTab
                value="Shareholders"
                leftSection={<IconUsersGroup size={14} />}
              >
                Key Shareholders
              </TabsTab>
              <TabsTab
                value="Accounts"
                leftSection={<IconCurrencyEuro size={14} />}
              >
                Accounts
              </TabsTab>
              <TabsTab
                className={styles.tab}
                value="Keys"
                leftSection={<IconKey size={14} />}
              >
                API Keys
              </TabsTab>
            </TabsList>

            <TabsPanel value="Business">
              {business && (
                <Business business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="Documents">
              {business && (
                <Documents business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="Directors">
              {business && (
                <Directors business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="Shareholders">
              {business && (
                <Shareholders business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="Accounts">
              <Accounts business={business} />
            </TabsPanel>

            <TabsPanel value="Keys">
              <Keys business={business} />
            </TabsPanel>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
