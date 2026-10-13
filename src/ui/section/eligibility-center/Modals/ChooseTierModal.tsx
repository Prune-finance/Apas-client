"use client";

import { Box, Flex, Modal, Radio, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { PrimaryBtn } from "@/ui/components/Buttons";

interface ChooseTierModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (tier: "TIER_1" | "TIER_2") => Promise<void>;
  loading: boolean;
}

export default function ChooseTierModal({
  opened,
  onClose,
  onSubmit,
  loading,
}: ChooseTierModalProps) {
  const [selectedTier, setSelectedTier] = useState<"TIER_1" | "TIER_2">("TIER_1");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={560}
      centered
      title={
        <Text fz={20} fw={700} c="#344054" style={{ fontFamily: "'EksellDisplay', serif" }}>
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
            action={() => onSubmit(selectedTier)}
            loading={loading}
            loaderProps={{ type: "dots" }}
          />
        </Flex>
      </Stack>
    </Modal>
  );
}
