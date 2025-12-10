import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ExpenseFormComponent } from '../../components/expense-form/expense-form.component';
import { ButtonModule } from 'primeng/button';
import { SupabaseService } from '../../../../services/supabase.service';

@Component({
  selector: 'app-expenses-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardModule, ExpenseFormComponent, ButtonModule],
  templateUrl: './expenses.page.html',
})
export class ExpensesPage implements OnInit {
  showExpenseForm = false;
  expenses: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadExpenses();
  }

  async loadExpenses() {
    const { data, error } = await this.supabaseService.getExpenses();
    if (error) {
      console.error('Error loading expenses:', error);
    } else {
      this.expenses = data || [];
    }
  }

  async onSaveExpense(formValue: any) {
    console.log('Saving expense:', formValue);

    const expensePayload = {
      description: formValue.description,
      amount: formValue.price, // Map price to amount
      date: formValue.purchaseDate, // Map purchaseDate to date
      category: formValue.type, // Map type to category
      // TODO: Add other fields to Supabase schema if needed (observation, kws, etc.)
    };

    const { data, error } = await this.supabaseService.addExpense(expensePayload);
    if (error) {
      console.error('Error saving expense:', error);
    } else {
      console.log('Expense saved:', data);
      this.showExpenseForm = false;
      await this.loadExpenses();
    }
  }
}
