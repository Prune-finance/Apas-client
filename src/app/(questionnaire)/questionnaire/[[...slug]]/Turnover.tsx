import { Box, RadioGroup, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import CustomRadio from "@/ui/components/CustomRadio";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import createAxiosInstance from "@/lib/axios";

const questAxios = createAxiosInstance("questionnaire");

interface RefOption { value: string; label: string }

export default function Turnover() {
  const form = useQuestionnaireFormContext();
  const [monetaryBands, setMonetaryBands] = useState<RefOption[]>([]);

  useEffect(() => {
    questAxios
      .get("/business/questionnaire/reference-data", {
        params: { include: "monetaryBands" },
      })
      .then(({ data: res }) => {
        setMonetaryBands(res.data?.monetaryBands ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <Box>
      <RadioGroup
        name="turnover"
        label="What is this entity's annual turnover?"
        {...form.getInputProps("annualTurnover")}
        key={form.key("annualTurnover")}
        errorProps={{ mt: 10 }}
        labelProps={{
          fz: 16,
          fw: 500,
          c: "var(--prune-text-gray-500)",
          mb: 16,
        }}
      >
        <Stack gap={20} mt="xs" style={{ cursor: "pointer" }}>
          {monetaryBands.map((option) => (
            <CustomRadio key={option.value} value={option.value} label={option.label} />
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
}
