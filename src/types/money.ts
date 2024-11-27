export type SubscriptionFrequency = 'weekly' | 'monthly' | 'yearly';

export interface Subscription {
  id?: string;
  name: string;
  amount: number;
  frequency: SubscriptionFrequency;
  userId: string;
  createdAt: number;
} 