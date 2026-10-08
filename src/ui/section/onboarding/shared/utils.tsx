import { Tooltip } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { PrimaryBtn } from "@/ui/components/Buttons";

interface SaveProgressBtnProps {
  loading: boolean;
  action: () => void;
}

export const SaveProgressBtn = ({ loading, action }: SaveProgressBtnProps) => (
  <Tooltip label="Save progress" withArrow position="left">
    <PrimaryBtn
      text="Save progress"
      icon={IconDeviceFloppy}
      showIcon
      h={36}
      fz={13}
      fw={500}
      loading={loading}
      action={action}
    />
  </Tooltip>
);

export const eksellStyle = { fontFamily: "'EksellDisplay', serif" } as const;

export const buildSectionBase = (adminReference: string | undefined, section: number, isAdmin?: boolean) =>
  adminReference
    ? `/business/onboarding/admin/${adminReference}/sections/${section}`
    : isAdmin
    ? `/business/onboarding/admin/sections/${section}`
    : `/business/onboarding/sections/${section}`;
