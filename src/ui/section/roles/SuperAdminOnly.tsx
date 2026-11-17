import { Box, Text } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { SecondaryBtn } from "@/ui/components/Buttons";

/** Shown in place of role-changing screens for admins who aren't Super Admins. */
export default function SuperAdminOnly() {
  return (
    <Box ta="center" py={80} bg="#fff" mt={20}>
      <IconLock size={32} color="var(--prune-text-gray-400)" />
      <Text fz={16} fw={600} mt={12}>
        Only a Super Admin can do this
      </Text>
      <Text fz={12} c="#667085" mt={4}>
        You can view roles, but only a Super Admin can create or change them.
      </Text>
      <SecondaryBtn text="Back to Roles" link="/admin/roles" mt={24} />
    </Box>
  );
}
