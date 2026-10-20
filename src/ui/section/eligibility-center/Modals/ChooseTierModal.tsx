"use client";

import { Box, Divider, Flex, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { IconBuildingBank, IconBuildingStore, IconCheck } from "@tabler/icons-react";

interface ChooseTierModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (tier: "TIER_1" | "TIER_2") => Promise<void>;
  loading: boolean;
}

type CurrencyItem = { code: string; flag: string; label: string; enabled: boolean };
type ServiceCol = { name: string; currencies: CurrencyItem[]; included: boolean };

function makeCurrencies(enabledCodes: string[]): CurrencyItem[] {
  return [
    { code: "EUR", flag: "eu", label: "Euro", enabled: enabledCodes.includes("EUR") },
    { code: "USD", flag: "us", label: "USD", enabled: enabledCodes.includes("USD") },
    { code: "GBP", flag: "gb", label: "GBP", enabled: enabledCodes.includes("GBP") },
    { code: "NGN", flag: "ng", label: "NGN", enabled: enabledCodes.includes("NGN") },
  ];
}

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
    description: "Basic business tier with remittance, account lookup, and payout services.",
    icon: <IconBuildingBank size={16} color="#667085" />,
    services: [
      { name: "Remittance", currencies: makeCurrencies(["EUR"]), included: true },
      { name: "Account Lookup", currencies: makeCurrencies(["EUR"]), included: true },
      { name: "Payout Services", currencies: makeCurrencies(["EUR"]), included: true },
      { name: "Operations Account", currencies: makeCurrencies([]), included: false },
      { name: "Virtual Account", currencies: makeCurrencies([]), included: false },
    ],
  },
  {
    id: "TIER_2",
    label: "Tier 2",
    description: "Full business tier with all services and multi-currency support.",
    icon: <IconBuildingStore size={16} color="#667085" />,
    services: [
      { name: "Operations Account", currencies: makeCurrencies(["EUR", "USD", "GBP", "NGN"]), included: true },
      { name: "Virtual Account", currencies: makeCurrencies(["EUR", "USD", "GBP", "NGN"]), included: true },
      { name: "Remittance", currencies: makeCurrencies(["EUR"]), included: true },
      { name: "Payout Services", currencies: makeCurrencies(["EUR"]), included: true },
      { name: "Account Lookup", currencies: makeCurrencies(["EUR"]), included: true },
    ],
  },
];

function FlagImg({ flag }: { flag: string }) {
  return (
    <img
      src={`https://flagcdn.com/16x12/${flag}.png`}
      srcSet={`https://flagcdn.com/32x24/${flag}.png 2x`}
      width={16}
      height={12}
      alt={flag}
      style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
    />
  );
}

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
      size={860}
      centered
      title={
        <Text fz={20} fw={700} c="#344054" style={{ fontFamily: "'EksellDisplay', serif" }}>
          Choose Business Tier
        </Text>
      }
    >
      <Stack gap={12}>
        {TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <Box
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              p={20}
              style={{
                border: isSelected ? "2px solid #758604" : "1px solid #EAECF0",
                borderRadius: 20,
                cursor: "pointer",
                background: isSelected ? "#FAFFF0" : "#fff",
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              {/* Header row */}
              <Flex align="flex-start" justify="space-between" mb={12}>
                <Flex gap={12} align="flex-start">
                  <Box
                    w={36}
                    h={36}
                    style={{
                      background: "#F2F4F7",
                      border: "1px solid #EAECF0",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {tier.icon}
                  </Box>
                  <Box>
                    <Text fz={16} fw={600} c="#344054" lh={1.3}>
                      {tier.label}
                    </Text>
                    <Text fz={13} c="#667085" lh={1.5} mt={2}>
                      {tier.description}
                    </Text>
                  </Box>
                </Flex>

                {/* Selection indicator */}
                <Box
                  w={22}
                  h={22}
                  style={{
                    borderRadius: 9999,
                    border: isSelected ? "2px solid #758604" : "2px solid #D0D5DD",
                    background: isSelected ? "#758604" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                >
                  {isSelected && <IconCheck size={12} color="#fff" strokeWidth={3} />}
                </Box>
              </Flex>

              <Divider color="#EAECF0" mb={16} />

              {/* Services grid */}
              <Box>
                <Text fz={11} fw={700} c="#98A2B3" tt="uppercase" mb={12} style={{ letterSpacing: "0.06em" }}>
                  Approved Business Services
                </Text>
                <Flex gap={0} style={{ overflowX: "auto" }}>
                  {tier.services.map((svc, i) => (
                    <Box
                      key={svc.name}
                      style={{
                        flex: "1 0 0",
                        minWidth: 110,
                        borderRight: i < tier.services.length - 1 ? "1px solid #F2F4F7" : "none",
                        paddingRight: 12,
                        paddingLeft: i > 0 ? 12 : 0,
                      }}
                    >
                      <Text
                        fz={13}
                        fw={600}
                        c={svc.included ? "#344054" : "#98A2B3"}
                        mb={10}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {svc.name}
                      </Text>
                      <Stack gap={8}>
                        {svc.currencies.map((cur) => {
                          const active = svc.included && cur.enabled;
                          return (
                            <Flex
                              key={cur.code}
                              align="center"
                              gap={6}
                              style={{ opacity: active ? 1 : 0.35 }}
                            >
                              <FlagImg flag={cur.flag} />
                              <Text fz={13} c={active ? "#344054" : "#98A2B3"}>
                                {cur.label}
                              </Text>
                            </Flex>
                          );
                        })}
                      </Stack>
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Box>
          );
        })}

        <Flex justify="flex-end" mt={4}>
          <PrimaryBtn
            text="Approve"
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
