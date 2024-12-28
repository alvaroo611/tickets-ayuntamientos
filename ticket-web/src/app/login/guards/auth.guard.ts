// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import {jwtDecode} from 'jwt-decode'; // Importación de jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.authService.getToken();
   
    if (!token) {
      console.warn('Acceso denegado: el usuario no ha iniciado sesión.');
      this.router.navigate(['/']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userRole = decoded.role;

      const allowedRoles = next.data['roles'];
      if (allowedRoles && allowedRoles.includes(userRole.toLowerCase())) {
        return true;
      } else {
        console.warn('Acceso denegado: el rol del usuario no es válido para esta ruta.');
        this.router.navigate(['/']);
        return false;
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.router.navigate(['/']);
      return false;
    }
  }
}
