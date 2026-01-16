import type { UserType } from "@/app/(auth)/auth";

export type MessageUsage = {
  used: number;
  limit: number;
  userType: UserType;
};

