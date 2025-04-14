import { Stack } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

interface QuestionnaireNavProps {
  onNext?: () => void;
  onPrevious?: () => void;
  nextText?: string;
  previousText?: string;
  disabled?: boolean;
}

export function QuestionnaireNav({
  onNext,
  onPrevious,
  nextText = "Next",
  previousText = "Previous step",
  disabled = false,
}: QuestionnaireNavProps) {
  return (
    <Stack gap={12} mt={32}>
      <PrimaryBtn
        text={nextText}
        fullWidth
        fw={600}
        action={onNext}
        disabled={disabled}
      />
      <SecondaryBtn
        text={previousText}
        fullWidth
        fw={600}
        action={onPrevious}
      />
    </Stack>
  );
}
