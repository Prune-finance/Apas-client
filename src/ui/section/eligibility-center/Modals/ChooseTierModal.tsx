"use client";

import { Box, Flex, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { IconBuildingBank, IconBuildingStore } from "@tabler/icons-react";

interface ChooseTierModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (tier: "TIER_1" | "TIER_2") => Promise<void>;
  loading: boolean;
}

type Currency = { emoji: string; label: string };
type ServiceCol = { name: string; currencies: Currency[]; dimmed?: boolean };

const EUR: Currency = { emoji: "🇪🇺", label: "Euro" };
const USD: Currency = { emoji: "🇺🇸", label: "USD" };
const GBP: Currency = { emoji: "🇬🇧", label: "GBP" };
const NGN: Currency = { emoji: "🇳🇬", label: "NGN" };

const TIERS: {
  id: "TIER_1" | "TIER_2";
  label: string;
  description: string;
  icon: React.ReactNode;
  services: ServiceCol[];
}[] = [
  {
    id: "TIER_1",
    label: "Tier 1",
    description:
      "Basic business tier with remittance, account lookup, and payout services.",
    icon: <IconBuildingBank size={16} color="#667085" />,
    services: [
      { name: "Remittance", currencies: [EUR] },
      { name: "Account Lookup", currencies: [EUR] },
      { name: "Payout Services", currencies: [EUR] },
      { name: "Operations Account", currencies: [EUR, USD, GBP, NGN], dimmed: true },
      { name: "Virtual Account", currencies: [EUR, USD, GBP, NGN], dimmed: true },
    ],
  },
  {
    id: "TIER_2",
    label: "Tier 2",
    description:
      "Full business tier with all services and multi-currency support.",
    icon: <IconBuildingStore size={16} color="#667085" />,
    services: [
      { name: "Operations Account", currencies: [EUR, USD, GBP, NGN] },
      { name: "Virtual Account", currencies: [EUR, USD, GBP, NGN] },
      { name: "Remittance", currencies: [EUR] },
      { name: "Payout Services", currencies: [EUR] },
      { name: "Account Lookup", currencies: [EUR] },
    ],
  },
];

export default function ChooseTierModal({
  opened,
  onClose,
  onSubmit,
  loading,
}: ChooseTierModalProps) {
  const [selectedTier, setSelectedTier] = useState<"TIER_1" | "TIER_2" | null>(null);

  const handleClose = () => {
    setSelectedTier(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size={900}
      centered
      title={
        <Text fz={20} fw={700} c="#344054" style={{ fontFamily: "'EksellDisplay', serif" }}>
          Choose Business Tier
        </Text>
      }
    >
      <Stack gap={16}>
        {TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <Box
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              p={16}
              style={{
                border: isSelected
                  ? "2px solid #758604"
                  : "1px solid #EAECF0",
                borderRadius: 24,
                cursor: "pointer",
                background: "#fff",
              }}
            >
              <Stack gap={12}>
                {/* Icon button */}
                <Box
                  w={36}
                  h={36}
                  style={{
                    background: "#F2F4F7",
                    border: "1px solid #EAECF0",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {tier.icon}
                </Box>

                {/* Title + description */}
                <Box>
                  <Text fz={16} fw={600} c="#344054" mb={4}>
                    {tier.label}
                  </Text>
                  <Text fz={14} c="#667085" lh={1.5}>
                    {tier.description}
                  </Text>
                </Box>

                {/* Services box */}
                <Box
                  p={16}
                  style={{
                    border: "1px solid #EAECF0",
                    borderRadius: 8,
                  }}
                >
                  <Text fz={12} fw={700} c="#344054" tt="uppercase" mb={12}>
                    Approved Business Services
                  </Text>
                  <Flex gap={0} align="flex-start" style={{ overflowX: "auto" }}>
                    {tier.services.map((svc) => (
                      <Box
                        key={svc.name}
                        style={{ flex: "1 0 120px", minWidth: 110 }}
                      >
                        <Text
                          fz={13}
                          fw={500}
                          c={svc.dimmed ? "#D0D5DD" : "#344054"}
                          mb={8}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {svc.name}
                        </Text>
                        <Stack gap={4}>
                          {svc.currencies.map((cur) => (
                            <Flex
                              key={cur.label}
                              align="center"
                              gap={6}
                              style={{ opacity: svc.dimmed ? 0.35 : 1 }}
                            >
                              <span style={{ fontSize: 14, lineHeight: 1 }}>
                                {cur.emoji}
                              </span>
                              <Text fz={13} c={svc.dimmed ? "#98A2B3" : "#344054"}>
                                {cur.label}
                              </Text>
                            </Flex>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Stack>
            </Box>
          );
        })}

        <Flex justify="flex-end" mt={8}>
          <PrimaryBtn
            text="Send Activation Link"
            fw={600}
            fz={14}
            action={() => selectedTier && onSubmit(selectedTier)}
            loading={loading}
            loaderProps={{ type: "dots" }}
            disabled={!selectedTier}
          />
        </Flex>
      </Stack>
    </Modal>
  );
}
