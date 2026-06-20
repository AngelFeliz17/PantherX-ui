"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMeFresh } from "@/lib/api/user";

export type Listing = {
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
  }[]
  seller: {
    id: string;
    name: string;
    profilePicture?: {
    id: string;
    url: string;
    order: number;
  }; 
  }
}

export type User = {
  id: string;
  email: string;
  name: string;
  profilePicture?: {
    id: string;
    url: string;
    order: number;
  };
  banner?: {
    id: string;
    url: string;
    order: number;
  }
  bio?: string;
  graduationYear?: string;
  createdAt: Date;
  university: {
    id: string;
    name: string;
  }
  listings?: Listing[];
  favorite?: {
    listing: Listing
  }[]
} | null;

const UserContext = createContext<User>(null);
const UserActionsContext = createContext<{
  refreshUser: () => Promise<User>;
} | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const refreshUser = useCallback(async () => {
    const freshUser = await getMeFresh();
    setCurrentUser(freshUser);
    return freshUser;
  }, []);
  
  return (
    <UserContext.Provider value={currentUser}>
      <UserActionsContext.Provider value={{ refreshUser }}>
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserActions() {
  const actions = useContext(UserActionsContext);

  if (!actions) {
    throw new Error("useUserActions must be used within a UserProvider");
  }

  return actions;
}
