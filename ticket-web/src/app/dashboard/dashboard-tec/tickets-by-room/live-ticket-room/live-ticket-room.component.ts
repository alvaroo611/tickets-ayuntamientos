import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { TicketsService } from '../../../services/tickets.service';

@Component({
  selector: 'app-live-ticket-room',
  templateUrl: './live-ticket-room.component.html',
  styleUrls: ['./live-ticket-room.component.css'],
})
export class LiveTicketRoomComponent implements OnInit, OnDestroy
{
  room: any;
  tickets: any[] = [];
  updateInterval: Subscription | null = null;
   /**
   * Constructor of the LiveTicketRoom component
   * @param router Service for navigation
   * @param ticketsService Service for fetching ticket data
   */
  constructor(private router: Router, private ticketsService: TicketsService)
  {
    // Recuperar datos de la sala desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    this.room = navigation?.extras.state?.['room'] ?? null;

    if (!this.room) {
      console.error('No se han recibido datos de la sala.');
    }
  }


   /**
   * Method executed when the component is initialized
   * - Loads tickets for the room
   * - Sets up periodic ticket updates every 5 seconds
   */
  ngOnInit(): void
  {
    // Cargar los tickets inicialmente
    this.loadTickets();

    // Configurar la actualización periódica (cada 5 segundos)
    this.updateInterval = interval(5000).subscribe(() => this.loadTickets());
  }

  /**
   * Method executed when the component is destroyed
   * - Cancels the subscription to the periodic update
   */
  ngOnDestroy(): void
  {
    // Cancelar la suscripción al intervalo cuando el componente se destruya
    this.updateInterval?.unsubscribe();
  }

   /**
   * Loads the active tickets for the current room
   * - Filters tickets for today's date and ensures they are not completed
   * - Sorts tickets by appointment date in ascending order
   */
  loadTickets(): void
  {
    this.ticketsService.getTicketsActive().subscribe({
      next: (data) => {
        console.log(data)
        // Filtrar los tickets de la sala actual
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        
        // Filtrar tickets de la sala y que estén en el día de hoy, excluyendo los que estén finalizados
        this.tickets = data
          .filter((ticket) => ticket.room.roomId === this.room.roomId)
          .filter((ticket) => {
            const ticketDate = new Date(ticket.appointment_date);
            return ticketDate >= startOfDay && ticketDate <= endOfDay && ticket.status !== 'finalizado';
          })
          .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
           // Ordenar por fecha de cita descendente

           console.log({id_ticket_mostrado:this.tickets,id:this.room.roomId})
      },
      error: (err) => {
        console.error('Error al cargar los tickets:', err);
      },
    });
  }
}
