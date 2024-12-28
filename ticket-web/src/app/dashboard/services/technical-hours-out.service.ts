import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTechnicalHoursOutDto } from './models/create-technical-hours-out.dto';

@Injectable({
  providedIn: 'root',
})
export class TechnicalHoursOutService
{
  private baseUrl = 'http://localhost:3000/api/technical-hours-out'; // Cambia esta URL según tu configuración

  constructor(private http: HttpClient) {}

  /**
   * Crear un nuevo registro de horas fuera del técnico
   * @param createDto Datos para crear un nuevo registro
   * @returns Observable con la respuesta del servidor
   */
  create(createDto: CreateTechnicalHoursOutDto): Observable<any>
  {
    return this.http.post(`${this.baseUrl}`, createDto);
  }

  /**
   * Obtener todos los registros de horas fuera del técnico
   * @returns Observable con la lista de registros
   */
  findAll(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  /**
   * Obtener un registro específico de horas fuera del técnico por ID
   * @param id ID del registro
   * @returns Observable con los datos del registro
   */
  findOne(id: string): Observable<any>
  {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Actualizar un registro específico de horas fuera del técnico
   * @param id ID del registro a actualizar
   * @param updateDto Datos para actualizar el registro
   * @returns Observable con la respuesta del servidor
   */
  update(id: string, updateDto: CreateTechnicalHoursOutDto): Observable<any>
  {
    return this.http.patch(`${this.baseUrl}/${id}`, updateDto);
  }
}
