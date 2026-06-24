import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  accountNumber: string;
  amount: number;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:14108/api/transactions';
  private http = inject(HttpClient);

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // NEW: Method to send the updated status to the Java backend
  updateStatus(id: number, newStatus: string): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}/status`, `"${newStatus}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
