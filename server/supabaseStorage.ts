import { db } from './db';
import * as schema from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import type { IStorage, InsertUser, User, InsertIndication, Indication, InsertReward, Reward } from './storage';

export class SupabaseStorage implements IStorage {

  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values(insertUser).returning();
    if (!newUser) throw new Error("Failed to create user");
    // Ensure the returned object matches the User interface, especially boolean fields
    return {
        ...newUser,
        isAdmin: newUser.isAdmin ?? false, // Handle potential null from DB
        policyNumber: newUser.policyNumber ?? undefined // Handle potential null
    };
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.uid, uid)).limit(1);
    if (!user) return undefined;
    return {
        ...user,
        isAdmin: user.isAdmin ?? false,
        policyNumber: user.policyNumber ?? undefined
    };
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    if (!user) return undefined;
    return {
        ...user,
        isAdmin: user.isAdmin ?? false,
        policyNumber: user.policyNumber ?? undefined
    };
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db.update(schema.users).set(data).where(eq(schema.users.id, id)).returning();
    if (!updatedUser) throw new Error("User not found or failed to update");
    return {
        ...updatedUser,
        isAdmin: updatedUser.isAdmin ?? false,
        policyNumber: updatedUser.policyNumber ?? undefined
    };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await db.select().from(schema.users);
    return users.map(user => ({
        ...user,
        isAdmin: user.isAdmin ?? false,
        policyNumber: user.policyNumber ?? undefined
    }));
  }

  // Indication operations
  async createIndication(userId: number, insertIndication: InsertIndication): Promise<Indication> {
    const indicationData = {
        ...insertIndication,
        userId,
        status: 'pending',
        proposalLink: insertIndication.proposalLink || null,
        notificationSent: insertIndication.notificationSent || false,
        whatsappSent: insertIndication.whatsappSent || false,
    };
    const [newIndication] = await db.insert(schema.indications).values(indicationData).returning();
    if (!newIndication) throw new Error("Failed to create indication");
    return newIndication;
  }

  async getIndicationById(id: number): Promise<Indication | undefined> {
    const [indication] = await db.select().from(schema.indications).where(eq(schema.indications.id, id)).limit(1);
    return indication;
  }

  async getIndicationsByUserId(userId: number): Promise<Indication[]> {
    return await db.select().from(schema.indications).where(eq(schema.indications.userId, userId));
  }

  async getAllIndications(): Promise<Indication[]> {
    return await db.select().from(schema.indications);
  }

  async updateIndication(id: number, data: Partial<Omit<Indication, 'id' | 'userId' | 'createdAt'>>): Promise<Indication> {
    const [updatedIndication] = await db.update(schema.indications).set(data).where(eq(schema.indications.id, id)).returning();
    if (!updatedIndication) throw new Error("Indication not found or failed to update");
    return updatedIndication;
  }

  async updateIndicationStatus(id: number, status: string): Promise<Indication> {
    return this.updateIndication(id, { status });
  }

  async updateIndicationProposal(id: number, proposalLink: string): Promise<Indication> {
     // Ao atualizar o link da proposta, também marcamos o whatsapp como enviado, conforme lógica anterior
    return this.updateIndication(id, { proposalLink, whatsappSent: true });
  }

  // Reward operations
  async createReward(userId: number, insertReward: InsertReward): Promise<Reward> {
    const rewardData = {
        ...insertReward,
        userId,
        isActive: true,
    };
    const [newReward] = await db.insert(schema.rewards).values(rewardData).returning();
    if (!newReward) throw new Error("Failed to create reward");
    return newReward;
  }

  async getActiveRewardByUserId(userId: number): Promise<Reward | undefined> {
    const [reward] = await db.select().from(schema.rewards).where(and(eq(schema.rewards.userId, userId), eq(schema.rewards.isActive, true))).limit(1);
    return reward;
  }
}