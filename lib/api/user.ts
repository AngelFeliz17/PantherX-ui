import axios from "axios";
import api from "../axios/api";
import { cache } from "react";

export type UpdateUserData = {
  name?: string;
  email?: string;
  bio?: string;
  graduationYear?: string | number;
};

export const getMeFresh = async () => {
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
};

export const getMe = cache(getMeFresh);

export const deleteAccount = async () => {
  const { data } = await api.delete('/users/me');
  return data;
}

export const update = async (updateData: UpdateUserData) => {
  const { data, status } = await api.patch('/users/me', updateData);
  return { data, status };
}
