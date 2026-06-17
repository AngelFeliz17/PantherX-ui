"use client";

import { createContext, useContext } from "react";

export type User = {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  graduationYear?: string;
  createdAt: Date;
  university: {
    id: string;
    name: string;
  }
  listings?: [{
    id: string;
    title: string;
    description: string;
    price: string;
    status: string;
    condition: string;
    images: {
      id: string;
      url: string;
      order: number;
    }
  }];
  // favorite: {
  //   listing: {
  //     listing
  //   }
  // }
} | null;

const UserContext = createContext<User>(null);

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}