// Questionnaire-scoped inputs — floating label, 48px height.
// Re-exported under the existing names so no import changes are needed
// in BasicInfo, Turnover, VirtualAccount, OperationsAccount, ContactEntry.

export {
  QuestInput as TextInputWithInsideLabel,
  QuestSelect as SelectInputWithInsideLabel,
  QuestNumberInput as NumberInputWithInsideLabel,
  QuestTextarea as TextareaWithInsideLabel,
  QuestPhoneInput as PhoneNumberInput,
} from "@/ui/components/InputWithLabel/QuestInputs";
