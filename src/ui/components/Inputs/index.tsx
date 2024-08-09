import { LoginType, loginValues } from "@/lib/schema";
import { TextInput, PasswordInput, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import styles from "@/ui/styles/auth.module.scss";

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
            // variant="unstyled"

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
            placeholder="******************"
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
