import { db } from "./db";
import { 
  users, eggCollection, eggSales, chickenManagement, diseaseRecords, 
  inventory, expenses, vaccinations,
  type User, type EggCollection, type EggSales, type ChickenManagement,
  type DiseaseRecord, type Inventory, type Expense, type Vaccination,
  type InsertUser
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { api } from "@shared/routes";

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
  // Auth
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Egg Collection
  async getEggCollections(): Promise<EggCollection[]> {
    return await db.select().from(eggCollection).orderBy(desc(eggCollection.date));
  }

  async createEggCollection(data: z.infer<typeof api.eggCollection.create.input>): Promise<EggCollection> {
    const [record] = await db.insert(eggCollection).values({
      ...data,
      date: new Date(data.date).toISOString().split('T')[0]
    }).returning();
    return record;
  }

  // Egg Sales
  async getEggSales(): Promise<EggSales[]> {
    return await db.select().from(eggSales).orderBy(desc(eggSales.date));
  }

  async createEggSales(data: z.infer<typeof api.eggSales.create.input>): Promise<EggSales> {
    const [record] = await db.insert(eggSales).values({
      ...data,
      date: new Date(data.date).toISOString().split('T')[0],
      pricePerEgg: data.pricePerEgg.toString(),
      totalAmount: data.totalAmount.toString()
    }).returning();
    return record;
  }

  // Chicken Management
  async getChickenManagement(): Promise<ChickenManagement[]> {
    return await db.select().from(chickenManagement).orderBy(desc(chickenManagement.date));
  }

  async createChickenManagement(data: z.infer<typeof api.chickens.create.input>): Promise<ChickenManagement> {
    const [record] = await db.insert(chickenManagement).values(data).returning();
    return record;
  }

  // Disease Records
  async getDiseaseRecords(): Promise<DiseaseRecord[]> {
    return await db.select().from(diseaseRecords).orderBy(desc(diseaseRecords.date));
  }

  async createDiseaseRecord(data: z.infer<typeof api.diseases.create.input>): Promise<DiseaseRecord> {
    const [record] = await db.insert(diseaseRecords).values({
      ...data,
      date: new Date(data.date).toISOString().split('T')[0]
    }).returning();
    return record;
  }

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory).orderBy(desc(inventory.purchaseDate));
  }

  async createInventory(data: z.infer<typeof api.inventory.create.input>): Promise<Inventory> {
    const [record] = await db.insert(inventory).values({
      ...data,
      purchaseDate: new Date(data.purchaseDate).toISOString().split('T')[0],
      cost: data.cost.toString()
    }).returning();
    return record;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses).orderBy(desc(expenses.date));
  }

  async createExpense(data: z.infer<typeof api.expenses.create.input>): Promise<Expense> {
    const [record] = await db.insert(expenses).values({
      ...data,
      date: new Date(data.date).toISOString().split('T')[0],
      amount: data.amount.toString()
    }).returning();
    return record;
  }

  // Vaccinations
  async getVaccinations(): Promise<Vaccination[]> {
    return await db.select().from(vaccinations).orderBy(desc(vaccinations.date));
  }

  async createVaccination(data: z.infer<typeof api.vaccinations.create.input>): Promise<Vaccination> {
    const [record] = await db.insert(vaccinations).values({
      ...data,
      date: new Date(data.date).toISOString().split('T')[0],
      nextVaccination: new Date(data.nextVaccination).toISOString().split('T')[0]
    }).returning();
    return record;
  }
}

export const storage = new DatabaseStorage();
