import { SkeletonProps, Skeleton as MantineSkeleton } from "@mantine/core";
import React from "react";

interface ISkeleton extends SkeletonProps {
  loading: boolean;
  children: React.ReactNode;
}

export default function Skeleton({ loading, children, ...props }: ISkeleton) {
  return (
    <>{loading ? <MantineSkeleton w={50} h={24} {...props} /> : children}</>
  );
}
