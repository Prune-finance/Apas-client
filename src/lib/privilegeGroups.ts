// Privilege groups for admin pages that hold several areas: the page (and its
// menu item) shows when the admin has any one of them.

// Request types on /admin/requests, one tab each
export const REQUEST_VIEW_PRIVILEGES = [
  "debit-requests.view",
  "service-requests.view",
  "currency-requests.view",
  "live-key-requests.view",
  "payout-requests.view",
  "reactivation-requests.view",
] as const;

export const PAYOUTS_VIEW_PRIVILEGES = [
  "payouts.view",
  "payouts.view-inquiries",
] as const;

export const SETTINGS_VIEW_PRIVILEGES = [
  "logs.view",
  "notifications.view",
  "currencies.view",
] as const;
