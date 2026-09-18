import {
  LoginType,
  loginValues,
  RegisterType,
  registerValues,
} from "@/lib/schema";
import {
  TextInput,
  PasswordInput,
  Text,
  InputBaseProps,
  TextInputProps,
  Select,
  SelectProps,
  NumberInput,
  NumberInputProps,
  Textarea,
  TextareaProps,
  rem,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import styles from "@/ui/styles/auth.module.scss";
import { IconSearch } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";
import insideLabelClasses from "@/ui/components/InputWithLabel/input.module.scss";

type InputProps = {
  form: UseFormReturnType<LoginType>;
  label: keyof typeof loginValues;
};

export const LoginInput = ({ form, label }: InputProps) => {
  return (
    <>
      <div
        className={styles.wrapper}
        style={{
          border: `1px solid ${
            form.errors[label]
              ? "var(--prune-warning)"
              : "var(--prune-text-gray-100)"
          }`,
        }}
      >
        {label === "email" ? (
          <TextInput
            // size="lg"
            label={label}
            labelProps={{
              fz: 12,
              c: "var(--prune-text-gray-400)",
              tt: "capitalize",
              my: 0,
              py: 0,
            }}
            styles={{ input: { border: "none" } }}
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            placeholder="jane.zi@prune.io"
            {...form.getInputProps(`${label}`)}
            error={false}
          />
        ) : (
          <PasswordInput
            size="xs"
            label={label}
            labelProps={{
              fz: 12,
              c: "var(--prune-text-gray-400)",
              tt: "capitalize",
            }}
            variant="unstyled"
            classNames={{
              input: styles.input,
              label: styles.label,
              innerInput: styles.innerInput,
            }}
            styles={{ innerInput: { border: "none" } }}
            placeholder="Enter Password"
            {...form.getInputProps(`${label}`)}
            error={false}
          />
        )}
      </div>
      <Text c="var(--prune-warning)" fz={12} fw={400} mt={8}>
        {form.errors && form.errors[label]}
      </Text>
    </>
  );
};

interface RegisterProps extends InputBaseProps {
  form: UseFormReturnType<RegisterType>;
  label: keyof typeof registerValues;
}

export const RegisterInput = ({ form, label, ...props }: RegisterProps) => {
  return (
    <>
      <div
        className={styles.wrapper}
        style={{
          border: `1px solid ${
            form.errors[label]
              ? "var(--prune-warning)"
              : "var(--prune-text-gray-100)"
          }`,
        }}
      >
        {label === "email" ? (
          <TextInput
            // size="lg"
            label={label}
            labelProps={{
              fz: 12,
              c: "var(--prune-text-gray-400)",
              tt: "capitalize",
              my: 0,
              py: 0,
            }}
            styles={{ input: { border: "none" } }}
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            placeholder="jane.zi@prune.io"
            {...form.getInputProps(`${label}`)}
            error={false}
            {...props}
          />
        ) : (
          <PasswordInput
            size="xs"
            label={label}
            labelProps={{
              fz: 12,
              c: "var(--prune-text-gray-400)",
              tt: "capitalize",
            }}
            styles={{ innerInput: { border: "none" } }}
            variant="unstyled"
            classNames={{
              input: styles.input,
              label: styles.label,
              innerInput: styles.innerInput,
            }}
            placeholder="Enter Password"
            {...form.getInputProps(`${label}`)}
            error={false}
          />
        )}
      </div>
      <Text c="var(--prune-warning)" fz={12} fw={400} mt={8}>
        {form.errors && form.errors[label]}
      </Text>
    </>
  );
};

interface SearchInputProps extends TextInputProps {
  search?: string;
  setSearch?: Dispatch<SetStateAction<string>>;
}
export const SearchInput = ({
  search,
  setSearch,
  ...props
}: SearchInputProps) => {
  return (
    <TextInput
      placeholder="Search here..."
      leftSectionPointerEvents="none"
      leftSection={<IconSearch style={{ width: 20, height: 20 }} />}
      w={324}
      styles={{ input: { border: "1px solid #F5F5F5" } }}
      value={search}
      onChange={(e) => setSearch && setSearch(e.currentTarget.value)}
      {...props}
    />
  );
};

interface TextBoxProps extends TextInputProps {}

export const TextBox = ({ ...props }: TextBoxProps) => {
  return <TextInput size="xs" w={120} h={36} {...props} />;
};

interface SelectBoxProps extends SelectProps {}

export const SelectBox = ({ ...props }: SelectBoxProps) => {
  return <Select size="xs" w={120} h={36} {...props} />;
};

const insideLabelLeftSectionWidth = rem(52);

const insideLabelTextInputStyles: TextInputProps["styles"] = {
  input: {
    paddingLeft: insideLabelLeftSectionWidth,
  },
  label: {
    paddingLeft: insideLabelLeftSectionWidth,
  },
};

const insideLabelNumberInputStyles: NumberInputProps["styles"] = {
  input: {
    paddingLeft: insideLabelLeftSectionWidth,
  },
  label: {
    paddingLeft: insideLabelLeftSectionWidth,
  },
};

interface TextInputWithInsideLabelProps extends TextInputProps {}

export const TextInputWithInsideLabel = ({
  leftSection,
  leftSectionWidth,
  styles,
  ...props
}: TextInputWithInsideLabelProps) => {
  const hasLeftSection = Boolean(leftSection);

  return (
    <TextInput
      {...props}
      leftSection={leftSection}
      leftSectionWidth={
        leftSectionWidth ?? (hasLeftSection ? insideLabelLeftSectionWidth : undefined)
      }
      classNames={insideLabelClasses}
      styles={hasLeftSection ? insideLabelTextInputStyles : styles}
    />
  );
};

interface NumberInputWithInsideLabelProps extends NumberInputProps {}

export const NumberInputWithInsideLabel = ({
  leftSection,
  leftSectionWidth,
  styles,
  ...props
}: NumberInputWithInsideLabelProps) => {
  const hasLeftSection = Boolean(leftSection);

  return (
    <NumberInput
      {...props}
      leftSection={leftSection}
      leftSectionWidth={
        leftSectionWidth ?? (hasLeftSection ? insideLabelLeftSectionWidth : undefined)
      }
      placeholder="Enter number"
      classNames={insideLabelClasses}
      styles={hasLeftSection ? insideLabelNumberInputStyles : styles}
      thousandSeparator=","
      min={0}
    />
  );
};

interface TextareaWithInsideLabelProps extends TextareaProps {}

export const TextareaWithInsideLabel = ({
  ...props
}: TextareaWithInsideLabelProps) => {
  return <Textarea {...props} classNames={insideLabelClasses} />;
};
