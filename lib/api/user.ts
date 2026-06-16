import axios from "axios";
import api from "../axios/api";
import { cache } from "react";

export const getMe = cache(async () => {
  try {
    const headers: Record<string, string> = {};

    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }
    }

    const { data } = await api.get(`/users/me`, { headers });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
});