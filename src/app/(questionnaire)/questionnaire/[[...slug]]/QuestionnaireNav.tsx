import { Flex } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

interface QuestionnaireNavProps {
  onNext?: () => void;
  onPrevious?: () => void;
  nextText?: string;
  previousText?: string;
  disabled?: boolean;
  hidePrev?: boolean;
  loading?: boolean;
}

export function QuestionnaireNav({
  onNext,
  onPrevious,
  nextText = "Next",
  previousText = "Previous step",
  disabled = false,
  hidePrev = false,
  loading = false,
}: QuestionnaireNavProps) {
  return (
    <Flex direction="column" gap={12} mt={32}>
      <PrimaryBtn
        text={nextText}
        fullWidth
        fw={600}
        action={onNext}
        disabled={disabled}
        loading={loading}
      />
      {!hidePrev && (
        <SecondaryBtn
          text={previousText}
          fullWidth
          fw={600}
          action={onPrevious}
          disabled={loading}
        />
      )}
    </Flex>
  );
}
