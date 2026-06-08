import { useEffect, useState } from "react";
import { useGetProfileQuery } from "@/store/slices/AdminSlice";

export default function CanAccess({ role, children }) {
  const { data: user } = useGetProfileQuery();

  if (Array.isArray(role) ? role.includes(user.role) : role === UserRole) {
    return children;
  }
  return null;
}
