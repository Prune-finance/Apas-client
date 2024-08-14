import { Tabs, TabsList, TabsPanel, TabsProps, TabsTab } from "@mantine/core";
import styles from "./styles.module.scss";
import { ReactNode } from "react";

interface Tab {
  title?: string;
  value: string;
  icon?: JSX.Element;
}
interface Props extends TabsProps {
  tabs: Tab[];
  children: ReactNode;
}

export default function TabsComponent({ tabs, children, ...props }: Props) {
  return (
    <Tabs
      defaultValue={tabs[0].value}
      variant="pills"
      classNames={{
        root: styles.tabs,
        list: styles.tabs__list,
        tab: styles.tab,
      }}
      {...props}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTab
            key={tab.value}
            value={tab.value}
            {...(tab.icon && { leftSection: tab.icon })}
            // leftSection={tab.icon}
            // tt="capitalize"
          >
            {tab.title || tab.value}
          </TabsTab>
        ))}
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
