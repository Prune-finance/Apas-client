import { Stack } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";

interface QuestionnaireNavProps {
  onNext?: () => void;
  onPrevious?: () => void;
  nextText?: string;
  previousText?: string;
  disabled?: boolean;
  disabledPrev?: boolean;
}

export function QuestionnaireNav({
  onNext,
  onPrevious,
  nextText = "Next",
  previousText = "Previous step",
  disabled = false,
  disabledPrev = false,
}: QuestionnaireNavProps) {
  const form = useQuestionnaireFormContext();
  return (
    <Stack gap={12} mt={32}>
      <PrimaryBtn
        text={nextText}
        fullWidth
        fw={600}
        action={() => {
          if (form.validate().hasErrors) return;
          onNext && onNext();
        }}
        disabled={disabled}
      />
      <SecondaryBtn
        text={previousText}
        fullWidth
        fw={600}
        action={onPrevious}
        disabled={disabledPrev}
      />
    </Stack>
  );
}
