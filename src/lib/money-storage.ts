import { db } from './db';
import type { Subscription } from '@/types/money';

const TEMP_USER_ID = 'temp-user';

export async function saveSubscription(name: string, amount: number, frequency: Subscription['frequency']): Promise<Subscription> {
  const subscription: Omit<Subscription, 'id'> = {
    name,
    amount,
    frequency,
    userId: TEMP_USER_ID,
    createdAt: Date.now()
  };

  const id = await db.subscriptions.add(subscription);
  return await db.subscriptions.get(id) as Subscription;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return await db.subscriptions
    .where('userId')
    .equals(TEMP_USER_ID)
    .toArray();
}

export async function deleteSubscription(subscriptionId: string): Promise<void> {
  await db.subscriptions.delete(subscriptionId);
} 