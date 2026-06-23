import { Listing } from "./listing";
import { Message } from "./message";
import { User } from "./user";

export type Conversation = { 
    id: string;
    createdAt: Date;
    updatedAt: Date;
    listing: Listing;
    buyer: User;
    messages: Message[];
}