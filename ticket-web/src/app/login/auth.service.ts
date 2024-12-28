import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginDto } from './models/login.dto';



@Injectable({
  providedIn: 'root',
})
export class AuthService
{
  private loginUrl = 'http://localhost:3000/api/auth/login';

  constructor(private http: HttpClient) {}
    /**
   * Handles the login process by sending the login request to the backend.
   * On successful login, stores user-related data in localStorage.
   * @param loginDto - The login data (DNI and password).
   * @returns Observable containing the login response.
   */
  login(loginDto: LoginDto): Observable<any>
  {
    return this.http.post<any>(this.loginUrl, loginDto).pipe(
      tap(response => {
        if (response.access_token) {
          // Almacena el token en localStorage
          localStorage.setItem('authToken', response.access_token);

        }
        // Almacena el rol en localStorage
        if (response.employee && response.employee.rol)
        {

          localStorage.setItem('userRole', response.employee.rol);
          localStorage.setItem('dniTec',response.employee.DNI);
          if(response.employee.rol!=='super-admin')
          {
            localStorage.setItem('cityCouncil', response.employee.cityCouncil.id);
            localStorage.setItem('idResponsable',response.employee.department.departmentId);
          }


        }
      })
    );
  }

  /**
   * Retrieves the department responsible ID from localStorage.
   * @returns The department responsible ID, or null if not found.
   */
  getDepartmentResponsable(): string | null
  {
    return localStorage.getItem('idResponsable');
  }

   /**
   * Retrieves the user role from localStorage.
   * @returns The user role, or null if not found.
   */
 getToken(): string | null {
  return localStorage.getItem('authToken');
}

getUserRole(): string | null {
 return localStorage.getItem('userRole');
}
  /**
   * Retrieves the technician's DNI from localStorage.
   * @returns The technician's DNI, or null if not found.
   */
  getDniTec(): string | null
  {
    return localStorage.getItem('dniTec');
  }


  /**
   * Retrieves the city council ID from localStorage.
   * @returns The city council ID, or null if not found.
   */
  getCityCouncil():string |null
  {
    return localStorage.getItem('cityCouncil');
  }
}
