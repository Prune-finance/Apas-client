"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Portal } from "@mantine/core";
import classes from "./styles.module.scss";
import { Icon } from "./shared";

// Figma: submitted (15719:377258) · failed (15719:378184) feedback toasts

export type RateToastState = { tone: "success" | "error"; title: string; body: string } | null;

export function useRateToast(duration = 5000) {
  const [toast, setToast] = useState<RateToastState>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((next: NonNullable<RateToastState>) => {
    clearTimeout(timer.current);
    setToast(next);
    timer.current = setTimeout(() => setToast(null), duration);
  }, [duration]);
  const hide = useCallback(() => { clearTimeout(timer.current); setToast(null); }, []);

  useEffect(() => () => clearTimeout(timer.current), []);
  return { toast, show, hide };
}

export default function RateToast({ toast, onClose }: { toast: RateToastState; onClose: () => void }) {
  if (!toast) return null;
  return (
    <Portal>
      <div className={classes.rateToast} data-tone={toast.tone} role={toast.tone === "error" ? "alert" : "status"}
        onClick={onClose}>
        <Icon name={toast.tone === "success" ? "toast-success" : "toast-error"} />
        <div className={classes.rateToastText}>
          <p className={classes.rateToastTitle}>{toast.title}</p>
          <p className={classes.rateToastBody}>{toast.body}</p>
        </div>
      </div>
    </Portal>
  );
}
