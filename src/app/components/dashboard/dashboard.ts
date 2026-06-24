import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService, Transaction } from '../../services/transaction';
// New Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Add the modules to your imports array
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);
  isLoading = false;
  
  // Define columns to display
  displayedColumns: string[] = ['id', 'accountNumber', 'amount', 'status', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data.sort((a, b) => b.id - a.id);
        this.cdr.detectChanges();
      }
    });
  }

  handleAction(id: number, action: string) {
    this.isLoading = true; // Start spinner
    this.transactionService.updateStatus(id, action).subscribe({
      next: () => {
        this.loadTransactions();
        this.isLoading = false; // Stop spinner
      }
    });
  }
}