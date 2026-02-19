import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-login.html',
  styleUrls: ['./customer-login.css'],
})
export class CustomerLogin implements AfterViewInit, OnDestroy {
  private submitHandler = (e: Event) => this.onSubmit(e);
  private outsideClickHandler = (e: Event) => this.onWindowClick(e);
  private realTimeHandlers: { elId: string; handler: (e: Event) => void }[] = [];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // attach form submit handler
    const form = document.getElementById('loginForm') as HTMLFormElement | null;
    if (form) form.addEventListener('submit', this.submitHandler);

    // attach modal outside click handler
    window.addEventListener('click', this.outsideClickHandler);

    // attach modal continue button
    const modalBtn = document.getElementById('modalContinueBtn') as HTMLButtonElement | null;
    if (modalBtn) modalBtn.addEventListener('click', () => this.redirectHome());

    // Real-time validation for customerId
    const customerIdEl = document.getElementById('customerId') as HTMLInputElement | null;
    if (customerIdEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLInputElement;
        if (t.value.trim().length >= 7) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      customerIdEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'customerId', handler: h });
    }

    // Real-time validation for password
    const passwordEl = document.getElementById('password') as HTMLInputElement | null;
    if (passwordEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLInputElement;
        if (t.value.length > 0) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      passwordEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'password', handler: h });
    }
  }

  ngOnDestroy(): void {
    const form = document.getElementById('loginForm') as HTMLFormElement | null;
    if (form) form.removeEventListener('submit', this.submitHandler);
    window.removeEventListener('click', this.outsideClickHandler);

    const modalBtn = document.getElementById('modalContinueBtn') as HTMLButtonElement | null;
    if (modalBtn) modalBtn.removeEventListener('click', () => this.redirectHome());

    this.realTimeHandlers.forEach(({ elId, handler }) => {
      const el = document.getElementById(elId);
      if (el) el.removeEventListener('input', handler);
    });
    this.realTimeHandlers = [];
  }

  private onSubmit(e: Event): void {
    e.preventDefault();

    const customerId = (document.getElementById('customerId') as HTMLInputElement | null)?.value.trim() ?? '';
    const password = (document.getElementById('password') as HTMLInputElement | null)?.value ?? '';

    this.clearErrors();

    // Validate Customer ID
    if (customerId.length < 7 || isNaN(Number(customerId))) {
      this.showError('customerId', 'Customer ID must be 7 digits');
      return;
    }

    // Validate Password
    if (!password || password.length > 30 || password.length < 8) {
      this.showError('password', 'Password length 8 to 30 characters are required');
      return;
    }

    // Password complexity validation
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /[0-9]/;
    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;

    if (
      !specialCharPattern.test(password) ||
      !numberPattern.test(password) ||
      !upperCasePattern.test(password) ||
      !lowerCasePattern.test(password)
    ) {
      this.showError('password', 'Password must contain at least one special character, one number, one uppercase and one lowercase letter');
      return;
    }

    if (password.length > 30) {
      this.showError('password', 'Password must not exceed 30 characters');
      return;
    }

    // Store login info and show success modal
    try {
      localStorage.setItem('customerId', customerId);
      localStorage.setItem('isCustomerLoggedIn', 'true');
      console.log('Customer logged in:', customerId);
    } catch (e) {
      console.error('LocalStorage is not available.', e);
    }

    try {
      this.showSuccessModal();
    } catch (e) {
      console.error('Failed to show success modal, redirecting directly.', e);
      window.location.href = 'customer-dashboard.html';
    }
  }

  private showError(fieldId: string, message: string): void {
    const el = document.getElementById(fieldId) as HTMLElement | null;
    const formGroup = el?.closest('.form-group') as HTMLElement | null;
    if (formGroup) {
      formGroup.classList.add('error');
      const errorMsg = formGroup.querySelector('.error-message') as HTMLElement | null;
      if (errorMsg) errorMsg.textContent = message;
    }
  }

  private clearErrors(): void {
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });
  }

  private showSuccessModal(): void {
    const modal = document.getElementById('successModal') as HTMLElement | null;
    if (modal) modal.style.display = 'block';
  }

  private redirectHome(): void {
    const modal = document.getElementById('successModal') as HTMLElement | null;
    if (modal) modal.style.display = 'none';
    setTimeout(() => {
      this.router.navigate(['/customer-dashboard']);
    }, 100);
  }

  private onWindowClick(event: Event): void {
    const modal = document.getElementById('successModal') as HTMLElement | null;
    if (!modal) return;
    if (event.target === modal) modal.style.display = 'none';
  }
}
