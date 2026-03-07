import { MongoClient, type Db } from "mongodb";
import "dotenv/config";

type CounterDocument = {
  _id: string;
  seq: number;
};

function resolveMongoUrl(): string | undefined {
  const candidates: Array<[string, string | undefined]> = [
    ["MONGODB_URI", process.env.MONGODB_URI],
    ["MONGO_URL", process.env.MONGO_URL],
    ["DATABASE_URL", process.env.DATABASE_URL],
    ["DATABASE_INTERNAL_URL", process.env.DATABASE_INTERNAL_URL],
  ];

  for (const [key, rawValue] of candidates) {
    const value = rawValue?.trim();
    if (!value) continue;

    try {
      return validateMongoUrl(value);
    } catch (error) {
      console.warn(`Ignoring invalid ${key}: ${(error as Error).message}`);
    }
  }

  return undefined;
}

function validateMongoUrl(mongoUrl: string): string {
  let parsed: URL;

  try {
    parsed = new URL(mongoUrl);
  } catch {
    throw new Error("Invalid MongoDB URL format. Expected a full mongodb:// or mongodb+srv:// URL.");
  }

  if (parsed.protocol !== "mongodb:" && parsed.protocol !== "mongodb+srv:") {
    throw new Error("Invalid MongoDB protocol. Use mongodb:// or mongodb+srv://.");
  }

  if (!parsed.hostname || parsed.hostname.toLowerCase() === "base") {
    throw new Error(
      'Invalid MongoDB host "base". Set MONGODB_URI to your real MongoDB URL.',
    );
  }

  return mongoUrl;
}

function resolveDatabaseName(mongoUrl: string | undefined): string {
  const explicit = process.env.MONGODB_DB?.trim() || process.env.MONGO_DB?.trim();
  if (explicit) {
    return explicit;
  }

  if (!mongoUrl) {
    return "poultry_egg_finder";
  }

  try {
    const parsed = new URL(mongoUrl);
    const path = parsed.pathname.replace(/^\//, "");
    return path || "poultry_egg_finder";
  } catch {
    return "poultry_egg_finder";
  }
}

const isProduction = process.env.NODE_ENV !== "development";
const mongoUrl = resolveMongoUrl();
const databaseName = resolveDatabaseName(mongoUrl);

if (isProduction && !mongoUrl) {
  throw new Error(
    "MONGODB_URI is required in production. Set MONGODB_URI (or MONGO_URL).",
  );
}

const client = mongoUrl
  ? new MongoClient(mongoUrl, {
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10_000,
    })
  : null;

const dbPromise: Promise<Db> | null = client
  ? client.connect().then((connectedClient) => connectedClient.db(databaseName))
  : null;

let indexPromise: Promise<void> | null = null;

async function ensureIndexes(db: Db): Promise<void> {
  if (!indexPromise) {
    indexPromise = (async () => {
      await Promise.all([
        db.collection("users").createIndex({ id: 1 }, { unique: true }),
        db.collection("users").createIndex({ email: 1 }, { unique: true }),
        db.collection("egg_collection").createIndex({ id: 1 }, { unique: true }),
        db.collection("egg_sales").createIndex({ id: 1 }, { unique: true }),
        db.collection("chicken_management").createIndex({ id: 1 }, { unique: true }),
        db.collection("disease_records").createIndex({ id: 1 }, { unique: true }),
        db.collection("inventory").createIndex({ id: 1 }, { unique: true }),
        db.collection("expenses").createIndex({ id: 1 }, { unique: true }),
        db.collection("vaccinations").createIndex({ id: 1 }, { unique: true }),
        db.collection("conversations").createIndex({ id: 1 }, { unique: true }),
        db.collection("messages").createIndex({ id: 1 }, { unique: true }),
        db.collection("messages").createIndex({ conversationId: 1, createdAt: 1 }),
      ]);
    })().catch((error) => {
      indexPromise = null;
      throw error;
    });
  }

  await indexPromise;
}

export const isMongoConfigured = Boolean(mongoUrl);

export async function getMongoDb(): Promise<Db | null> {
  if (!dbPromise) {
    return null;
  }

  const db = await dbPromise;
  await ensureIndexes(db);
  return db;
}

export async function getMongoDbOrThrow(): Promise<Db> {
  const db = await getMongoDb();
  if (!db) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI to enable database storage.");
  }
  return db;
}

export async function getNextSequence(name: string): Promise<number> {
  const db = await getMongoDbOrThrow();
  const counters = db.collection<CounterDocument>("counters");

  const result = await counters.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" },
  );

  return result?.seq ?? 1;
}
