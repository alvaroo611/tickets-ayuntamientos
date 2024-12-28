import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreateTicketDto } from './models/create-ticket.dto';

@Injectable({
  providedIn: 'root'
})
export class TicketsService
{
  private apiUrlActive = 'http://localhost:3000/api/ticket/active';
  private apiUrl = 'http://localhost:3000/api/ticket'; // Asegúrate de actualizar con la URL correcta
  /**
   * Constructor for TicketsService.
   * @param http - Injects HttpClient service for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Updates a ticket with the given ID.
   * @param id_ticket - The ID of the ticket to update.
   * @param ticket - The data to update the ticket with.
   * @returns An observable with the response after updating the ticket.
   */
  updateTickets(id_ticket:string,ticket:CreateTicketDto): Observable<any>
  {
    const url = `${this.apiUrl}/${id_ticket}`;

    return this.http.patch<any[]>(url,ticket);
  }

  /**
   * Fetches all active tickets.
   * @returns An observable with the list of active tickets.
   */
  getTicketsActive(): Observable<any[]>
  {
    return this.http.get<any[]>(this.apiUrlActive);
  }

   /**
   * Fetches all tickets.
   * @returns An observable with the list of all tickets.
   */
  getTickets(): Observable<any[]>
  {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Creates a new ticket.
   * @param ticket - The data to create a new ticket.
   * @returns An observable with the response after creating the ticket.
   */
  createTicket(ticket:any): Observable<any>
  {
    const url = `${this.apiUrl}`;

    return this.http.post<any[]>(url,ticket);
  }

}
