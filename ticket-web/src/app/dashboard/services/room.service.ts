import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRoomDto } from './models/create-room.dto';

@Injectable({
  providedIn: 'root'
})
export class RoomService
{
  private apiUrl = 'http://localhost:3000/api/sala';
  private apiUrlActive = 'http://localhost:3000/api/sala/active';

  /**
   * Constructor for RoomService.
   * @param http - Injects HttpClient service for making HTTP requests.
   */
  constructor(private http: HttpClient) {}


  /**
   * Fetches a room by its ID.
   * @param roomId - The ID of the room to fetch.
   * @returns An observable with the room data.
   */
  findRoomById(roomId: string): Observable<any>
  {
    const url = `${this.apiUrl}/${roomId}`; // Construimos la URL con el ID de la sala
    return this.http.get<any>(url); // Realizamos una solicitud GET
  }


  /**
   * Fetches rooms associated with a specific city hall.
   * @param cityHallId - The ID of the city hall to fetch rooms for.
   * @returns An observable with the list of rooms for the specified city hall.
   */
  getRoomsByCityHall(cityHallId: string|null): Observable<any>
  {
    return this.http.get<any>(`${this.apiUrl}/cityhall/${cityHallId}`);
  }


  /**
   * Fetches all rooms.
   * @returns An observable with the list of all rooms.
   */
  fetchRooms(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

   /**
   * Fetches all active rooms.
   * @returns An observable with the list of active rooms.
   */
  fetchRoomsActive(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.apiUrlActive}`);
  }


   /**
   * Updates an existing room.
   * @param roomId - The ID of the room to update.
   * @param room - The data to update the room with.
   * @returns An observable with the updated room data.
   */
  updateRooms(roomId:string,room: CreateRoomDto): Observable<any>
  {
    const url = `${this.apiUrl}/${roomId}`;

    return this.http.patch(url,room);

  }


  /**
   * Creates a new room.
   * @param room - The data to create a new room.
   * @returns An observable with the response after creating the room.
   */
  createRoom(room: CreateRoomDto): Observable<any>
  {
    return this.http.post(`${this.apiUrl}`, room, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }


}
