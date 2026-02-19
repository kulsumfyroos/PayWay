import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { EmployeeLogin } from './components/employee/employee-login/employee-login';
import { EmployeeRegister } from './components/employee/employee-register/employee-register';
import { EmployeeDashboard } from './components/employee/employee-dashboard/employee-dashboard';
import { CustomerLogin } from './components/customer/customer-login/customer-login';
import { CustomerRegister } from './components/customer/customer-register/customer-register';
import { CustomerDashboard } from './components/customer/customer-dashboard/customer-dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },

  // Employee routes
  { path: 'employee-login', component: EmployeeLogin },
  { path: 'employee-register', component: EmployeeRegister },
  { path: 'employee-dashboard', component: EmployeeDashboard },

  // Customer routes
  { path: 'customer-login', component: CustomerLogin },
  { path: 'customer-register', component: CustomerRegister },
  { path: 'customer-dashboard', component: CustomerDashboard },

  // Fallback
  { path: '**', redirectTo: '' }
];
