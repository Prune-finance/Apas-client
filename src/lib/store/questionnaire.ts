// import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
// import { create } from "zustand";
// import {
//   OperationsAccountSchema,
//   QuestionnaireType,
//   questionnaireValues,
//   ServicesSchema,
//   TurnoverSchema,
//   VirtualAccountSchema,
// } from "@/lib/schema";

// interface QuestionnaireStore {
//   form: UseFormReturnType<QuestionnaireType>;
//   setForm: (form: UseFormReturnType<QuestionnaireType>) => void
//   progress: number;
//   currentStep: string;
//   slug: string[] | undefined;
//   setSlug: (slug: string[] | undefined) => void;
//   updateProgress: (step: string) => void;
// }

// const calculateProgress = (step: string): number => {
//   const steps = {
//     turnover: 25,
//     services: 50,
//     "operations-account": 75,
//     "no-virtual-account": 100,
//     "virtual-account": 100,
//   };
//   return steps[step as keyof typeof steps] || 0;
// };

// export const QuestionnaireStore = create<QuestionnaireStore>((set, get) => ({
//   slug: undefined,
//   setSlug: (slug) => set(() => ({ slug })),
//   form:
//     setForm:
//   progress: 0,
//   currentStep: "turnover",
//   updateProgress: (step) =>
//     set(() => ({
//       currentStep: step,
//       progress: calculateProgress(step),
//     })),
// }));

import { createFormContext } from "@mantine/form";
import { QuestionnaireType } from "../schema";

// You can give context variables any name
export const [
  QuestionnaireFormProvider,
  useQuestionnaireFormContext,
  useQuestionnaireForm,
] = createFormContext<QuestionnaireType>();
