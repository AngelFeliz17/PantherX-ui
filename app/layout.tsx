import { Poppins } from "next/font/google";
import "./globals.css";
import { getMe } from "@/lib/api/user";
import { UserProvider } from "../context/user-context";
import { cookies } from "next/headers";
import AppShell from "@/components/ui/app-shell";
import type { User } from "@/interfaces/user";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await cookies()
  let user: User = null;

  try {
    user = await getMe();
  } catch (error) {
    console.error("Failed to load current user", error);
  }

  return (
    <html
      lang="en"
      className={`${poppins.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider user={user}>
          <AppShell>
            {children}
          </AppShell>
        </UserProvider>
        </body>
    </html>
  );
}
