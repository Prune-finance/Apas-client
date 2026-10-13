"use client";

import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Radio,
  Skeleton,
  Stack,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
} from "@mantine/core";
import { useParams, useRouter, useSearchParams } from "next/navigation";

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
  IconUserStar,
} from "@tabler/icons-react";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/singlebusiness.module.scss";

import Business from "../../../businesses/[id]/(tabs)/business";
import Documents from "../../../businesses/[id]/(tabs)/documents";
import Directors from "../../../businesses/[id]/(tabs)/directors";
import Shareholders from "../../../businesses/[id]/(tabs)/shareholder";
import Accounts from "../../../businesses/[id]/(tabs)/accounts";
import Keys from "../../../businesses/[id]/(tabs)/keys";

import { useBusinessDetail, useBusinessServices } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import { useMemo, useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { BadgeComponent } from "@/ui/components/Badge";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { BackBtn, PrimaryBtn } from "@/ui/components/Buttons";
import { Requests } from "../../../businesses/[id]/(tabs)/requests";
import createAxiosInstance from "@/lib/axios";
import ApplicationOverview from "../../../businesses/[id]/(tabs)/application-overview";
import CeoOverview from "../../../businesses/[id]/(tabs)/ceo-overview";
import OnboardingDocuments from "../../../businesses/[id]/(tabs)/onboarding-documents";
import OnboardingDirectors from "../../../businesses/[id]/(tabs)/onboarding-directors";
import OnboardingShareholders from "../../../businesses/[id]/(tabs)/onboarding-shareholders";

const questAxios = createAxiosInstance("questionnaire");

export default function SingleEligibilityBusiness() {
  const params = useParams<{ id: string }>();
  const { loading, business: detail, revalidate } = useBusinessDetail(params.id);
  const business = detail?.company ?? null;
  const userCount = detail?.counts?.users ?? 0;
  const axios = createAxiosInstance("auth");
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab")?.toLowerCase() || "business";
  const backHref = searchParams.get("back") ?? "/admin/eligibility-center?tab=onboarding";

  const { services, revalidate: revalidateServices } = useBusinessServices(params.id);

  const { handleSuccess, handleError } = useNotification();
  const [processingLink, setProcessingLink] = useState(false);
  const [processingActive, setProcessingActive] = useState(false);
  const [processingTrust, setProcessingTrust] = useState(false);
  const [processingAccounts, setProcessingAccounts] = useState(false);

  const [activeTab, setActiveTab] = useState<string | null>(tab);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set([tab || "business"])
  );

  const router = useRouter();
  const isOnboardingApp = detail?.type === "ONBOARDING_APPLICATION";

  const allDocumentsApproved =
    (detail?.reviewDocuments?.length ?? 0) > 0 &&
    (detail?.reviewDocuments ?? []).every((rd: any) => rd.review?.status === "APPROVED");

  const handleRejectBusiness = async () => {
    if (!detail?.reference) return;
    setProcessingRejectBiz(true);
    try {
      await questAxios.post(
        `/business/onboarding/admin/${detail.reference}/reject`,
        { reason: rejectBizReason }
      );
      closeRejectBiz();
      setRejectBizReason("");
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingRejectBiz(false);
    }
  };

  const handleActivate = async () => {
    if (!detail?.reference) return;
    setProcessingActivate(true);
    try {
      await questAxios.post(
        `/business/onboarding/admin/${detail.reference}/activate`,
        { tier: selectedTier }
      );
      const email =
        detail.business?.businessEmail ?? (business as any)?.contactEmail ?? "";
      setActivationEmail(email);
      closeTier();
      openActivateSuccess();
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingActivate(false);
    }
  };
  const appStatus = detail?.applicationStatus ?? detail?.currentStatus;
  const visibleTabs = tabs.filter((t) => {
    if ((t as any).onboardingOnly) return isOnboardingApp;
    if (["accounts", "keys", "requests"].includes(t.value)) return !isOnboardingApp;
    return true;
  });

  const [holdUpOpened, { open: openHoldUp, close: closeHoldUp }] = useDisclosure(false);
  const [rejectBizOpened, { open: openRejectBiz, close: closeRejectBiz }] = useDisclosure(false);
  const [tierOpened, { open: openTier, close: closeTier }] = useDisclosure(false);
  const [activateSuccessOpened, { open: openActivateSuccess, close: closeActivateSuccess }] = useDisclosure(false);
  const [rejectBizReason, setRejectBizReason] = useState("");
  const [selectedTier, setSelectedTier] = useState<"TIER_1" | "TIER_2">("TIER_1");
  const [processingRejectBiz, setProcessingRejectBiz] = useState(false);
  const [processingActivate, setProcessingActivate] = useState(false);
  const [activationEmail, setActivationEmail] = useState("");

  const [opened, { open, close }] = useDisclosure(false);
  const [openedTrust, { open: openTrust, close: closeTrust }] = useDisclosure(false);

  const handleBusinessTrust = async () => {
    setProcessingTrust(true);
    try {
      const currentState = business?.kycTrusted;
      await axios.post(`/admin/company/kyc/${params.id}`, { trustKyc: !currentState });
      revalidate();
      handleSuccess("Action Completed", `This business is ${currentState ? "not trusted" : "now trusted"}`);
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
      await axios.post(`/admin/business/${params.id}/account-issuance/enable`, {});
      handleSuccess("Successful", `You have successfully enabled issued accounts service for this business.`);
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
          activateText: "Are you sure you want to deactivate this business? This will render this business inactive and will not be able to receive new transactions.",
        };
      default:
        return {
          activateTitle: "Activate This Business?",
          activateText: "Are you sure you want to activate this business? This will render this business active and will be able to receive new transactions.",
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
          { title: "Eligibility Center", href: "/admin/eligibility-center?tab=onboarding" },
          {
            title: `${business?.name ?? detail?.business?.businessName ?? ""}`,
            href: `/admin/eligibility-center/${params.id}/business`,
            loading: loading,
          },
        ]}
      />

      <div className={styles.page__container}>
        {/* <BackBtn link={backHref} /> */}
        <div className={styles.container__header}>
          <Group gap={8}>
            {business?.kycTrusted && (
              <IconRosetteDiscountCheckFilled size={25} color="var(--prune-primary-700)" />
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
              <BadgeComponent status={detail.applicationStatus} active w="auto" px={10} />
            ) : null}
          </Group>

          {isOnboardingApp && detail?.editableByAdmin && appStatus === "IN_PROGRESS" && (
            <div className={styles.header__right}>
              <PrimaryBtn
                text="Edit"
                fw={600}
                fz={12}
                h={32}
                radius={4}
                action={() => router.push(`/admin/businesses/${params.id}/edit`)}
              />
            </div>
          )}

          {isOnboardingApp && appStatus === "SUBMITTED" && (
            <div className={styles.header__right}>
              <PrimaryBtn
                text="Reject Business"
                fw={600}
                fz={12}
                h={32}
                radius={4}
                color="#D92D20"
                c="#fff"
                action={() => {
                  if (!allDocumentsApproved) { openHoldUp(); return; }
                  openRejectBiz();
                }}
              />
              <PrimaryBtn
                text="Send Activation Link"
                fw={600}
                fz={12}
                h={32}
                radius={4}
                action={() => {
                  if (!allDocumentsApproved) { openHoldUp(); return; }
                  openTier();
                }}
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
                  text={business?.companyStatus === "ACTIVE" ? "Deactivate" : "Activate"}
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
                      {!services.find((s) => s.serviceIdentifier === "ISSUED_ACCOUNT_SERVICE")?.active && (
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
            defaultValue={tabs.find((_tab) => _tab.value === tab)?.value || "business"}
            variant="pills"
            classNames={{
              root: styles.tabs,
              list: styles.tabs__list,
              tab: styles.tab,
            }}
          >
            <TabsList>
              {visibleTabs.map((tab) => (
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
                    <ApplicationOverview detail={detail} revalidate={revalidate} />
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

            <TabsPanel value="ceo">
              {visitedTabs.has("ceo") && detail && <CeoOverview detail={detail} />}
            </TabsPanel>

            <TabsPanel value="documents">
              {visitedTabs.has("documents") && (
                isOnboardingApp && detail
                  ? <OnboardingDocuments
                      detail={detail}
                      applicationReference={detail.reference}
                      applicationStatus={detail.applicationStatus}
                      onReview={revalidate}
                    />
                  : business && <Documents business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="directors">
              {visitedTabs.has("directors") && (
                isOnboardingApp && detail
                  ? <OnboardingDirectors
                      detail={detail}
                      applicationReference={detail.reference}
                      applicationStatus={detail.applicationStatus}
                      onReview={revalidate}
                    />
                  : business && <Directors business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="shareholders">
              {visitedTabs.has("shareholders") && (
                isOnboardingApp && detail
                  ? <OnboardingShareholders
                      detail={detail}
                      applicationReference={detail.reference}
                      applicationStatus={detail.applicationStatus}
                      onReview={revalidate}
                    />
                  : business && <Shareholders business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="accounts">
              {visitedTabs.has("accounts") && <Accounts business={business} />}
            </TabsPanel>

            <TabsPanel value="keys">
              {visitedTabs.has("keys") && <Keys business={business} loading={loading} />}
            </TabsPanel>

            <TabsPanel value="requests">
              {visitedTabs.has("requests") && <Requests business={business} />}
            </TabsPanel>
          </Tabs>
        </div>
      </div>

      {/* Hold up — documents not all approved */}
      <Modal
        opened={holdUpOpened}
        onClose={closeHoldUp}
        size={480}
        centered
        title={
          <Text fz={20} fw={700} c="#344054">
            Hold up!!!
          </Text>
        }
      >
        <Text fz={16} c="#344054" lh={1.5} mb={24}>
          {`You haven't approved this business' documents. You need to approve them before being able to activate this business.`}
        </Text>
        <Flex justify="flex-end">
          <PrimaryBtn text="Okay" fw={600} fz={14} action={closeHoldUp} />
        </Flex>
      </Modal>

      {/* Reject Business modal */}
      <Modal
        opened={rejectBizOpened}
        onClose={() => { closeRejectBiz(); setRejectBizReason(""); }}
        size={560}
        centered
        title={
          <Text fz={20} fw={700} c="#1D2939">
            Why are you rejecting this business?
          </Text>
        }
      >
        <Stack gap={16}>
          <Text fz={16} fw={600} c="#344054">Reason for rejecting this business</Text>
          <TextInput
            placeholder="Enter reason"
            value={rejectBizReason}
            onChange={(e) => setRejectBizReason(e.currentTarget.value)}
          />
          <Flex justify="flex-end" mt={8}>
            <PrimaryBtn
              text="Reject"
              fw={600}
              fz={14}
              color="#D92D20"
              c="#fff"
              action={handleRejectBusiness}
              loading={processingRejectBiz}
              loaderProps={{ type: "dots" }}
              disabled={!rejectBizReason.trim()}
            />
          </Flex>
        </Stack>
      </Modal>

      {/* Choose Business Tier modal */}
      <Modal
        opened={tierOpened}
        onClose={closeTier}
        size={560}
        centered
        title={
          <Text fz={20} fw={700} c="#344054">
            Choose Business Tier
          </Text>
        }
      >
        <Stack gap={16}>
          <Radio.Group
            value={selectedTier}
            onChange={(val) => setSelectedTier(val as "TIER_1" | "TIER_2")}
          >
            <Stack gap={12}>
              {(["TIER_1", "TIER_2"] as const).map((tier) => (
                <Box
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  p={16}
                  style={{
                    border: `1px solid ${selectedTier === tier ? "var(--prune-primary-700)" : "#EAECF0"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    background: selectedTier === tier ? "hsl(from var(--prune-primary-700) h s l / .06)" : "#fff",
                  }}
                >
                  <Flex align="center" gap={12}>
                    <Radio value={tier} color="var(--prune-primary-700)" />
                    <Text fz={15} fw={600} c="#344054">
                      {tier === "TIER_1" ? "Tier 1" : "Tier 2"}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Stack>
          </Radio.Group>
          <Flex justify="flex-end" mt={8}>
            <PrimaryBtn
              text="Send Activation Link"
              fw={600}
              fz={14}
              action={handleActivate}
              loading={processingActivate}
              loaderProps={{ type: "dots" }}
            />
          </Flex>
        </Stack>
      </Modal>

      {/* Activation success modal */}
      <Modal
        opened={activateSuccessOpened}
        onClose={closeActivateSuccess}
        size={480}
        centered
        title={
          <Text fz={20} fw={700} c="#344054">
            Activation link sent successfully
          </Text>
        }
      >
        <Text fz={16} c="#344054" lh={1.5} mb={24}>
          You have successfully sent an activation link to{" "}
          <Text span fw={700}>{activationEmail}.</Text>
        </Text>
        <Flex justify="flex-end">
          <PrimaryBtn text="Okay" fw={600} fz={14} action={closeActivateSuccess} />
        </Flex>
      </Modal>

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
  { title: "Business Information", value: "business", icon: IconBuildingSkyscraper },
  { title: "CEO Details", value: "ceo", icon: IconUserStar, onboardingOnly: true },
  { value: "documents", icon: IconFiles },
  { value: "directors", icon: IconUsers },
  { title: "Key Shareholders", value: "shareholders", icon: IconUsersGroup },
  { value: "accounts", icon: IconCurrencyEuro },
  { title: "API Keys", value: "keys", icon: IconKey },
  { value: "requests", icon: IconCreditCardPay },
];
