import { createFormContext } from "@mantine/form";
import { QuestionnaireType } from "../schema";

// You can give context variables any name
export const [
  QuestionnaireFormProvider,
  useQuestionnaireFormContext,
  useQuestionnaireForm,
] = createFormContext<QuestionnaireType>();
