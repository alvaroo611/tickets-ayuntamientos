import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEmployeeDto } from './models/create-empleado.dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService
{


  private getAllActive='http://localhost:3000/api/auth/active';
  private apiUrl = 'http://localhost:3000/api/auth';
  private updatePasswordUrl = 'http://localhost:3000/api/auth/updatePasswordSuperAdmin';

   /**
   * Constructor for the EmployeeService.
   * @param http - Injecting the HttpClient service to make HTTP requests.
   */
  constructor(private http: HttpClient) { }

   /**
   * Fetches an employee by their DNI (ID).
   * @param DNI - The DNI (ID) of the employee to fetch.
   * @returns An observable with the employee data.
   */
  findEmployeeByDNI(DNI: string): Observable<any>
  {
    const url = `${this.apiUrl}/${DNI}`; // Construye la URL con el DNI
    return this.http.get<any>(url); // Realiza la solicitud GET
  }


   /**
   * Fetches a list of all active employees.
   * @returns An observable with the list of active employees.
   */
  fetchEmployeesActive(): Observable<any[]>
  {
    return this.http.get<any[]>(this.getAllActive);
  }



  /**
   * Fetches the list of all employees.
   * @returns An observable with the list of employees.
   */
  fetchEmployees(): Observable<any[]>
  {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Creates a new employee record.
   * @param employee - The employee data to create a new record.
   * @returns An observable with the response after creating the employee.
   */
  createEmployee(employee: CreateEmployeeDto): Observable<any>
  {
    return this.http.post(this.apiUrl, employee);
  }

  /**
   * Updates an existing employee record.
   * @param employee - The updated employee data.
   * @returns An observable with the response after updating the employee.
   */
  updateEmployee(employee: CreateEmployeeDto): Observable<any>
  {
    const url = `${this.apiUrl}/${employee.DNI}`; // Añade `dni` del empleado al final de la URL
    return this.http.patch(url, employee); // Envía `employee` como el cuerpo de la solicitud
  }


  /**
   * Llama al backend para actualizar la contraseña del super admin.
   * @param newPassword La nueva contraseña para el super admin.
   * @returns Un Observable con la respuesta del servidor.
   */
  updatePassword(password: any): Observable<any> {
    console.log(password)
    return this.http.patch(this.updatePasswordUrl, password );  // Usamos PATCH si se está actualizando un recurso
  }


}
