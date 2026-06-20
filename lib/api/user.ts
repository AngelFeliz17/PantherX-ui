import axios from "axios";
import api from "../axios/api";
import { cache } from "react";
import { headers } from "next/headers";

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
      if (!cookieHeader) {
        return null;
      }

      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }
    }

    const { data } = await api.get(`/users/me`, { headers });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401 || status === 403 || status === 404) {
        return null;
      }

      if (!error.response) {
        return null;
      }
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

export const updateProfilePicture = async (file: File) => {
  const { status } = await api.post('/users/update-profile-picture', { file }, { headers: {
    "Content-Type": "multipart/form-data"
  }});

  return status;
}

export const updateProfileBanner = async (file: File) => {
  const { status } = await api.post('/users/update-profile-banner', { file }, { headers: {
    "Content-Type": "multipart/form-data"
  }});

  return status;
}
