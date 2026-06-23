"use client";

import { useUser } from "@/context/user-context";
import { Conversation } from "@/interfaces/conversation";
import { findAll, findConversation } from "@/lib/api/conversations";
import { ArrowLeft, MessageCircle, Search, Send } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Message } from "@/interfaces/message";

export default function MessagesPage() {
  const user = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const getConversations = async () => {
      const response = await findAll();
      setConversations(response ?? []);
    };
    getConversations();
  }, [user?.id]);

  const getMessages = async (conversation: Conversation) => {
    setSelectedConversation(conversation);

    const response = await findConversation(conversation.id);
    setMessages(response ?? []);
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-28 md:px-8 md:pb-8">
      <div className="mx-auto flex h-[calc(100dvh-12rem-env(safe-area-inset-bottom))] max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-sm md:h-[calc(100vh-8rem)]">
        <aside
          className={`min-h-0 w-full flex-col border-r md:flex md:w-96 ${
            selectedConversation ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="shrink-0 border-b p-5">
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

          <div className="min-h-0 flex-1 overflow-y-auto">
            {conversations.map(conversation => {
              const otherUser =
                user?.id === conversation.listing.seller?.id
                  ? conversation.buyer
                  : conversation.listing.seller;

              const lastMessage = conversation.messages?.[0];

              return (
                <button
                  key={conversation.id}
                  onClick={() => getMessages(conversation)}
                  className={`flex w-full items-center gap-3 border-b p-4 text-left transition hover:bg-muted/60 ${
                    selectedConversation?.id === conversation.id
                      ? "bg-muted"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={otherUser?.profilePicture?.url ?? "/images/default-avatar.png"}
                      alt={otherUser?.name ?? "User avatar"}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">
                          {otherUser?.name ?? "Unknown User"}
                        </p>

                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      <p className="truncate text-sm text-muted-foreground">
                        {lastMessage?.content ?? "No messages yet"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section
          className={`min-h-0 flex-1 flex-col ${
            selectedConversation ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedConversation ? (
            <>
              <div className="shrink-0 flex items-center gap-3 border-b p-4">
                <button
                  onClick={() => {
                    setSelectedConversation(null);
                    setMessages([]);
                  }}
                  className="rounded-full p-2 hover:bg-muted md:hidden"
                >
                  <ArrowLeft className="size-5" />
                </button>

                <Image
                  src={
                    (user?.id === selectedConversation.listing.seller?.id
                      ? selectedConversation.buyer?.profilePicture?.url
                      : selectedConversation.listing.seller?.profilePicture?.url) ??
                    "/images/default-avatar.png"
                  }
                  alt="User avatar"
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">
                    {user?.id === selectedConversation.listing.seller?.id
                      ? selectedConversation.buyer?.name
                      : selectedConversation.listing.seller?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Discussing: {selectedConversation.listing.title}
                  </p>
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No messages yet.
                  </div>
                ) : (
                  messages.map(message => {
                    const isMine = message.sender?.id === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            isMine
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.content}</p>
                          <span className="mt-1 block text-right text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="shrink-0 border-t bg-card p-4">
                <div className="flex items-center gap-2 rounded-2xl border p-2">
                  <input
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="min-w-0 flex-1 bg-transparent px-2 outline-none"
                  />

                  <button
                    type="button"
                    disabled={!messageInput.trim()}
                    className="shrink-0 rounded-xl bg-primary p-3 text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="size-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-muted/20 text-center">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="size-10 text-primary" />
              </div>

              <h2 className="text-xl font-semibold">Select a conversation</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Choose a conversation from the left to start chatting with a buyer or seller.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
