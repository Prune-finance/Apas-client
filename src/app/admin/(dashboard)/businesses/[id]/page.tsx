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
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconShieldCheck,
  IconRosetteDiscountCheckFilled,
  IconCreditCardPay,
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

import { useBusinessServices, useSingleBusiness } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import { useEffect, useMemo, useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { activeBadgeColor } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { useDisclosure, useInterval } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { BackBtn, PrimaryBtn } from "@/ui/components/Buttons";
import { Requests } from "./(tabs)/requests";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { notifications } from "@mantine/notifications";

dayjs.extend(duration);

export default function SingleBusiness() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { loading, business, revalidate, meta } = useSingleBusiness(params.id);

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab")?.toLowerCase() || "business";

  const { services, revalidate: revalidateServices } = useBusinessServices(
    params.id
  );

  const { handleSuccess, handleError, handleInfo } = useNotification();
  const [processingLink, setProcessingLink] = useState(false);
  const [processingActive, setProcessingActive] = useState(false);
  const [processingTrust, setProcessingTrust] = useState(false);
  const [processingAccounts, setProcessingAccounts] = useState(false);
  // const [trusted, setTrusted] = useState(business ? business.kycTrusted : false);

  const [activeTab, setActiveTab] = useState<string | null>(tab);

  const [opened, { open, close }] = useDisclosure(false);
  const [openedTrust, { open: openTrust, close: closeTrust }] =
    useDisclosure(false);

  const handleBusinessTrust = async () => {
    setProcessingTrust(true);
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
      closeTrust();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingTrust(false);
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
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingLink(false);
    }
  };

  const enableIssuedAccount = async () => {
    setProcessingAccounts(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/business/${params.id}/account-issuance/enable`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess(
        "Successful",
        `You have successfully enabled issued accounts service for this business.`
      );
      revalidate();
      revalidateServices();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingAccounts(false);
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
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingActive(false);
    }
  };
  const { activateTitle, activateText } = useMemo(() => {
    switch (business?.companyStatus) {
      case "ACTIVE":
        return {
          activateTitle: "Deactivate This Business?",
          activateText:
            "Are you sure you want to deactivate this business? This will render this business inactive and will not be able to receive new transactions.",
        };
      default:
        return {
          activateTitle: "Activate This Business?",
          activateText:
            "Are you sure you want to activate this business? This will render this business active and will be able to receive new transactions.",
        };
    }
  }, [business?.companyStatus]);

  const { trustTitle, trustText } = useMemo(() => {
    switch (business?.kycTrusted) {
      case true:
        return {
          trustTitle: "Untrust This Business?",
          trustText: "Are you sure you want to mark this business as trusted?",
        };
      default:
        return {
          trustTitle: "Trust This Business?",
          trustText: "Are you sure you want to mark this business as trusted? ",
        };
    }
  }, [business?.companyStatus]);

  const activationLinkExpiringTime = dayjs(
    meta?.activeActivationLink && meta?.activeActivationLink.createdAt
  ).add(72, "h");
  const isAfterExpiringTime = dayjs().isAfter(activationLinkExpiringTime);

  const [remainingTime, setRemainingTime] = useState(
    activationLinkExpiringTime.diff(dayjs(), "second")
  );

  const interval = useInterval(() => {
    const now = dayjs();
    const diffInSeconds = activationLinkExpiringTime.diff(now, "second");
    if (diffInSeconds >= 0) {
      setRemainingTime(diffInSeconds);
    } else {
      interval.stop(); // Stop the interval when time is up
    }
  }, 1000);

  useEffect(() => {
    if (meta && meta?.activationLinkCount > 0 && remainingTime > 0) {
      interval.start(); // Start the interval if there's a valid link and time left
    }

    return () => interval.stop(); // Clean up interval on unmount
  }, [meta?.activationLinkCount, remainingTime]);

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
        {/* <Group gap={8} mb={24}>
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
        </Group> */}
        <BackBtn text="Business" />
        <div className={styles.container__header}>
          <Group gap={8}>
            {business?.kycTrusted && (
              <IconRosetteDiscountCheckFilled
                size={25}
                color="var(--prune-primary-700)"
              />
            )}
            {business ? (
              <Text fz={18} fw={600}>
                {business.name}
              </Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}

            {business ? (
              <BadgeComponent status={business.companyStatus} active />
            ) : (
              <Skeleton h={10} w={100} />
            )}
          </Group>

          {activeTab === "business" && (
            <div className={styles.header__right}>
              <Button size="xs" className={styles.header__right__cta}>
                <IconDownload color="#344054" stroke={2} size={16} />
              </Button>

              {business?.companyStatus && (
                <PrimaryBtn
                  text={
                    business?.companyStatus === "ACTIVE"
                      ? "Deactivate"
                      : "Activate"
                  }
                  action={open}
                  color="#f6f6f6"
                  c="var(--prune-text-gray-700)"
                  fz={12}
                  fw={600}
                  h={32}
                  radius={4}
                />
              )}

              <Button
                onClick={openTrust}
                color="#f6f6f6"
                c="var(--prune-text-gray-700)"
                fz={12}
                fw={600}
                h={32}
                radius={4}
              >
                <Switch
                  label="Trust this business"
                  checked={business?.kycTrusted}
                  labelPosition="left"
                  fz={12}
                  size="xs"
                  color="var(--prune-success-500)"
                />
              </Button>

              {loading ? (
                <Skeleton h={30} w={100} />
              ) : (
                <>
                  {Boolean(meta?.users) ? (
                    <>
                      {!services.find(
                        (service) =>
                          service.serviceIdentifier === "ISSUED_ACCOUNT_SERVICE"
                      )?.active && (
                        <PrimaryBtn
                          text="Enable Issued Accounts"
                          action={enableIssuedAccount}
                          radius={4}
                          loading={processingAccounts}
                          h={32}
                          fw={600}
                        />
                      )}
                    </>
                  ) : (
                    <PrimaryBtn
                      text={
                        Boolean(meta?.activationLinkCount)
                          ? isAfterExpiringTime
                            ? "Resend Activation Link"
                            : `Link Expires in ${dayjs
                                .duration(remainingTime, "seconds")
                                .format("HH:mm:ss")}`
                          : "Send Activation Link"
                      }
                      action={() => {
                        remainingTime > 0
                          ? () => {
                              notifications.clean();
                              handleInfo(
                                "A valid activation link has been sent to the business",
                                ""
                              );
                            }
                          : sendActivationLink();
                      }}
                      radius={4}
                      loading={processingLink}
                      h={32}
                      fw={600}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.container__body}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
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
              <Keys business={business} loading={loading} />
            </TabsPanel>

            <TabsPanel value="requests">
              <Requests business={business} />
            </TabsPanel>
          </Tabs>
        </div>
      </div>

      <ModalComponent
        opened={opened}
        close={close}
        title={activateTitle}
        text={activateText}
        action={toggleBusinessActivation}
        icon={
          business?.companyStatus === "ACTIVE" ? (
            <IconX color="#D92D20" />
          ) : (
            <IconCheck color="#12B76A" />
          )
        }
        processing={processingActive}
        color={
          business?.companyStatus === "ACTIVE"
            ? "hsl(from var(--prune-warning) h s l / .1)"
            : "#ECFDF3"
        }
      />

      <ModalComponent
        opened={openedTrust}
        close={closeTrust}
        title={trustTitle}
        text={trustText}
        action={handleBusinessTrust}
        icon={
          business?.kycTrusted ? (
            <IconAlertTriangle color="#D92D20" />
          ) : (
            <IconShieldCheck color="#12B76A" />
          )
        }
        processing={processingTrust}
        color={
          business?.kycTrusted
            ? "hsl(from var(--prune-warning) h s l / .1)"
            : "#ECFDF3"
        }
      />
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
  { value: "requests", icon: IconCreditCardPay },
];
