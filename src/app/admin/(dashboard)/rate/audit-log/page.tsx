"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Box, Text } from "@mantine/core";
import { PrimaryBtn } from "@/ui/components/Buttons";
import useNotification from "@/lib/hooks/notification";
import { apiMessage, auditExportParams, downloadExport, ratesAxios } from "@/lib/hooks/rates";
import classes from "@/ui/section/rate/styles.module.scss";
import AuditTrail, { AuditFilterQuery } from "@/ui/section/rate/AuditTrail";
import { Icon } from "@/ui/section/rate/shared";

// Figma: Audit log (15681:373066), table/expansion/drawer as the Audit Trail tab (15679:368530 · 15681:370433)

export default function AuditLogPage() {
  const { handleError } = useNotification();
  const [exporting, setExporting] = useState(false);
  const query = useRef<AuditFilterQuery>({});

  const exportFile = async () => {
    setExporting(true);
    try {
      const { data } = await ratesAxios.get("/audit-logs/export", { params: auditExportParams(query.current) });
      if (data.data?.url) await downloadExport(data.data);
      else handleError("Nothing to export", data.message ?? "No events match the current filters.");
    } catch (error) {
      handleError("Export failed", apiMessage(error));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box className={classes.auditPage}>
      <Box>
        <nav className={classes.crumbs} aria-label="Breadcrumb">
          <Link href="/admin/rate" className={classes.crumb}>Rates</Link>
          <span className={classes.crumbSep}>/</span>
          <span className={classes.crumbCurrent}>Audit log</span>
        </nav>
        <Box className={classes.pairHeader}>
          <Box className={classes.pairHeading}>
            <Text className={classes.pairTitle}>Audit log</Text>
            <Text className={classes.pairSubtitle}>Immutable record of every rate-management action. Read-only.</Text>
          </Box>
          {/* The server builds an .xlsx file */}
          <PrimaryBtn text="Export CSV" leftSection={<Icon name="export-arrow" />} className={classes.exportBtn}
            loading={exporting} action={exportFile} />
        </Box>
      </Box>

      <AuditTrail showPair showStats={false} onQueryChange={(q) => { query.current = q; }} />
    </Box>
  );
}
