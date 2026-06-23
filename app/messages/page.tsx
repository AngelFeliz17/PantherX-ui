"use client";

import { start } from "@/lib/api/conversations";
import { MessageCircle, Search } from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "John Smith",
    lastMessage: "Is this item still available?",
    time: "2m",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    lastMessage: "Can you meet tomorrow on campus?",
    time: "1h",
  },
  {
    id: 3,
    name: "Michael Brown",
    lastMessage: "Thanks for the update!",
    time: "Yesterday",
  },
];

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8 mt-18">
      <div className="mx-auto flex h-[calc(100vh-120px)] max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-sm">
        <aside className="flex w-full flex-col border-r md:w-96">
          <div className="border-b p-5">
            <h1 className="text-2xl font-bold">Messages</h1>

            <div className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                className="flex w-full items-center gap-3 border-b p-4 text-left transition hover:bg-muted/60"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {conversation.name
                    .split(" ")
                    .map(word => word[0])
                    .join("")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium">
                      {conversation.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {conversation.time}
                    </span>
                  </div>

                  <p className="truncate text-sm text-muted-foreground">
                    {conversation.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="hidden flex-1 items-center justify-center bg-muted/20 md:flex">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="size-10 text-primary" />
            </div>

            <h2 className="text-xl font-semibold">
              Select a conversation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a conversation from the left to start chatting with a
              buyer or seller.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}