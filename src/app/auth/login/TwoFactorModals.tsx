"use client";

import {
  Box,
  Checkbox,
  Divider,
  Flex,
  Modal,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
import LockIcon from "@/assets/img/lock.svg";
import { useState } from "react";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { OtpInput } from "@/ui/components/OtpInput";
import { parseError } from "@/lib/actions/auth";

export type TwoFactorStep =
  | "protect"
  | "qr"
  | "confirm"
  | "backup"
  | "secured"
  | "enter";

interface TwoFactorModalsProps {
  step: TwoFactorStep | null;
  challengeToken: string;
  onStepChange: (step: TwoFactorStep | null) => void;
  onComplete: (token: string, userData: any) => void;
  /** Base path of the 2FA proxy routes. Admin login passes "/api/auth/admin/2fa". */
  apiBase?: string;
}

const modalStyles = {
  title: { fontSize: 24, fontWeight: 500, color: "#101828", fontFamily: "var(--mantine-font-family)" },
  header: { padding: "24px 24px 0" },
  body: { padding: "8px 24px 24px" },
};

const confirmModalStyles = {
  content: { borderRadius: 8 },
  title: { fontSize: 24, fontWeight: 500, color: "#000000", fontFamily: "var(--mantine-font-family)" },
  header: { padding: "32px 32px 0", minHeight: 0 },
  body: { padding: "16px 32px 32px" },
};

// ─── Protect Your Account ───────────────────────────────────────────────────
function ProtectAccountModal({
  opened,
  onCancel,
  onContinue,
  loading,
}: {
  opened: boolean;
  onCancel: () => void;
  onContinue: () => void;
  loading: boolean;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Protect your account by enabling 2FA"
      styles={modalStyles}
      size={520}
      centered
      withCloseButton={false}
    >
      <Text fz={14} c="#667085" mb={24}>
        Choose how you want to receive your authentication codes.
      </Text>

      <Box
        py={12}
        style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}
      >
        <Box
          style={{
            background: "#dcf5e6",
            borderRadius: 9999,
            padding: 8,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LockIcon.src} alt="lock" width={24} height={24} />
        </Box>
        <Box style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Text fz={14} lh="20px" c="#101828">
            Set up using Authenticator app
          </Text>
          <Text fz={12} lh="18px" c="#667085">
            Use an authenticator app to get authentication code
          </Text>
        </Box>
      </Box>

      <Flex justify="flex-end" gap={12} mt={24}>
        <SecondaryBtn
          text="Cancel"
          fw={600}
          fz={12}
          action={onCancel}
          radius={4}
          h={40}
          w={106}
          styles={{ root: { border: "1px solid #d0d5dd", color: "#344054" } }}
          c="#344054"
        />
        <PrimaryBtn
          text="Continue"
          fw={600}
          fz={12}
          loading={loading}
          action={onContinue}
          radius={4}
          h={40}
          px={18}
        />
      </Flex>
    </Modal>
  );
}

// ─── Connect Your App (QR Code) ─────────────────────────────────────────────
function ConnectAppModal({
  opened,
  onCancel,
  onContinue,
  qrCode,
  manualKey,
}: {
  opened: boolean;
  onCancel: () => void;
  onContinue: () => void;
  qrCode: string;
  manualKey: string;
}) {
  const { handleSuccess } = useNotification();

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Connect your app"
      styles={modalStyles}
      size={520}
      centered
    >
      <Text fz={14} c="var(--prune-text-gray-500)" mb={24}>
        To enable, scan this QR code with your authenticator app
      </Text>

      {qrCode && (
        <Flex justify="center" mb={20}>
          <Box
            style={{ border: "1px solid #EAECF0", borderRadius: 8, padding: 12, display: "inline-block" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCode} alt="2FA QR Code" width={200} height={200} />
          </Box>
        </Flex>
      )}

      <Divider label="or enter the code manually" labelPosition="center" mb={16} />

      <Box
        px={16}
        py={12}
        style={{ border: "1px solid #EAECF0", borderRadius: 8, background: "#FCFCFD" }}
      >
        <Text fz={14} c="var(--prune-text-gray-600)" style={{ wordBreak: "break-all" }}>
          {manualKey}
        </Text>
      </Box>

      <Flex justify="flex-end" gap={12} mt={32}>
        <SecondaryBtn text="Cancel" fw={600} fz={12} action={onCancel} radius={4} h={40} w={106} c="#344054" styles={{ root: { border: "1px solid #d0d5dd" } }} />
        <PrimaryBtn text="Continue" fw={600} fz={12} action={onContinue} radius={4} h={40} px={18} />
      </Flex>
    </Modal>
  );
}

// ─── Confirm Setup ───────────────────────────────────────────────────────────
function ConfirmSetupModal({
  opened,
  onClose,
  onConfirm,
  loading,
  title,
  description,
}: {
  opened: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void;
  loading: boolean;
  title: string;
  description: string;
}) {
  const [code, setCode] = useState("");

  return (
    <Modal
      opened={opened}
      onClose={() => { setCode(""); onClose(); }}
      title={title}
      styles={confirmModalStyles}
      size={500}
      centered
    >
      <Text fz={16} lh={1.5} c="#667085" mb={40}>
        {description}
      </Text>

      <Flex justify="center" mb={40}>
        <OtpInput value={code} onChange={setCode} />
      </Flex>

      <PrimaryBtn
        text="Confirm"
        fw={500}
        fz={16}
        fullWidth
        h={48}
        radius={4}
        loading={loading}
        disabled={code.length < 6}
        action={() => { if (code.length === 6) onConfirm(code); }}
        color={code.length < 6 ? "#eaecf0" : undefined}
        c={code.length < 6 ? "#98a2b3" : undefined}
      />
    </Modal>
  );
}

// ─── Save Backup Codes ───────────────────────────────────────────────────────
function BackupCodesModal({
  opened,
  onContinue,
  codes,
}: {
  opened: boolean;
  onContinue: () => void;
  codes: string[];
}) {
  const [saved, setSaved] = useState(false);
  const { handleSuccess } = useNotification();

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    handleSuccess("Copied", "Backup codes copied to clipboard");
  };

  const handleDownload = () => {
    const content = "Prune Payments - 2FA Backup Codes\n\n" + codes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prune-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      title="Save Backup Codes"
      styles={modalStyles}
      size={460}
      centered
      withCloseButton={false}
    >
      <Text fz={14} c="var(--prune-text-gray-500)" mb={20}>
        If you lose access to your 2FA method, use these codes to log in. Save
        them somewhere safe!
      </Text>

      <Box
        p={16}
        style={{ border: "1px solid #EAECF0", borderRadius: 8, position: "relative" }}
      >
        <UnstyledButton
          onClick={handleCopy}
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          <IconCopy size={18} color="var(--prune-text-gray-500)" />
        </UnstyledButton>

        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 24px",
          }}
        >
          {codes.map((code, i) => (
            <Text key={i} fz={13} fw={500} c="var(--prune-text-gray-700)" style={{ fontFamily: "monospace" }}>
              {code}
            </Text>
          ))}
        </Box>
      </Box>

      <Checkbox
        mt={16}
        mb={24}
        label="I have saved them"
        checked={saved}
        onChange={(e) => setSaved(e.currentTarget.checked)}
        color="var(--prune-primary-700)"
        styles={{ label: { fontSize: 14, color: "var(--prune-text-gray-700)" } }}
      />

      <Flex justify="flex-end" gap={12}>
        <SecondaryBtn text="Download as TXT" fw={600} fz={12} action={handleDownload} radius={4} h={40} c="#344054" styles={{ root: { border: "1px solid #d0d5dd" } }} />
        <PrimaryBtn
          text="Continue"
          fw={600}
          fz={12}
          radius={4}
          h={40}
          px={18}
          disabled={!saved}
          action={onContinue}
          color={!saved ? "var(--prune-text-gray-200)" : undefined}
          c={!saved ? "var(--prune-text-gray-400)" : undefined}
        />
      </Flex>
    </Modal>
  );
}

// ─── You're Secured ──────────────────────────────────────────────────────────
function SecuredModal({ opened, onOkay }: { opened: boolean; onOkay: () => void }) {
  return (
    <Modal
      opened={opened}
      onClose={onOkay}
      title="You're Secured!"
      styles={modalStyles}
      size={440}
      centered
      withCloseButton
    >
      <Text fz={14} c="var(--prune-text-gray-500)" mb={32}>
        2FA is now active. Next time you log in, we&apos;ll ask for your code.
      </Text>
      <Flex justify="flex-end">
        <PrimaryBtn text="Okay" fw={600} fz={12} action={onOkay} radius={4} h={40} px={18} />
      </Flex>
    </Modal>
  );
}

// ─── Orchestrator ────────────────────────────────────────────────────────────
export default function TwoFactorModals({
  step,
  challengeToken,
  onStepChange,
  onComplete,
  apiBase = "/api/auth/2fa",
}: TwoFactorModalsProps) {
  const { handleError, handleSuccess } = useNotification();
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [pendingToken, setPendingToken] = useState("");
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  const handleCancel = () => onStepChange(null);

  // Step 1: "Protect your account" → fetch QR code
  const handleSetupContinue = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiBase}/setup`, { challengeToken });
      setQrCode(data.data?.qrCode ?? "");
      setManualKey(data.data?.manualKey ?? "");
      onStepChange("qr");
    } catch (error: any) {
      handleError("Setup failed", error?.response?.data?.message ?? "Could not start 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Confirm setup code
  const handleConfirmSetup = async (code: string) => {
    setConfirmLoading(true);
    try {
      const { data } = await axios.post(`${apiBase}/setup/confirm`, { challengeToken, code });
      setBackupCodes(data.data?.backupCodes ?? []);
      setPendingToken(data.meta?.token ?? "");
      setPendingUserData(data.data ?? null);
      onStepChange("backup");
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        handleError("Session expired", "Your setup session expired. Please log in again.");
        onStepChange(null);
      } else {
        handleError("Incorrect code", error?.response?.data?.message ?? "The code you entered is incorrect. Please try again.");
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  // After backup codes saved → go to "Secured" then complete
  const handleBackupContinue = () => onStepChange("secured");

  const handleSecuredOkay = () => {
    onComplete(pendingToken, pendingUserData);
  };

  // Enter 2FA code (already set up)
  const handleEnter2FA = async (code: string) => {
    setConfirmLoading(true);
    try {
      const { data } = await axios.post(apiBase, { challengeToken, code });
      const token = data.meta?.token ?? "";
      const userData = data.data ?? null;

      if (data.meta?.usedBackupCode && data.meta?.backupCodesRemaining <= 3) {
        handleSuccess(
          "Backup code used",
          `You have ${data.meta.backupCodesRemaining} backup code${data.meta.backupCodesRemaining === 1 ? "" : "s"} remaining. Consider regenerating them.`
        );
      }

      onComplete(token, userData);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        handleError("Session expired", "Your sign-in session expired. Please log in again.");
        onStepChange(null);
      } else if (status === 429) {
        handleError("Too many attempts", "Too many incorrect codes. Please try again in a few minutes.");
        onStepChange(null);
      } else {
        handleError("Incorrect code", error?.response?.data?.message ?? "The code you entered is incorrect. Please try again.");
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <ProtectAccountModal
        opened={step === "protect"}
        onCancel={handleCancel}
        onContinue={handleSetupContinue}
        loading={loading}
      />

      <ConnectAppModal
        opened={step === "qr"}
        onCancel={handleCancel}
        onContinue={() => onStepChange("confirm")}
        qrCode={qrCode}
        manualKey={manualKey}
      />

      <ConfirmSetupModal
        opened={step === "confirm"}
        onClose={handleCancel}
        onConfirm={handleConfirmSetup}
        loading={confirmLoading}
        title="Confirm setup"
        description="Enter the 6-digit code from your Authenticator app."
      />

      <BackupCodesModal
        opened={step === "backup"}
        onContinue={handleBackupContinue}
        codes={backupCodes}
      />

      <SecuredModal
        opened={step === "secured"}
        onOkay={handleSecuredOkay}
      />

      <ConfirmSetupModal
        opened={step === "enter"}
        onClose={handleCancel}
        onConfirm={handleEnter2FA}
        loading={confirmLoading}
        title="Enter 2FA Code"
        description="Enter the 6-digit code from your Authenticator app."
      />
    </>
  );
}
