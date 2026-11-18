"use client";

import { ReactNode, useEffect, useState } from "react";
import { Box, Loader, Text } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import User from "@/lib/store/user";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { AdminMainLinks, AdminOtherLinks } from "@/lib/static";
import {
  PAYOUTS_VIEW_PRIVILEGES,
  REQUEST_VIEW_PRIVILEGES,
  SETTINGS_VIEW_PRIVILEGES,
} from "@/lib/privilegeGroups";

export {
  PAYOUTS_VIEW_PRIVILEGES,
  REQUEST_VIEW_PRIVILEGES,
  SETTINGS_VIEW_PRIVILEGES,
};

/**
 * Back-office access, from the /admin/me result stored at login.
 * `privileges` holds action strings such as "businesses.edit"; a Super Admin
 * can do everything. Hiding things is only for a tidy screen: the server
 * checks the same privileges and answers 403.
 */
export function useAdminAccess() {
  const user = User((s) => s.user);

  // The stored user only exists in the browser; wait until mounted so the
  // server render and the first browser render match
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const privileges = ready ? user?.privileges ?? [] : [];
  // the guide says "Superadmin"; tolerate "SUPERADMIN" / "SUPER_ADMIN" too
  const isSuperAdmin =
    ready &&
    user?.role?.toLowerCase().replace(/[^a-z]/g, "") === "superadmin";

  const can = (action: string) => isSuperAdmin || privileges.includes(action);
  const canAny = (actions: readonly string[] = []) =>
    !actions.length || actions.some(can);

  return {
    ready,
    currentAdminId: ready ? user?.id : undefined,
    isSuperAdmin,
    privileges,
    can,
    canAny,
  };
}

/** Renders children only when the admin has the privilege (or any of `any`). */
export function Can({
  do: action,
  any,
  children,
  fallback = null,
}: {
  do?: string;
  any?: readonly string[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can, canAny } = useAdminAccess();
  const allowed = action ? can(action) : canAny(any);
  return <>{allowed ? children : fallback}</>;
}


/**
 * Which privileges open which admin page (any one is enough). Most specific
 * first; the first match wins. Pages not listed are open to every admin.
 */
const ROUTE_PRIVILEGES: { match: RegExp; any: readonly string[] }[] = [
  { match: /^\/admin\/dashboard/, any: ["dashboard.view"] },
  { match: /^\/admin\/notifications/, any: ["notifications.view"] },

  { match: /^\/admin\/businesses\/[^/]+\/edit/, any: ["businesses.edit"] },
  { match: /^\/admin\/businesses/, any: ["businesses.view"] },

  { match: /^\/admin\/accounts/, any: ["accounts.view"] },
  { match: /^\/admin\/account-requests/, any: ["account-requests.view"] },

  { match: /^\/admin\/eligibility-center\/new/, any: ["eligibility-center.create"] },
  { match: /^\/admin\/eligibility-center\/[^/]+\/business\/new/, any: ["eligibility-center.create"] },
  { match: /^\/admin\/eligibility-center\/[^/]+\/business\/edit/, any: ["eligibility-center.edit"] },
  { match: /^\/admin\/eligibility-center/, any: ["eligibility-center.view"] },

  { match: /^\/admin\/rate\/audit-log/, any: ["rates.view-audit-log"] },
  { match: /^\/admin\/rate/, any: ["rates.view"] },

  { match: /^\/admin\/transactions/, any: ["transactions.view"] },
  { match: /^\/admin\/payouts\/[^/]+\/inquiry/, any: ["payouts.view-inquiries"] },
  { match: /^\/admin\/payouts/, any: PAYOUTS_VIEW_PRIVILEGES },
  { match: /^\/admin\/requests/, any: REQUEST_VIEW_PRIVILEGES },

  { match: /^\/admin\/users\/[^/]+\/business/, any: ["business-users.view"] },
  { match: /^\/admin\/users/, any: ["admins.view"] },
  { match: /^\/admin\/user-old/, any: ["admins.view", "business-users.view"] },

  { match: /^\/admin\/roles\/new/, any: ["roles.create"] },
  { match: /^\/admin\/roles\/[^/]+\/edit/, any: ["roles.edit"] },
  { match: /^\/admin\/roles/, any: ["roles.view"] },

  { match: /^\/admin\/pricing-plans\/new/, any: ["pricing-plans.create"] },
  { match: /^\/admin\/pricing-plans\/[^/]+\/duplicate/, any: ["pricing-plans.create"] },
  { match: /^\/admin\/pricing-plans\/[^/]+\/edit/, any: ["pricing-plans.edit"] },
  { match: /^\/admin\/pricing-plans/, any: ["pricing-plans.view"] },

  { match: /^\/admin\/settings/, any: SETTINGS_VIEW_PRIVILEGES },
];

/**
 * For components shared with the business dashboard: checks the privilege
 * only on /admin pages and leaves business users' screens unchanged.
 */
export function CanInAdmin(props: {
  do?: string;
  any?: readonly string[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (!pathname?.startsWith("/admin")) return <>{props.children}</>;
  return <Can {...props} />;
}

// where sign-in sends admins
const isLandingPage = (pathname: string) =>
  /^\/admin(\/dashboard)?\/?$/.test(pathname);

export const privilegesForPath = (pathname: string) =>
  ROUTE_PRIVILEGES.find((r) => r.match.test(pathname))?.any ?? [];

/**
 * Wraps the admin pages: shows the page only when the admin may open it,
 * otherwise a "no access" screen pointing at a page they can open.
 */
export function AdminPageGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, canAny } = useAdminAccess();

  const allowed = ready && canAny(privilegesForPath(pathname));
  // the first page in menu order this admin can open
  const firstAllowed = ready
    ? [...AdminMainLinks, ...AdminOtherLinks].find((l) => canAny(l.privileges))
    : undefined;

  // The dashboard is where sign-in lands. Without dashboard.view, go straight
  // to the first page the admin can open instead of showing "no access".
  const redirectFromHome =
    ready && !allowed && isLandingPage(pathname) && !!firstAllowed;

  useEffect(() => {
    if (redirectFromHome && firstAllowed) router.replace(firstAllowed.link);
  }, [redirectFromHome, firstAllowed, router]);

  if (!ready || redirectFromHome)
    return (
      <Box ta="center" py={120}>
        <Loader size="sm" color="var(--prune-primary-700)" />
      </Box>
    );

  if (allowed) return <>{children}</>;

  return (
    <Box ta="center" py={100} bg="#fff">
      <IconLock size={36} color="var(--prune-text-gray-400)" />
      <Text fz={18} fw={700} mt={12} style={{ fontFamily: "'EksellDisplay', serif" }}>
        You don&apos;t have access to this page
      </Text>
      <Text fz={13} c="#667085" mt={6} maw={420} mx="auto">
        {firstAllowed
          ? "Your roles don't include this page. Ask a Super Admin if you need it."
          : "You don't have any roles yet. Ask a Super Admin to give you one."}
      </Text>
      {firstAllowed && (
        <PrimaryBtn
          text={`Go to ${firstAllowed.text}`}
          link={firstAllowed.link}
          mt={24}
        />
      )}
    </Box>
  );
}
