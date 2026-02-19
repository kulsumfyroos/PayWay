import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css'],
})
export class EmployeeDashboard implements AfterViewInit, OnDestroy {
  private logoutHandler = () => this.logout();
  private chartInstance: any = null;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Load dashboard data
    this.loadDashboardData();

    // Attach logout button handler
    const logoutBtn = document.querySelector('.logout-btn') as HTMLButtonElement | null;
    if (logoutBtn) logoutBtn.addEventListener('click', this.logoutHandler);
  }

  ngOnDestroy(): void {
    const logoutBtn = document.querySelector('.logout-btn') as HTMLButtonElement | null;
    if (logoutBtn) logoutBtn.removeEventListener('click', this.logoutHandler);

    // Destroy chart instance
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private logout(): void {
    localStorage.removeItem('employeeId');
    localStorage.setItem('isEmployeeLoggedIn', 'false');
    this.router.navigate(['/employee-login']);
  }

  private loadDashboardData(): void {
    const customers = JSON.parse(localStorage.getItem('bankCustomers') || '[]');
    const transactions = JSON.parse(localStorage.getItem('bankTransactions') || '[]');
    const loans = JSON.parse(localStorage.getItem('bankLoans') || '[]');

    // Update card counts
    const totalCustomersEl = document.getElementById('totalCustomers');
    const totalTransactionsEl = document.getElementById('totalTransactions');
    const pendingLoansEl = document.getElementById('pendingLoans');

    if (totalCustomersEl) totalCustomersEl.textContent = String(customers.length);
    if (totalTransactionsEl) totalTransactionsEl.textContent = String(transactions.length);
    if (pendingLoansEl) pendingLoansEl.textContent = String(loans.filter((l: any) => l.status === 'Pending').length);

    // Display recent transactions
    this.displayRecentTransactions(transactions);

    // Create chart
    this.createSummaryChart(transactions);

    // Set employee name/id display
    const employeeId = localStorage.getItem('employeeId') || '[EmployeeID Placeholder]';
    const employeeIdDisplayEl = document.getElementById('employeeIdDisplay');
    if (employeeIdDisplayEl) employeeIdDisplayEl.textContent = employeeId;
  }

  private displayRecentTransactions(transactions: any[]): void {
    const tableBody = document.getElementById('transactionTableBody');
    if (!tableBody) return;

    if (transactions.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No transactions yet</td></tr>';
      return;
    }

    const recentTxns = transactions.slice(-5).reverse();
    tableBody.innerHTML = recentTxns.map((txn: any) => `
      <tr>
        <td>${txn.customerName || 'N/A'}</td>
        <td><span class="status-${(txn.transactionType || '').toLowerCase()}">${txn.transactionType || 'N/A'}</span></td>
        <td>₹${parseFloat(txn.transactionAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td>${txn.transactionDate ? new Date(txn.transactionDate).toLocaleDateString('en-IN') : 'N/A'}</td>
      </tr>
    `).join('');
  }

  private createSummaryChart(transactions: any[]): void {
    const credits = transactions.filter((t: any) => t.transactionType === 'Credit').length;
    const debits = transactions.filter((t: any) => t.transactionType === 'Debit').length;

    const canvas = document.getElementById('summaryChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if Chart.js is available
    if (typeof (window as any).Chart === 'undefined') {
      console.warn('Chart.js is not loaded. Chart will not be displayed.');
      return;
    }

    const Chart = (window as any).Chart;

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Credits', 'Debits'],
        datasets: [{
          data: [credits, debits],
          backgroundColor: ['#27ae60', '#e74c3c'],
          borderColor: ['#229954', '#c0392b'],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 13, weight: '600', family: "'Poppins', sans-serif" },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    });
  }
}
