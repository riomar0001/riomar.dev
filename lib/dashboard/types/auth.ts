export type DashboardUser = { username: string };

export type LoginHistory = {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  reason?: string;
  createdAt: string;
};
