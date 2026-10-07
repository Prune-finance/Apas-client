"use client";

import {
  Button,
  Group,
  Skeleton,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from "@mantine/core";
import { useParams, useSearchParams } from "next/navigation";

import {
  IconBuildingSkyscraper,
  IconCurrencyEuro,
  IconDownload,
  IconFiles,
  IconKey,
  IconUsers,
  IconUsersGroup,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconShieldCheck,
  IconRosetteDiscountCheckFilled,
  IconCreditCardPay,
  IconPencilMinus,
} from "@tabler/icons-react";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/singlebusiness.module.scss";

import Business from "./(tabs)/business";
import Documents from "./(tabs)/documents";
import Directors from "./(tabs)/directors";
import Shareholders from "./(tabs)/shareholder";
import Accounts from "./(tabs)/accounts";
import Keys from "./(tabs)/keys";

import { useBusinessDetail, useBusinessServices } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import { useMemo, useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { BadgeComponent } from "@/ui/components/Badge";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { BackBtn, PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { Requests } from "./(tabs)/requests";
import createAxiosInstance from "@/lib/axios";
import ApplicationOverview from "./(tabs)/application-overview";


export default function SingleBusiness() {
  const params = useParams<{ id: string }>();
  const { loading, business: detail, revalidate } = useBusinessDetail(params.id);
  // detail.company is the BusinessData shape used by child tabs
  const business = detail?.company ?? null;
  const userCount = detail?.counts?.users ?? 0;
  const axios = createAxiosInstance("auth");
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab")?.toLowerCase() || "business";
  const backHref = searchParams.get("back") ?? "/admin/businesses";

  const { services, revalidate: revalidateServices } = useBusinessServices(
    params.id
  );

  const { handleSuccess, handleError } = useNotification();
  const [processingLink, setProcessingLink] = useState(false);
  const [processingActive, setProcessingActive] = useState(false);
  const [processingTrust, setProcessingTrust] = useState(false);
  const [processingAccounts, setProcessingAccounts] = useState(false);
  // const [trusted, setTrusted] = useState(business ? business.kycTrusted : false);

  const [activeTab, setActiveTab] = useState<string | null>(tab);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set([tab || "business"])
  );
  const [editingApplication, setEditingApplication] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [openedTrust, { open: openTrust, close: closeTrust }] =
    useDisclosure(false);

  const handleBusinessTrust = async () => {
    setProcessingTrust(true);
    try {
      const currentState = business?.kycTrusted;

      await axios.post(`/admin/company/kyc/${params.id}`, {
        trustKyc: !currentState,
      });

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
      await axios.post(`/admin/registration-link`, {
        email: business?.contactEmail,
        companyId: business?.id,
      });

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
        `/admin/business/${params.id}/account-issuance/enable`,
        {}
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
      await axios.post(`/admin/company/${params.id}/toggle-status`, {});

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
  }, [business?.kycTrusted]);

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },

          {
            title: `${business?.name ?? detail?.business?.businessName ?? ""}`,
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
        <BackBtn link={backHref} />
        <div className={styles.container__header}>
          <Group gap={8}>
            {business?.kycTrusted && (
              <IconRosetteDiscountCheckFilled
                size={25}
                color="var(--prune-primary-700)"
              />
            )}
            {detail ? (
              <Text fz={18} fw={600} tt="capitalize">
                {business?.name ?? detail?.business?.businessName}
              </Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}

            {loading ? (
              <Skeleton h={10} w={100} />
            ) : business ? (
              <BadgeComponent status={business.companyStatus} active />
            ) : detail?.applicationStatus ? (
              <BadgeComponent status={detail.applicationStatus} active />
            ) : null}
          </Group>

          {activeTab === "business" && detail?.type === "ONBOARDING_APPLICATION" && (
            <div className={styles.header__right}>
              <SecondaryBtn
                text="Edit"
                icon={IconPencilMinus}
                action={() => setEditingApplication(true)}
              />
            </div>
          )}

          {activeTab === "business" && detail?.type === "COMPANY" && (
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
                  {Boolean(userCount) ? (
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
                      text="Send Activation Link"
                      action={sendActivationLink}
                      radius={4}
                      loading={processingLink}
                      h={32}
                      fw={600}
                    />
                  )}
                </>
              )}

              {/* <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <PrimaryBtn text="Activate with Alt Email" fw={600} />
                </Popover.Target>

                <Popover.Dropdown>
                  <Text>Activate with Alt Email</Text>
                </Popover.Dropdown>
              </Popover> */}
            </div>
          )}
        </div>

        <div className={styles.container__body}>
          <Tabs
            onChange={(e) => {
              setActiveTab(e);
              if (e) setVisitedTabs((prev) => new Set(Array.from(prev).concat(e)));
              window.history.pushState({}, "", `?tab=${e}`);
            }}
            defaultValue={
              tabs.find((_tab) => _tab.value === tab)?.value || "business"
            }
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
              {visitedTabs.has("business") && (
                <>
                  {detail?.type === "ONBOARDING_APPLICATION" && detail ? (
                    <ApplicationOverview
                      detail={detail}
                      revalidate={revalidate}
                      editing={editingApplication}
                      onEditingChange={setEditingApplication}
                    />
                  ) : (
                    business && (
                      <Business
                        business={business}
                        revalidate={revalidate}
                        services={services}
                        revalidateServices={revalidateServices}
                      />
                    )
                  )}
                </>
              )}
            </TabsPanel>

            <TabsPanel value="documents">
              {visitedTabs.has("documents") && business && (
                <Documents business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="directors">
              {visitedTabs.has("directors") && business && (
                <Directors business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="shareholders">
              {visitedTabs.has("shareholders") && business && (
                <Shareholders business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="accounts">
              {visitedTabs.has("accounts") && (
                <Accounts business={business} />
              )}
            </TabsPanel>

            <TabsPanel value="keys">
              {visitedTabs.has("keys") && (
                <Keys business={business} loading={loading} />
              )}
            </TabsPanel>

            <TabsPanel value="requests">
              {visitedTabs.has("requests") && (
                <Requests business={business} />
              )}
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
