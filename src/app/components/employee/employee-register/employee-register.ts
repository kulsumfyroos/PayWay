import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employee-register.html',
  styleUrls: ['./employee-register.css'],
})
export class EmployeeRegister implements AfterViewInit, OnDestroy {
  private submitHandler = (e: Event) => this.onSubmit(e);
  private outsideClickHandler = (e: Event) => this.onWindowClick(e);
  private realTimeHandlers: { elId: string; handler: (e: Event) => void }[] = [];

  private readonly firstNames = ["Vijay", "Nirav", "Mehul", "Harshad", "Ketan", "Ramalinga", "Gali", "Janardhan", "Mohammad", "Mansoor", "Parthasarathy", "Rana", "Subrata"];
  private readonly lastNames = ["Mallya", "Modi", "Choksi", "Mehta", "Parekh", "Raju", "Reddy", "Khan", "Kapoor", "Roy"];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Check login status and toggle navbar
    this.toggleNavbar();

    // Initialize employee ID
    const employeeIdEl = document.getElementById('employeeId') as HTMLInputElement | null;
    if (employeeIdEl) employeeIdEl.value = this.generateEmployeeId();

    // Auto-fill test data
    this.autoFillTestData();

    // Attach form submit handler
    const form = document.getElementById('registrationForm') as HTMLFormElement | null;
    if (form) form.addEventListener('submit', this.submitHandler);

    // Attach modal outside click handler
    window.addEventListener('click', this.outsideClickHandler);

    // Attach modal continue button
    const modalBtn = document.getElementById('modalContinueBtn') as HTMLButtonElement | null;
    if (modalBtn) modalBtn.addEventListener('click', () => this.redirectHome());

    // Real-time validation
    this.attachRealTimeValidation();
  }

  ngOnDestroy(): void {
    const form = document.getElementById('registrationForm') as HTMLFormElement | null;
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

  private toggleNavbar(): void {
    const isLoggedIn = localStorage.getItem('isEmployeeLoggedIn') === 'true';
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    const navbarNotLoggedIn = document.querySelector('.navbar_not_logged_in') as HTMLElement | null;

    if (navbar && navbarNotLoggedIn) {
      if (isLoggedIn) {
        navbar.style.display = 'flex';
        navbarNotLoggedIn.style.display = 'none';
      } else {
        navbar.style.display = 'none';
        navbarNotLoggedIn.style.display = 'flex';
      }
    }
  }

  private generateEmployeeId(): string {
    return String(Math.floor(Math.random() * 9000000) + 1000000);
  }

  private autoFillTestData(): void {
    const randomFirstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const randomLastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];

    const firstNameEl = document.getElementById('firstName') as HTMLInputElement | null;
    const lastNameEl = document.getElementById('lastName') as HTMLInputElement | null;
    if (firstNameEl) firstNameEl.value = randomFirstName;
    if (lastNameEl) lastNameEl.value = randomLastName;

    // Auto-fill employee role
    const roles = ['Teller', 'Manager', 'Auditor', 'Clerk'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const roleEl = document.getElementById('employeeRole') as HTMLSelectElement | null;
    if (roleEl) roleEl.value = randomRole;

    // Auto-fill email
    const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@fincorebms.com`;
    const emailEl = document.getElementById('email') as HTMLInputElement | null;
    if (emailEl) emailEl.value = email;

    // Fill password
    const password = `${randomFirstName.toLowerCase()}@ABC1234`;
    const passwordEl = document.getElementById('password') as HTMLInputElement | null;
    const confirmPasswordEl = document.getElementById('confirmPassword') as HTMLInputElement | null;
    if (passwordEl) passwordEl.value = password;
    if (confirmPasswordEl) confirmPasswordEl.value = password;

    // Gender auto select
    const genders = ['Male', 'Female', 'Other'];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    const genderEl = document.getElementById('emp_gender') as HTMLSelectElement | null;
    if (genderEl) genderEl.value = randomGender;

    // Fill DOB (25 years old)
    const today = new Date();
    const birthYear = today.getFullYear() - 25;
    const birthMonth = String(today.getMonth() + 1).padStart(2, '0');
    const birthDay = String(today.getDate()).padStart(2, '0');
    const dob = `${birthYear}-${birthMonth}-${birthDay}`;
    const dobEl = document.getElementById('emp_dob') as HTMLInputElement | null;
    if (dobEl) dobEl.value = dob;

    // Fill address
    const addresses = [
      '123 MG Road, Bangalore',
      '456 Park Street, Kolkata',
      '789 Marine Drive, Mumbai',
      '321 Connaught Place, Delhi',
      '654 Anna Salai, Chennai'
    ];
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const addressEl = document.getElementById('address') as HTMLTextAreaElement | null;
    if (addressEl) addressEl.value = randomAddress;

    // Fill Aadhaar and PAN
    const randomAadhaar = String(Math.floor(100000000000 + Math.random() * 900000000000));
    const aadhaarEl = document.getElementById('emp_aadhaar') as HTMLInputElement | null;
    if (aadhaarEl) aadhaarEl.value = randomAadhaar;

    const randomPan = 'ABCDE' + String(Math.floor(1000 + Math.random() * 9000)) + 'F';
    const panEl = document.getElementById('emp_pan') as HTMLInputElement | null;
    if (panEl) panEl.value = randomPan;

    const phoneNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
    const contactEl = document.getElementById('contactNumber') as HTMLInputElement | null;
    if (contactEl) contactEl.value = phoneNumber;
  }

  private onSubmit(e: Event): void {
    e.preventDefault();
    this.clearErrors();

    const employeeId = (document.getElementById('employeeId') as HTMLInputElement | null)?.value ?? '';
    const firstName = (document.getElementById('firstName') as HTMLInputElement | null)?.value.trim() ?? '';
    const lastName = (document.getElementById('lastName') as HTMLInputElement | null)?.value.trim() ?? '';
    const email = (document.getElementById('email') as HTMLInputElement | null)?.value.trim() ?? '';
    const password = (document.getElementById('password') as HTMLInputElement | null)?.value ?? '';
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement | null)?.value ?? '';
    const address = (document.getElementById('address') as HTMLTextAreaElement | null)?.value.trim() ?? '';
    const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement | null)?.value.trim() ?? '';
    const gender = (document.getElementById('emp_gender') as HTMLSelectElement | null)?.value ?? '';
    const empDob = (document.getElementById('emp_dob') as HTMLInputElement | null)?.value ?? '';
    const emp_aadhaar = (document.getElementById('emp_aadhaar') as HTMLInputElement | null)?.value.trim() ?? '';
    const emp_pan = (document.getElementById('emp_pan') as HTMLInputElement | null)?.value.trim() ?? '';
    const emp_role = (document.getElementById('employeeRole') as HTMLSelectElement | null)?.value ?? '';

    let isValid = true;

    if (!firstName || firstName.length === 0 || firstName.length > 50) {
      this.showError('firstName', 'First name is required (max 50 characters)');
      isValid = false;
    }

    if (!lastName || lastName.length === 0 || lastName.length > 50) {
      this.showError('lastName', 'Last name is required (max 50 characters)');
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      this.showError('email', 'Please enter a valid email address (e.g., name@example.com)');
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    if (!password || !passwordRegex.test(password)) {
      this.showError('password', 'Password must be 8-30 chars with uppercase, lowercase, number & special char (@$!%*?&)');
      isValid = false;
    }

    if (password !== confirmPassword) {
      this.showError('confirmPassword', 'Passwords do not match');
      isValid = false;
    }

    if (!address || address.length === 0 || address.length > 100) {
      this.showError('address', 'Address is required (max 100 characters)');
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!contactNumber || !phoneRegex.test(contactNumber)) {
      this.showError('contactNumber', 'Contact number must be exactly 10 digits');
      isValid = false;
    }

    if (!gender || gender.trim() === '') {
      this.showError('emp_gender', 'Please select a gender');
      isValid = false;
    }

    const age = this.calculateAge(empDob);
    if (!empDob || age < 18) {
      this.showError('emp_dob', 'Date of birth is required and age must be at least 18 years');
      isValid = false;
    }
    if (age < 0) {
      this.showError('emp_dob', 'Wow !! who invented time travel ? Future date not allowed');
      isValid = false;
    }
    if (age > 100) {
      this.showError('emp_dob', 'Too old to work here ! Age must be less than 100 years');
      isValid = false;
    }

    if (!isValid) return;

    const fullName = `${firstName} ${lastName}`;
    const modalEmployeeIdEl = document.getElementById('modalEmployeeId');
    const modalCustomerNameEl = document.getElementById('modalCustomerName');
    const modalEmailEl = document.getElementById('modalEmail');

    if (modalEmployeeIdEl) modalEmployeeIdEl.textContent = employeeId;
    if (modalCustomerNameEl) modalCustomerNameEl.textContent = fullName;
    if (modalEmailEl) modalEmailEl.textContent = email;

    const employeeData = {
      employeeId,
      firstName,
      lastName,
      email,
      address,
      contactNumber,
      gender,
      empDob,
      emp_aadhaar,
      emp_pan,
      emp_role
    };

    try {
      const existing = JSON.parse(localStorage.getItem('employees') || '[]');
      existing.push(employeeData);
      localStorage.setItem('employees', JSON.stringify(existing));
      this.showSuccessModal();
    } catch (e) {
      console.error('Failed to persist employee data to localStorage', e);
      this.showError('firstName', 'Failed to save employee data. See console.');
    }
  }

  private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
  }

  private showSuccessModal(): void {
    const modal = document.getElementById('successModal') as HTMLElement | null;
    if (modal) modal.style.display = 'block';
  }

  private redirectHome(): void {
    const modal = document.getElementById('successModal') as HTMLElement | null;
    if (modal) modal.style.display = 'none';
    setTimeout(() => {
      this.router.navigate(['/employee-login']);
    }, 300);
  }

  private onWindowClick(event: Event): void {
    const modal = document.getElementById('successModal') as HTMLElement | null;
    if (!modal) return;
    if (event.target === modal) modal.style.display = 'none';
  }

  private attachRealTimeValidation(): void {
    // Name fields
    ['firstName', 'lastName'].forEach(fieldId => {
      const el = document.getElementById(fieldId) as HTMLInputElement | null;
      if (el) {
        const h = (e: Event) => {
          const t = e.target as HTMLInputElement;
          if (t.value.trim().length > 0) {
            const group = t.closest('.form-group');
            if (group) group.classList.remove('error');
          }
        };
        el.addEventListener('input', h);
        this.realTimeHandlers.push({ elId: fieldId, handler: h });
      }
    });

    // Email
    const emailEl = document.getElementById('email') as HTMLInputElement | null;
    if (emailEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLInputElement;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(t.value)) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      emailEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'email', handler: h });
    }

    // Confirm Password
    const confirmPasswordEl = document.getElementById('confirmPassword') as HTMLInputElement | null;
    if (confirmPasswordEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLInputElement;
        const password = (document.getElementById('password') as HTMLInputElement | null)?.value ?? '';
        if (t.value === password && t.value.length > 0) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      confirmPasswordEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'confirmPassword', handler: h });
    }

    // Address
    const addressEl = document.getElementById('address') as HTMLTextAreaElement | null;
    if (addressEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLTextAreaElement;
        if (t.value.trim().length > 0) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      addressEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'address', handler: h });
    }

    // Contact Number
    const contactEl = document.getElementById('contactNumber') as HTMLInputElement | null;
    if (contactEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLInputElement;
        const phoneRegex = /^[0-9]{10}$/;
        if (phoneRegex.test(t.value)) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      contactEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'contactNumber', handler: h });
    }

    // Gender dropdown
    const genderEl = document.getElementById('emp_gender') as HTMLSelectElement | null;
    if (genderEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLSelectElement;
        if (t.value && t.value.trim() !== '') {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      genderEl.addEventListener('change', h);
      this.realTimeHandlers.push({ elId: 'emp_gender', handler: h as any });
    }

    // DOB
    const dobEl = document.getElementById('emp_dob') as HTMLInputElement | null;
    if (dobEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLInputElement;
        if (t.value) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      dobEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'emp_dob', handler: h });
    }

    // PAN validation
    const panEl = document.getElementById('emp_pan') as HTMLInputElement | null;
    if (panEl) {
      const h = (e: Event) => {
        const t = e.target as HTMLInputElement;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
        if (panRegex.test(t.value)) {
          const group = t.closest('.form-group');
          if (group) group.classList.remove('error');
        }
      };
      panEl.addEventListener('input', h);
      this.realTimeHandlers.push({ elId: 'emp_pan', handler: h });
    }
  }
}
