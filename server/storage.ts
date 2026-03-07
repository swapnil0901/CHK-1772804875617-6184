import { getMongoDbOrThrow, getNextSequence, isMongoConfigured } from "./db";
import {
  type User,
  type EggCollection,
  type EggSales,
  type ChickenManagement,
  type DiseaseRecord,
  type Inventory,
  type Expense,
  type Vaccination,
  type InsertUser,
} from "@shared/schema";
import { z } from "zod";
import { api } from "@shared/routes";

type MongoDocument<T> = T & { _id?: unknown };

function toDateOnly(value: string | Date | undefined): string {
  if (!value) {
    return new Date().toISOString().split("T")[0];
  }
  return new Date(value).toISOString().split("T")[0];
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function stripMongoId<T extends { _id?: unknown }>(document: T): Omit<T, "_id"> {
  const { _id, ...rest } = document;
  return rest;
}

export interface IStorage {
  // Auth
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Egg Collection
  getEggCollections(): Promise<EggCollection[]>;
  createEggCollection(data: z.infer<typeof api.eggCollection.create.input>): Promise<EggCollection>;

  // Egg Sales
  getEggSales(): Promise<EggSales[]>;
  createEggSales(data: z.infer<typeof api.eggSales.create.input>): Promise<EggSales>;

  // Chicken Management
  getChickenManagement(): Promise<ChickenManagement[]>;
  createChickenManagement(data: z.infer<typeof api.chickens.create.input>): Promise<ChickenManagement>;

  // Disease Tracker
  getDiseaseRecords(): Promise<DiseaseRecord[]>;
  createDiseaseRecord(data: z.infer<typeof api.diseases.create.input>): Promise<DiseaseRecord>;

  // Inventory
  getInventory(): Promise<Inventory[]>;
  createInventory(data: z.infer<typeof api.inventory.create.input>): Promise<Inventory>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  createExpense(data: z.infer<typeof api.expenses.create.input>): Promise<Expense>;

  // Vaccinations
  getVaccinations(): Promise<Vaccination[]>;
  createVaccination(data: z.infer<typeof api.vaccinations.create.input>): Promise<Vaccination>;
}

export class DatabaseStorage implements IStorage {
  private async db() {
    return getMongoDbOrThrow();
  }

  // Auth
  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await this.db();
    const user = await db.collection<MongoDocument<User>>("users").findOne({ email });
    return user ? stripMongoId(user) : undefined;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const db = await this.db();
    const user = await db.collection<MongoDocument<User>>("users").findOne({ id });
    return user ? stripMongoId(user) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await this.db();
    const user: User = {
      id: await getNextSequence("users"),
      ...insertUser,
      createdAt: new Date(),
    };
    await db.collection<User>("users").insertOne(user);
    return user;
  }

  // Egg Collection
  async getEggCollections(): Promise<EggCollection[]> {
    const db = await this.db();
    const records = await db
      .collection<MongoDocument<EggCollection>>("egg_collection")
      .find({})
      .sort({ date: -1, id: -1 })
      .toArray();
    return records.map(stripMongoId);
  }

  async createEggCollection(data: z.infer<typeof api.eggCollection.create.input>): Promise<EggCollection> {
    const db = await this.db();
    const record: EggCollection = {
      id: await getNextSequence("egg_collection"),
      date: toDateOnly(data.date),
      eggsCollected: toNumber(data.eggsCollected),
      brokenEggs: toNumber(data.brokenEggs, 0),
      shed: data.shed,
      notes: data.notes ?? null,
    };
    await db.collection<EggCollection>("egg_collection").insertOne(record);
    return record;
  }

  // Egg Sales
  async getEggSales(): Promise<EggSales[]> {
    const db = await this.db();
    const records = await db
      .collection<MongoDocument<EggSales>>("egg_sales")
      .find({})
      .sort({ date: -1, id: -1 })
      .toArray();
    return records.map(stripMongoId);
  }

  async createEggSales(data: z.infer<typeof api.eggSales.create.input>): Promise<EggSales> {
    const db = await this.db();
    const record: EggSales = {
      id: await getNextSequence("egg_sales"),
      date: toDateOnly(data.date),
      eggsSold: toNumber(data.eggsSold),
      pricePerEgg: data.pricePerEgg.toString(),
      customerName: data.customerName,
      totalAmount: data.totalAmount.toString(),
      saleType: data.saleType ?? "Egg",
    };
    await db.collection<EggSales>("egg_sales").insertOne(record);
    return record;
  }

  // Chicken Management
  async getChickenManagement(): Promise<ChickenManagement[]> {
    const db = await this.db();
    const records = await db
      .collection<MongoDocument<ChickenManagement>>("chicken_management")
      .find({})
      .sort({ date: -1, id: -1 })
      .toArray();
    return records.map(stripMongoId);
  }

  async createChickenManagement(data: z.infer<typeof api.chickens.create.input>): Promise<ChickenManagement> {
    const db = await this.db();
    const record: ChickenManagement = {
      id: await getNextSequence("chicken_management"),
      date: toDateOnly(data.date),
      totalChickens: toNumber(data.totalChickens),
      healthy: toNumber(data.healthy),
      sick: toNumber(data.sick),
      dead: toNumber(data.dead),
      chicks: toNumber(data.chicks),
    };
    await db.collection<ChickenManagement>("chicken_management").insertOne(record);
    return record;
  }

  // Disease Records
  async getDiseaseRecords(): Promise<DiseaseRecord[]> {
    const db = await this.db();
    const records = await db
      .collection<MongoDocument<DiseaseRecord>>("disease_records")
      .find({})
      .sort({ date: -1, id: -1 })
      .toArray();
    return records.map(stripMongoId);
  }

  async createDiseaseRecord(data: z.infer<typeof api.diseases.create.input>): Promise<DiseaseRecord> {
    const db = await this.db();
    const record: DiseaseRecord = {
      id: await getNextSequence("disease_records"),
      date: toDateOnly(data.date),
      diseaseName: data.diseaseName,
      chickensAffected: toNumber(data.chickensAffected),
      treatment: data.treatment,
    };
    await db.collection<DiseaseRecord>("disease_records").insertOne(record);
    return record;
  }

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    const db = await this.db();
    const records = await db
      .collection<MongoDocument<Inventory>>("inventory")
      .find({})
      .sort({ purchaseDate: -1, id: -1 })
      .toArray();
    return records.map(stripMongoId);
  }

  async createInventory(data: z.infer<typeof api.inventory.create.input>): Promise<Inventory> {
    const db = await this.db();
    const record: Inventory = {
      id: await getNextSequence("inventory"),
      itemName: data.itemName,
      quantity: toNumber(data.quantity),
      purchaseDate: toDateOnly(data.purchaseDate),
      supplier: data.supplier,
      cost: data.cost.toString(),
    };
    await db.collection<Inventory>("inventory").insertOne(record);
    return record;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const db = await this.db();
    const records = await db
      .collection<MongoDocument<Expense>>("expenses")
      .find({})
      .sort({ date: -1, id: -1 })
      .toArray();
    return records.map(stripMongoId);
  }

  async createExpense(data: z.infer<typeof api.expenses.create.input>): Promise<Expense> {
    const db = await this.db();
    const record: Expense = {
      id: await getNextSequence("expenses"),
      date: toDateOnly(data.date),
      expenseType: data.expenseType,
      amount: data.amount.toString(),
      description: data.description ?? null,
    };
    await db.collection<Expense>("expenses").insertOne(record);
    return record;
  }

  // Vaccinations
  async getVaccinations(): Promise<Vaccination[]> {
    const db = await this.db();
    const records = await db
      .collection<MongoDocument<Vaccination>>("vaccinations")
      .find({})
      .sort({ date: -1, id: -1 })
      .toArray();
    return records.map(stripMongoId);
  }

  async createVaccination(data: z.infer<typeof api.vaccinations.create.input>): Promise<Vaccination> {
    const db = await this.db();
    const record: Vaccination = {
      id: await getNextSequence("vaccinations"),
      vaccineName: data.vaccineName,
      date: toDateOnly(data.date),
      chickensVaccinated: toNumber(data.chickensVaccinated),
      nextVaccination: toDateOnly(data.nextVaccination),
    };
    await db.collection<Vaccination>("vaccinations").insertOne(record);
    return record;
  }
}

export class MemoryStorage implements IStorage {
  private userId = 1;
  private eggCollectionId = 1;
  private eggSalesId = 1;
  private chickenManagementId = 1;
  private diseaseId = 1;
  private inventoryId = 1;
  private expenseId = 1;
  private vaccinationId = 1;

  private userRecords: User[] = [];
  private eggCollectionRecords: EggCollection[] = [];
  private eggSalesRecords: EggSales[] = [];
  private chickenRecords: ChickenManagement[] = [];
  private diseaseRecordsList: DiseaseRecord[] = [];
  private inventoryRecords: Inventory[] = [];
  private expenseRecords: Expense[] = [];
  private vaccinationRecords: Vaccination[] = [];

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRecords.find((user) => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.userRecords.find((user) => user.id === id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userId++,
      ...insertUser,
      createdAt: new Date(),
    };
    this.userRecords.push(user);
    return user;
  }

  async getEggCollections(): Promise<EggCollection[]> {
    return [...this.eggCollectionRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async createEggCollection(data: z.infer<typeof api.eggCollection.create.input>): Promise<EggCollection> {
    const record: EggCollection = {
      id: this.eggCollectionId++,
      date: toDateOnly(data.date),
      eggsCollected: Number(data.eggsCollected),
      brokenEggs: Number(data.brokenEggs ?? 0),
      shed: data.shed,
      notes: data.notes ?? null,
    };
    this.eggCollectionRecords.push(record);
    return record;
  }

  async getEggSales(): Promise<EggSales[]> {
    return [...this.eggSalesRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async createEggSales(data: z.infer<typeof api.eggSales.create.input>): Promise<EggSales> {
    const record: EggSales = {
      id: this.eggSalesId++,
      date: toDateOnly(data.date),
      eggsSold: Number(data.eggsSold),
      pricePerEgg: data.pricePerEgg.toString(),
      customerName: data.customerName,
      totalAmount: data.totalAmount.toString(),
      saleType: data.saleType ?? "Egg",
    };
    this.eggSalesRecords.push(record);
    return record;
  }

  async getChickenManagement(): Promise<ChickenManagement[]> {
    return [...this.chickenRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async createChickenManagement(data: z.infer<typeof api.chickens.create.input>): Promise<ChickenManagement> {
    const record: ChickenManagement = {
      id: this.chickenManagementId++,
      date: toDateOnly(data.date),
      totalChickens: Number(data.totalChickens),
      healthy: Number(data.healthy),
      sick: Number(data.sick),
      dead: Number(data.dead),
      chicks: Number(data.chicks),
    };
    this.chickenRecords.push(record);
    return record;
  }

  async getDiseaseRecords(): Promise<DiseaseRecord[]> {
    return [...this.diseaseRecordsList].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async createDiseaseRecord(data: z.infer<typeof api.diseases.create.input>): Promise<DiseaseRecord> {
    const record: DiseaseRecord = {
      id: this.diseaseId++,
      date: toDateOnly(data.date),
      diseaseName: data.diseaseName,
      chickensAffected: Number(data.chickensAffected),
      treatment: data.treatment,
    };
    this.diseaseRecordsList.push(record);
    return record;
  }

  async getInventory(): Promise<Inventory[]> {
    return [...this.inventoryRecords].sort(
      (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime(),
    );
  }

  async createInventory(data: z.infer<typeof api.inventory.create.input>): Promise<Inventory> {
    const record: Inventory = {
      id: this.inventoryId++,
      itemName: data.itemName,
      quantity: Number(data.quantity),
      purchaseDate: toDateOnly(data.purchaseDate),
      supplier: data.supplier,
      cost: data.cost.toString(),
    };
    this.inventoryRecords.push(record);
    return record;
  }

  async getExpenses(): Promise<Expense[]> {
    return [...this.expenseRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async createExpense(data: z.infer<typeof api.expenses.create.input>): Promise<Expense> {
    const record: Expense = {
      id: this.expenseId++,
      date: toDateOnly(data.date),
      expenseType: data.expenseType,
      amount: data.amount.toString(),
      description: data.description ?? null,
    };
    this.expenseRecords.push(record);
    return record;
  }

  async getVaccinations(): Promise<Vaccination[]> {
    return [...this.vaccinationRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async createVaccination(data: z.infer<typeof api.vaccinations.create.input>): Promise<Vaccination> {
    const record: Vaccination = {
      id: this.vaccinationId++,
      vaccineName: data.vaccineName,
      date: toDateOnly(data.date),
      chickensVaccinated: Number(data.chickensVaccinated),
      nextVaccination: toDateOnly(data.nextVaccination),
    };
    this.vaccinationRecords.push(record);
    return record;
  }
}

const shouldUseMemoryStorage =
  !isMongoConfigured && process.env.NODE_ENV !== "production";

export const storage: IStorage = shouldUseMemoryStorage
  ? new MemoryStorage()
  : new DatabaseStorage();
