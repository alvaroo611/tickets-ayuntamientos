import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateCityCouncilDto } from "./models/create-city-council.dto";

@Injectable({
  providedIn: 'root',
})
export class CityCouncilService
{
  private apiUrl = 'http://localhost:3000/api/ayuntamiento'; // Cambia esta URL según tu backend
  private apiUrlActive = 'http://localhost:3000/api/ayuntamiento/active';

  /**
   * Constructor for the CityCouncilService.
   * @param http - Injecting the HttpClient service to make HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Updates the data of a specific city council.
   * @param id - The ID of the city council to update.
   * @param createCityCouncil - The object containing the data to update the city council with.
   * @returns An observable that emits the result of the update operation.
   */
  updateCityCouncil(id:string,createCityCouncil:CreateCityCouncilDto):Observable<any[]>
  {
    return this.http.patch<any[]>(`${this.apiUrl}/${id}`,createCityCouncil);
  }

  /**
   * Creates a new city council in the system.
   * @param createCityCouncil - The object containing the data of the new city council.
   * @returns An observable that emits the result of the creation operation.
   */
  createCityCouncil(createCityCouncil:CreateCityCouncilDto):Observable<any>
  {
    return this.http.post<any[]>(`${this.apiUrl}`,createCityCouncil);
  }

   /**
   * Fetches all city councils from the system.
   * @returns An observable that emits a list of all city councils.
   */
  fetchCityCouncil(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

   /**
   * Fetches all active city councils.
   * @returns An observable that emits a list of active city councils.
   */
  fetchCityCouncilActive(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.apiUrlActive}`);
  }
}
