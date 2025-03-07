import { 
  type User, type InsertUser,
  type Indication, type InsertIndication,
  type Reward, type InsertReward
} from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByUid(uid: string): Promise<User | undefined>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>; // Adicionar na interface IStorage

  // Indication operations
  createIndication(userId: number, indication: InsertIndication): Promise<Indication>;
  getIndicationsByUserId(userId: number): Promise<Indication[]>;
  getAllIndications(): Promise<Indication[]>;
  updateIndicationStatus(id: number, status: string): Promise<Indication>;
  updateIndicationProposal(id: number, proposalLink: string): Promise<Indication>;

  // Reward operations
  createReward(userId: number, reward: InsertReward): Promise<Reward>;
  getActiveRewardByUserId(userId: number): Promise<Reward | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private indications: Map<number, Indication>;
  private rewards: Map<number, Reward>;
  private currentId: { users: number; indications: number; rewards: number };

  constructor() {
    this.users = new Map();
    this.indications = new Map();
    this.rewards = new Map();
    this.currentId = { users: 1, indications: 1, rewards: 1 };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      policyNumber: insertUser.policyNumber || null,
      isAdmin: insertUser.isAdmin || false
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createIndication(userId: number, insertIndication: InsertIndication): Promise<Indication> {
    const id = this.currentId.indications++;
    const indication: Indication = {
      ...insertIndication,
      id,
      userId,
      status: "pending",
      proposalLink: null,
      notificationSent: false,
      whatsappSent: false,
      createdAt: new Date()
    };
    this.indications.set(id, indication);
    return indication;
  }

  async getIndicationsByUserId(userId: number): Promise<Indication[]> {
    return Array.from(this.indications.values())
      .filter(indication => indication.userId === userId);
  }

  async getAllIndications(): Promise<Indication[]> {
    return Array.from(this.indications.values());
  }

  async updateIndicationStatus(id: number, status: string): Promise<Indication> {
    const indication = this.indications.get(id);
    if (!indication) throw new Error("Indication not found");
    const updatedIndication = { ...indication, status };
    this.indications.set(id, updatedIndication);
    return updatedIndication;
  }

  async updateIndicationProposal(id: number, proposalLink: string): Promise<Indication> {
    const indication = this.indications.get(id);
    if (!indication) throw new Error("Indication not found");
    const updatedIndication = { ...indication, proposalLink, whatsappSent: true };
    this.indications.set(id, updatedIndication);
    return updatedIndication;
  }

  async createReward(userId: number, insertReward: InsertReward): Promise<Reward> {
    const id = this.currentId.rewards++;
    const reward: Reward = {
      ...insertReward,
      id,
      userId,
      isActive: true,
      createdAt: new Date(),
      discountPercentage: insertReward.discountPercentage
    };
    this.rewards.set(id, reward);
    return reward;
  }

  async getActiveRewardByUserId(userId: number): Promise<Reward | undefined> {
    return Array.from(this.rewards.values())
      .find(reward => reward.userId === userId && reward.isActive);
  }

  async getAllUsers(): Promise<User[]> { // Adicionar na classe MemStorage
    return Array.from(this.users.values());
  }
}

export const storage = new MemStorage();