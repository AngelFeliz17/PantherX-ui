import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function BottomNavBar() {
    return (
        <div>
        {/* MOBILE NAVIGATION */}
            <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-background/95 backdrop-blur md:hidden">
            <Link
                href="/"
                className="flex flex-col items-center text-muted-foreground"
            >
                <Home className="h-5 w-5" />
                <span className="text-xs">
                Home
                </span>
            </Link>

            <Link
                href="/listings"
                className="flex flex-col items-center text-muted-foreground"
            >
                <Search className="h-5 w-5" />
                <span className="text-xs">
                Browse
                </span>
            </Link>

            <Link
                href="/listings/create"
                className="flex flex-col items-center text-violet-600"
            >
                <PlusCircle className="h-7 w-7" />
                <span className="text-xs">
                Sell
                </span>
            </Link>

            <Link
                href="/messages"
                className="flex flex-col items-center text-muted-foreground"
            >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">
                Messages
                </span>
            </Link>

            <Link
                href="/profile"
                className="flex flex-col items-center text-muted-foreground"
            >
                <User className="h-5 w-5" />
                <span className="text-xs">
                Profile
                </span>
            </Link>
        </nav>
        </div>
    )
}