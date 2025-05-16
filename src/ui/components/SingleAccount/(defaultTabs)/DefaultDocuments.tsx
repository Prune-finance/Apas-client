import { Account, DefaultAccount } from "@/lib/hooks/accounts";
import { splitCamelCase } from "@/lib/utils";
import { Box, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { TextInputWithFile } from "../../TextInputWithFile";

interface Props {
  account: DefaultAccount | null;
  isDefault?: boolean;
}

export const DefaultDocuments = ({ account, isDefault }: Props) => {
  return (
    <Box>
      {account?.type === "USER" && (
        <Paper>
          <SimpleGrid cols={3}>
            <TextInputWithFile
              url={account.accountDocuments.idFileURL}
              placeholder={account.accountDocuments.idType}
              label="Identity Type"
            />
            <TextInputWithFile
              url={account.accountDocuments.poaFileURL}
              placeholder={splitCamelCase(
                account.accountDocuments.poaType ?? ""
              )}
              label="Proof of Address"
            />
          </SimpleGrid>
        </Paper>
      )}

      {account?.type === "CORPORATE" && (
        <Stack gap={20}>
          <Paper withBorder p={24}>
            <Text
              fz={12}
              fw={600}
              mb={25}
              tt="uppercase"
              c="var(--prune-text-gray-800)"
            >
              {`Director's Documents`}
            </Text>

            {account.accountDocuments.directors.map((director, index) => (
              <Box mb={20} key={index}>
                <Text fz={12} fw={500} c="dimmed" mb={20}>
                  Director {index + 1}
                </Text>
                <SimpleGrid cols={3}>
                  <TextInputWithFile
                    url={director.identityFileUrl}
                    placeholder={splitCamelCase(director.identityType ?? "")}
                    label={"Identity Type"}
                  />
                  <TextInputWithFile
                    url={director.proofOfAddressFileUrl}
                    placeholder={splitCamelCase(director.proofOfAddress ?? "")}
                    label={"Proof of Address"}
                  />
                </SimpleGrid>
              </Box>
            ))}

            {account.accountDocuments.directors.length === 0 && (
              <NoContent text="No Director Documents" />
            )}
          </Paper>

          <Paper withBorder p={24}>
            <Text
              fz={12}
              fw={600}
              mb={25}
              tt="uppercase"
              c="var(--prune-text-gray-800)"
            >
              {`Shareholder's Documents`}
            </Text>
            {account.accountDocuments.shareholders.map((director, index) => (
              <Box mb={20} key={index}>
                <Text fz={12} fw={500} c="dimmed" mb={20}>
                  Shareholder {index + 1}
                </Text>
                <SimpleGrid cols={3}>
                  <TextInputWithFile
                    url={director.identityFileUrl}
                    placeholder={splitCamelCase(director.identityType ?? "")}
                    label={"Identity Type"}
                  />
                  <TextInputWithFile
                    url={director.proofOfAddressFileUrl}
                    placeholder={splitCamelCase(director.proofOfAddress ?? "")}
                    label={"Proof of Address"}
                  />
                </SimpleGrid>
              </Box>
            ))}

            {account.accountDocuments.shareholders.length === 0 && (
              <NoContent text="No Shareholder Documents" />
            )}
          </Paper>
        </Stack>
      )}
    </Box>
  );
};

const NoContent = ({ text }: { text: string }) => {
  return (
    <Text fz={12} fw={600} c="var(--prune-text-gray-700)">
      {text}
    </Text>
  );
};
