import { Conversation } from "./conversation";
import { User } from "./user";

export type Message = {
    id: string;
    content: string;
    createdAt: Date;
    conversation: Conversation;
    sender: User;
}