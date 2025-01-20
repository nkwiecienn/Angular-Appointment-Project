import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getUserRole(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const role = localStorage.getItem('role');
      return role ? Number(role) : null;
    }
    return null;
  }

  isPatient(): boolean {
    return this.getUserRole() === 1;
  }

  isDoctor(): boolean {
    return this.getUserRole() === 2;
  }

  hasAnyRole(roles: number[]): boolean {
    const userRole = this.getUserRole();
    return userRole !== null && roles.includes(userRole);
  }
}