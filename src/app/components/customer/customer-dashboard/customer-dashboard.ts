import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css'],
})
export class CustomerDashboard implements AfterViewInit, OnDestroy {
  private logoutHandler = () => this.handleLogout();

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Check if customer is logged in
    this.checkLoginStatus();

    // Load customer data
    this.loadCustomerData();

    // Attach logout button handler
    const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement | null;
    if (logoutBtn) logoutBtn.addEventListener('click', this.logoutHandler);
  }

  ngOnDestroy(): void {
    const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement | null;
    if (logoutBtn) logoutBtn.removeEventListener('click', this.logoutHandler);
  }

  private checkLoginStatus(): void {
    const isLoggedIn = localStorage.getItem('isCustomerLoggedIn');
    const customerId = localStorage.getItem('customerId');
    if (!isLoggedIn || isLoggedIn !== 'true' || !customerId) {
      this.router.navigate(['/customer-login']);
    }
  }

  private loadCustomerData(): void {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;

    // Update welcome message
    const welcomeEl = document.getElementById('welcomeMessage') as HTMLElement | null;
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome, Customer #${customerId}`;
    }

    // Load customer details from localStorage
    try {
      const raw = localStorage.getItem('bankCustomers');
      const customers = JSON.parse(raw || '[]') || [];
      const customer = customers.find((c: any) => String(c.ssn) === String(customerId));

      if (customer) {
        this.displayCustomerInfo(customer);
      } else {
        console.warn('Customer data not found for ID:', customerId);
      }
    } catch (err) {
      console.error('Failed to load customer data:', err);
    }
  }

  private displayCustomerInfo(customer: any): void {
    // Update customer name
    const nameEl = document.getElementById('customerName') as HTMLElement | null;
    if (nameEl && customer.name) nameEl.textContent = customer.name;

    // Update account balance
    const balanceEl = document.getElementById('accountBalance') as HTMLElement | null;
    if (balanceEl && customer.balance !== undefined) {
      balanceEl.textContent = `₹${Number(customer.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }

    // Update account number
    const accountEl = document.getElementById('accountNumber') as HTMLElement | null;
    if (accountEl && customer.accountNumber) accountEl.textContent = customer.accountNumber;

    // Update email
    const emailEl = document.getElementById('customerEmail') as HTMLElement | null;
    if (emailEl && customer.email) emailEl.textContent = customer.email;
  }

  private handleLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('customerId');
      localStorage.removeItem('isCustomerLoggedIn');
      this.router.navigate(['/customer-login']);
    }
  }
}
