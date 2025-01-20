import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Pobierz rolę z localStorage
      const userRole = Number(localStorage.getItem('role'));
      
      // Pobierz dozwolone role z konfiguracji routingu
      const allowedRoles = route.data['allowedRoles'] as number[];

      if (!userRole || !allowedRoles.includes(userRole)) {
        // Możesz przekierować na stronę błędu lub dashboard
        this.router.navigate(['/calendar']);
        return false;
      }
      
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}