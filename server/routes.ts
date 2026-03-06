import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Using Replit AI integrations blueprint
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth routes (mock JWT for now)
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ token: "mock-jwt-token-" + user.id, user });
    } catch (err) {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const user = await storage.createUser(input);
      res.status(201).json({ token: "mock-jwt-token-" + user.id, user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Error creating user" });
      }
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer mock-jwt-token-")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const id = parseInt(authHeader.replace("Bearer mock-jwt-token-", ""));
    const user = await storage.getUserById(id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(user);
  });

  // Egg Collection
  app.get(api.eggCollection.list.path, async (req, res) => {
    const records = await storage.getEggCollections();
    res.json(records);
  });

  app.post(api.eggCollection.create.path, async (req, res) => {
    try {
      const input = api.eggCollection.create.input.parse(req.body);
      const record = await storage.createEggCollection(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  });

  // Egg Sales
  app.get(api.eggSales.list.path, async (req, res) => {
    const records = await storage.getEggSales();
    res.json(records);
  });

  app.post(api.eggSales.create.path, async (req, res) => {
    try {
      const input = api.eggSales.create.input.parse(req.body);
      const record = await storage.createEggSales(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  });

  // Chickens
  app.get(api.chickens.list.path, async (req, res) => {
    const records = await storage.getChickenManagement();
    res.json(records);
  });

  app.post(api.chickens.create.path, async (req, res) => {
    try {
      const input = api.chickens.create.input.parse(req.body);
      const record = await storage.createChickenManagement(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  });

  // Diseases
  app.get(api.diseases.list.path, async (req, res) => {
    const records = await storage.getDiseaseRecords();
    res.json(records);
  });

  app.post(api.diseases.create.path, async (req, res) => {
    try {
      const input = api.diseases.create.input.parse(req.body);
      const record = await storage.createDiseaseRecord(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  });

  // Inventory
  app.get(api.inventory.list.path, async (req, res) => {
    const records = await storage.getInventory();
    res.json(records);
  });

  app.post(api.inventory.create.path, async (req, res) => {
    try {
      const input = api.inventory.create.input.parse(req.body);
      const record = await storage.createInventory(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  });

  // Expenses
  app.get(api.expenses.list.path, async (req, res) => {
    const records = await storage.getExpenses();
    res.json(records);
  });

  app.post(api.expenses.create.path, async (req, res) => {
    try {
      const input = api.expenses.create.input.parse(req.body);
      const record = await storage.createExpense(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  });

  // Vaccinations
  app.get(api.vaccinations.list.path, async (req, res) => {
    const records = await storage.getVaccinations();
    res.json(records);
  });

  app.post(api.vaccinations.create.path, async (req, res) => {
    try {
      const input = api.vaccinations.create.input.parse(req.body);
      const record = await storage.createVaccination(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  });

  // AI Chat
  app.post(api.ai.chat.path, async (req, res) => {
    try {
      const { message } = api.ai.chat.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { 
            role: "system", 
            content: "You are an AI assistant for a poultry farm called 'Poultry Egg Tracker'. You help farmers with egg production, chicken health, disease treatment (like Newcastle disease), and farm finances. Provide concise, helpful answers." 
          },
          { role: "user", content: message }
        ],
      });

      res.json({ response: response.choices[0]?.message?.content || "I couldn't process that request." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error communicating with AI assistant" });
    }
  });

  // Seed data function to provide realistic example data
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  try {
    const users = await storage.getUserByEmail("admin@poultry.com");
    if (!users) {
      await storage.createUser({
        name: "Admin Farmer",
        email: "admin@poultry.com",
        password: "password123",
        role: "admin"
      });
      
      const today = new Date().toISOString().split('T')[0];
      
      await storage.createChickenManagement({
        totalChickens: 1000,
        healthy: 980,
        sick: 15,
        dead: 5,
        chicks: 200
      });
      
      await storage.createEggCollection({
        date: today,
        eggsCollected: 850,
        shed: "Shed A",
        notes: "Normal collection"
      });
      
      await storage.createEggSales({
        date: today,
        eggsSold: 800,
        pricePerEgg: 5,
        customerName: "Local Market",
        saleType: "Egg",
        totalAmount: 4000
      });
      
      await storage.createExpense({
        date: today,
        expenseType: "Feed purchase",
        amount: 2500,
        description: "50kg layers mash"
      });
    }
  } catch (e) {
    console.error("Seed database failed:", e);
  }
}
