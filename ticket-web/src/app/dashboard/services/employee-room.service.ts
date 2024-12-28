import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEmployeeRoomDto } from './models/create-employee-room.dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoomService
{
  private apiUrl = 'http://localhost:3000/api/empleado-sala'; // Cambia esta URL a la correcta para tu backend


  /**
   * Constructor for the EmployeeRoomService.
   * @param http - Injecting the HttpClient service to make HTTP requests.
   */
  constructor(private http: HttpClient) {}


  /**
   * Fetches all employee room data.
   * @returns An observable with the list of all employee room records.
   */
  fetchEmployeeRoom(): Observable<any[]>
  {
    return this.http.get<any[]>(this.apiUrl);
  }

   /**
   * Creates a new employee room record.
   * @param employeRoom - The data to create a new employee room.
   * @returns An observable with the response after creating the employee room.
   */
  createEmployeeRoom(employeRoom:CreateEmployeeRoomDto): Observable<any[]>
  {
    return this.http.post<any[]>(this.apiUrl,employeRoom);
  }

   /**
   * Updates an existing employee room record by its ID.
   * @param id - The ID of the employee room to update.
   * @param updateEmployeeRoom - The updated data for the employee room.
   * @returns An observable with the response after updating the employee room.
   */
  updateEmployeeRoom(id: string,updateEmployeeRoom:CreateEmployeeRoomDto): Observable<any>
  {
    return this.http.patch<any>(`${this.apiUrl}/${id}`,updateEmployeeRoom);
  }

  /**
   * Fetches an employee room record by its ID.
   * @param id - The ID of the employee room to fetch.
   * @returns An observable with the employee room data for the given ID.
   */
  getEmpleadoSalaById(id: string): Observable<any>
  {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
