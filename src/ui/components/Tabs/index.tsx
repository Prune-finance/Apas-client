import {
  Box,
  Button,
  Tabs,
  TabsList,
  TabsPanel,
  TabsProps,
  TabsTab,
  Text,
} from "@mantine/core";
import styles from "./styles.module.scss";
import { ReactNode } from "react";
import { Tab } from "@/lib/schema";
import { IconReload } from "@tabler/icons-react";

interface Props extends TabsProps {
  tabs: Tab[];
  children: ReactNode;
  showRefreshBtn?: boolean;
  loading?: boolean;
  revalidate?: () => void;
  refreshButtonIndex?: string | null;
}

export default function TabsComponent({
  tabs,
  children,
  showRefreshBtn,
  refreshButtonIndex,
  loading,
  revalidate,
  ...props
}: Props) {
  return (
    <Tabs
      pos="relative"
      defaultValue={tabs[0]?.value}
      variant="pills"
      classNames={{
        root: styles.tabs,
        list: styles.tabs__list,
        tab: styles.tab,
      }}
      {...props}
    >
      <TabsList>
        {tabs.map((tab, idx) => (
          <>
            <TabsTab
              key={tab?.value}
              value={tab?.value}
              {...(tab?.icon && { leftSection: tab?.icon })}
              {...(props?.tt && { tt: props?.tt })}
              {...(props?.fz && { fz: props?.fz })}
            >
              {tab?.title || tab?.value}
            </TabsTab>
          </>
        ))}
        {showRefreshBtn && refreshButtonIndex === "Transactions" && (
          <Box right={0} pos="absolute">
            <Button
              bg="#C1DD0629"
              color="#596603"
              variant="light"
              h={28}
              mb={4}
              radius={4}
              c="#596603"
              loading={loading}
              onClick={revalidate}
              fz={12}
              leftSection={<IconReload stroke={2} size={12} color="#97AD05" />}
            >
              Refresh
            </Button>
          </Box>
        )}
      </TabsList>

      {children}

      {/* <TabsPanel value="business">
        {business && <Business business={business} revalidate={revalidate} />}
      </TabsPanel>

      <TabsPanel value="documents">
        {business && <Documents business={business} revalidate={revalidate} />}
      </TabsPanel>

      <TabsPanel value="directors">
        {business && <Directors business={business} revalidate={revalidate} />}
      </TabsPanel>

      <TabsPanel value="shareholders">
        {business && (
          <Shareholders business={business} revalidate={revalidate} />
        )}
      </TabsPanel>

      <TabsPanel value="accounts">
        <Accounts business={business} />
      </TabsPanel>

      <TabsPanel value="keys">
        <Keys business={business} />
      </TabsPanel> */}
    </Tabs>
  );
}
