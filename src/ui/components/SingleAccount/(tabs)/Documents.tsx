import { Account } from "@/lib/hooks/accounts";
import { camelCaseToTitleCase, splitCamelCase } from "@/lib/utils";
import { Box, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { TextInputWithFile } from "../../TextInputWithFile";

interface Props {
  account: Account | null;
  admin?: boolean;
}

export const Documents = ({ account, admin = false }: Props) => {
  console.log("admin: ", admin);
  return (
    <Box>
      {account?.type === "USER" && (
        <Paper>
          <SimpleGrid cols={3}>
            <TextInputWithFile
              url={account.accountDocuments.idFileURL}
              placeholder={account.accountDocuments.idType}
              label="Identity Type"
              admin={admin}
            />
            <TextInputWithFile
              url={account.accountDocuments.poaFileURL}
              placeholder={splitCamelCase(
                account.accountDocuments.poaType ?? ""
              )}
              label="Proof of Address"
              admin={admin}
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
              Director's Documents
            </Text>
            {Object.values(account.accountDocuments.directors).map(
              (director, index) => (
                <Box mb={20} key={index}>
                  <Text fz={12} fw={500} c="dimmed" mb={20}>
                    Director {index + 1}
                  </Text>
                  <SimpleGrid cols={3}>
                    <TextInputWithFile
                      url={director.idFile}
                      placeholder={camelCaseToTitleCase(director.idType ?? "")}
                      label={"Identity Type"}
                      admin={admin}
                    />
                    <TextInputWithFile
                      url={director.poaFile}
                      placeholder={camelCaseToTitleCase(director.poaType ?? "")}
                      label={"Proof of Address"}
                      admin={admin}
                    />
                  </SimpleGrid>
                </Box>
              )
            )}

            {Object.keys(account.accountDocuments.directors).length === 0 && (
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
              Shareholder's Documents
            </Text>
            {Object.values(account.accountDocuments.shareholders).map(
              (director, index) => (
                <Box mb={20}>
                  <Text fz={12} fw={500} c="dimmed" mb={20}>
                    Shareholder {index + 1}
                  </Text>
                  <SimpleGrid cols={3}>
                    <TextInputWithFile
                      url={director.idFile}
                      placeholder={camelCaseToTitleCase(director.idType ?? "")}
                      label={"Identity Type"}
                      admin={admin}
                    />
                    <TextInputWithFile
                      url={director.poaFile}
                      placeholder={camelCaseToTitleCase(director.poaType ?? "")}
                      label={"Proof of Address"}
                      admin={admin}
                    />
                  </SimpleGrid>
                </Box>
              )
            )}

            {Object.keys(account.accountDocuments.shareholders).length ===
              0 && <NoContent text="No Shareholder Documents" />}
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
