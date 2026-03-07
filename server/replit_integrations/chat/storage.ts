import { getMongoDbOrThrow, getNextSequence } from "../../db";
import { type Conversation, type Message } from "@shared/schema";

type MongoDocument<T> = T & { _id?: unknown };

function stripMongoId<T extends { _id?: unknown }>(document: T): Omit<T, "_id"> {
  const { _id, ...rest } = document;
  return rest;
}

export interface IChatStorage {
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    const db = await getMongoDbOrThrow();
    const conversation = await db
      .collection<MongoDocument<Conversation>>("conversations")
      .findOne({ id });
    return conversation ? stripMongoId(conversation) : undefined;
  },

  async getAllConversations() {
    const db = await getMongoDbOrThrow();
    const conversations = await db
      .collection<MongoDocument<Conversation>>("conversations")
      .find({})
      .sort({ createdAt: -1, id: -1 })
      .toArray();
    return conversations.map(stripMongoId);
  },

  async createConversation(title: string) {
    const db = await getMongoDbOrThrow();
    const conversation: Conversation = {
      id: await getNextSequence("conversations"),
      title,
      createdAt: new Date(),
    };
    await db.collection<Conversation>("conversations").insertOne(conversation);
    return conversation;
  },

  async deleteConversation(id: number) {
    const db = await getMongoDbOrThrow();
    await db.collection("messages").deleteMany({ conversationId: id });
    await db.collection("conversations").deleteOne({ id });
  },

  async getMessagesByConversation(conversationId: number) {
    const db = await getMongoDbOrThrow();
    const messages = await db
      .collection<MongoDocument<Message>>("messages")
      .find({ conversationId })
      .sort({ createdAt: 1, id: 1 })
      .toArray();
    return messages.map(stripMongoId);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    const db = await getMongoDbOrThrow();
    const message: Message = {
      id: await getNextSequence("messages"),
      conversationId,
      role,
      content,
      createdAt: new Date(),
    };
    await db.collection<Message>("messages").insertOne(message);
    return message;
  },
};
