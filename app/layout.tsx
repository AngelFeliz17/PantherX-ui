import { Poppins } from "next/font/google";
import "./globals.css";
import { getMe } from "@/lib/api/user";
import { UserProvider } from "../context/user-context";
import { cookies } from "next/headers";
import TopNavBar from "@/components/ui/top-navbar";
import BottomNavBar from "@/components/ui/bottom-navbar";

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
  const user = await getMe();
  return (
    <html
      lang="en"
      className={`${poppins.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider user={user} >
          <TopNavBar />
          {children}
          <BottomNavBar />
        </UserProvider>
        </body>
    </html>
  );
}
