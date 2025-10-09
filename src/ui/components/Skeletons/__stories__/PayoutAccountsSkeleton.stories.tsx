import React from "react";
import PayoutAccountsSkeleton from "../PayoutAccountsSkeleton";

const meta = {
  title: "Skeletons/PayoutAccountsSkeleton",
  component: PayoutAccountsSkeleton,
};

export default meta;

export const Default = () => <PayoutAccountsSkeleton />;
export const ManyRows = () => <PayoutAccountsSkeleton rows={8} />;
export const FewCards = () => <PayoutAccountsSkeleton cards={1} />;
