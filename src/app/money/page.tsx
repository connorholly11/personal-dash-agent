'use client';

import { useState, useEffect } from 'react';
import { Subscription, SubscriptionFrequency } from '@/types/money';
import { saveSubscription, getSubscriptions, deleteSubscription } from '@/lib/money-storage';

export default function MoneyPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: 0,
    frequency: 'monthly' as SubscriptionFrequency
  });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    const subs = await getSubscriptions();
    setSubscriptions(subs);
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubscription.name && newSubscription.amount > 0) {
      await saveSubscription(
        newSubscription.name,
        newSubscription.amount,
        newSubscription.frequency
      );
      setNewSubscription({ name: '', amount: 0, frequency: 'monthly' });
      setIsAddingSubscription(false);
      loadSubscriptions();
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      await deleteSubscription(id);
      loadSubscriptions();
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateMonthlyTotal = () => {
    return subscriptions.reduce((total, sub) => {
      switch (sub.frequency) {
        case 'weekly':
          return total + (sub.amount * 52) / 12;
        case 'monthly':
          return total + sub.amount;
        case 'yearly':
          return total + sub.amount / 12;
        default:
          return total;
      }
    }, 0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Money Dashboard</h1>

      {/* Subscriptions Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subscriptions</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Monthly Total: {formatAmount(calculateMonthlyTotal())}
          </div>
        </div>

        {/* Add Subscription Form */}
        {!isAddingSubscription ? (
          <button
            onClick={() => setIsAddingSubscription(true)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium mb-6"
          >
            Add New Subscription
          </button>
        ) : (
          <form onSubmit={handleAddSubscription} className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={newSubscription.name}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={newSubscription.amount}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency
              </label>
              <select
                value={newSubscription.frequency}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, frequency: e.target.value as SubscriptionFrequency }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingSubscription(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Subscriptions List */}
        <div className="space-y-4">
          {subscriptions.map(subscription => (
            <div
              key={subscription.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{subscription.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatAmount(subscription.amount)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    per {subscription.frequency}
                  </span>
                </div>
              </div>
              <button
                onClick={() => subscription.id && handleDeleteSubscription(subscription.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 