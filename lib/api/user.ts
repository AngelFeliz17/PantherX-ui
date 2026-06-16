import api from "../axios/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  const { data } = await api.get(
    `${API_URL}/users/me`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  return data;
};