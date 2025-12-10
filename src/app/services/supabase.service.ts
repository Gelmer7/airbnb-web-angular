import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // TODO: Move these to environment files
  private supabaseUrl = 'https://ldbgfinipppckroxcqpa.supabase.co';
  private supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYmdmaW5pcHBwY2tyb3hjcXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjA1NDcsImV4cCI6MjA4MDg5NjU0N30.rNSbOAF3ILu6vYOxj-e8Krw1J5ZZYNqaHAshKg0Mp7A';

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        persistSession: false, // Fixes NavigatorLockAcquireTimeoutError for basic test
      },
    });
  }

  get client() {
    return this.supabase;
  }

  // Check connection by getting the current session (doesn't require tables)
  async checkConnection() {
    return await this.supabase.auth.getSession();
  }

  // Example method to test connection
  async getProperties() {
    return await this.supabase.from('properties').select('*');
  }

  async getExpenses() {
    return await this.supabase.from('expenses').select('*').order('date', { ascending: false });
  }

  async addExpense(expense: Omit<Expense, 'id' | 'created_at'>) {
    return await this.supabase.from('expenses').insert(expense).select();
  }
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  created_at: string;
}
