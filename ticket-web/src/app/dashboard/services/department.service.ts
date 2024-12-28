import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateDepartmentDto } from './models/create-department.dto';
import { CreateDepartmentConfigurationDto } from './models/create-department-configuration.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService
{
  private apiUrl = 'http://localhost:3000/api/departamento'; // Cambia esta URL a la correcta para tu backend
  private configureUrlByIdDepartment = 'http://localhost:3000/api/department-configuration/department';
  private configureUrl='http://localhost:3000/api/department-configuration';
  private departmentsActive = 'http://localhost:3000/api/departamento/active';

  /**
   * Constructor for the DepartmentService.
   * @param http - Injecting the HttpClient service to make HTTP requests.
   */
  constructor(private http: HttpClient) {}



   /**
   * Gets the appointments for a department on a specific date.
   * @param departmentId - The ID of the department.
   * @param date - The date to fetch appointments for.
   * @returns An observable with the appointments for the department on the specified date.
   */
  getAppointmentsByDate(departmentId: string, date: string): Observable<any>
  {
    const url = `${this.apiUrl}/appointments/${departmentId}?date=${date}`;
    return this.http.get<any>(url);
  }

  /**
   * Fetches all active departments.
   * @returns An observable with the list of active departments.
   */
  fetchDepartmentsActive(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.departmentsActive}`);
  }

   /**
   * Fetches the configuration for a specific department by its ID.
   * @param departmentId - The ID of the department.
   * @returns An observable with the department configuration.
   */
  findConfigureDepartmentByDepartmentId(departmentId:string):Observable<any>
  {
    const url = `${this.configureUrlByIdDepartment}/${departmentId}`;
    return this.http.get(url);
  }

   /**
   * Updates the configuration for a specific department.
   * @param departmentId - The ID of the department to update.
   * @param configDepartment - The configuration data to update the department with.
   * @returns An observable that emits the result of the update operation.
   */
  updateDepartmentConfiguration(departmentId: string, configDepartment: CreateDepartmentConfigurationDto): Observable<any>
  {
    const url = `${this.configureUrl}/${departmentId}`; // Construir la URL correctamente
    return this.http.patch(url, configDepartment); // Enviamos la solicitud PATCH
  }

  /**
   * Fetches all departments.
   * @returns An observable with the list of all departments.
   */
  fetchDepartments(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /**
   * Fetches a department by its ID.
   * @param departmentId - The ID of the department.
   * @returns An observable with the department data.
   */
  findDepartmentById(departmentId:string):Observable<any>
  {
    const url = `${this.apiUrl}/${departmentId}`;
    return this.http.get(url);
  }


  /**
   * Updates a specific department.
   * @param departmentId - The ID of the department to update.
   * @param department - The updated department data.
   * @returns An observable that emits the result of the update operation.
   */
  updateDepartment(departmentId:string,department: CreateDepartmentDto): Observable<any> {
    const url = `${this.apiUrl}/${departmentId}`;
    return this.http.patch(url,department);

  }


   /**
   * Creates a new department.
   * @param department - The department data to create.
   * @returns An observable that emits the result of the creation operation.
   */
  createDepartment(department: CreateDepartmentDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, department, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }


}
