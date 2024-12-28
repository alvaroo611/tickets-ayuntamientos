import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsService } from '../../services/tickets.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../login/auth.service';

// Interface defining the structure of a ticket
interface Ticket
{
  requester_dni: string; // DNI of the requester
  department_name: string; // Department name
  external_user_name: string; // Name of the requester
  appointment_date: Date; // Appointment date
  status: string; // Ticket status
  isActive: boolean; // If the ticket is active
  notes?: string; // Optional notes
  creation_date: Date; // Ticket creation date
  attended_date?: Date; // Attendance date (optional)
  completion_date?: Date; // Completion date (optional)
  phone: number; // Requester's phone number
  roomId: string; // Associated room ID
  technicianDNI: string; // Technician's DNI
  cityHallId: string; // City hall ID
}


@Component({
  selector: 'app-tickets-screen',
  templateUrl: './tickets-screen.component.html',
  styleUrls: ['./tickets-screen.component.css']
})
export class TicketsScreenComponent implements OnInit
{
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  statusFilter: string = '';
  searchFilter: string = '';
  startDate: string = '';
  endDate: string = '';
  /**
   * Constructor that injects the necessary services.
   * @param router Router service to navigate between views
   * @param ticketsService Service to manage tickets
   * @param authService Auth service to get the city hall ID
   * @returns void
   */
  constructor(
    private router: Router,
    private ticketsService: TicketsService,
    private authService:AuthService
  ) {}

  /**
   * Initializes the component and loads tickets.
   * @returns void
   */
  ngOnInit()
  {
    this.loadTickets();
  }

  /**
   * Loads the tickets from the service and filters them by city hall ID.
   * @returns void
   */
  loadTickets()
  {
    this.ticketsService.getTickets().subscribe({
      next: (data) => {

        const cityCouncilId = this.authService.getCityCouncil();



        // Filtrar tickets por cityCouncilId
        this.tickets = data.filter(ticket => ticket.cityCouncil.id === cityCouncilId);

        this.filteredTickets = this.tickets;
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }
  /**
   * Handles the change in ticket status filter and applies it.
   * @param event The event triggered when the status filter is changed
   * @returns void
   */
  onStatusFilterChange(event: any)
  {
    this.statusFilter = event.target.value;
    this.applyFilters();
  }
  /**
   * Handles the change in start date filter and applies it.
   * @param event The event triggered when the start date is changed
   * @returns void
   */
  onStartDateChange(event: any)
  {
    this.startDate = event.target.value;
    this.applyFilters();
  }
  /**
   * Handles the change in end date filter and applies it.
   * @param event The event triggered when the end date is changed
   * @returns void
   */
  onEndDateChange(event: any)
  {
    this.endDate = event.target.value;
    this.applyFilters();
  }
  /**
   * Handles the change in the search input and applies the filter.
   * @param event The event triggered when the search input is changed
   * @returns void
   */
  onSearch(event: any)
  {
    this.searchFilter = event.target.value.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics (accents)

    this.applyFilters();// Apply the filter after search input change
  }


  /**
   * Applies all the active filters (status, date range, and search).
   * Filters tickets based on the selected criteria.
   * @returns void
   */
  applyFilters()
  {
    this.filteredTickets = this.tickets.filter(ticket => {
      const ticketDate = new Date(ticket.appointment_date);
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      // Si hay una fecha de fin, ajusta la hora para incluir todo el día
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      return (
        (!this.statusFilter || ticket.status === this.statusFilter) &&
        (!startDate || ticketDate >= startDate) &&
        (!endDate || ticketDate <= endDate) &&
        (!this.searchFilter ||
          Object.values(ticket).some(value =>
            value
              ? value.toString().toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(this.searchFilter)
              : false
          ))
      );
    });
  }


  /**
   * Updates the ticket status by toggling the isActive field.
   * Makes a request to update the ticket in the backend.
   * @param ticket The ticket to be updated
   * @returns void
   */
  updateTicketStatus(ticket: any)
  {
    // Cambiar el estado de 'isActive' al contrario (activo/inactivo)
    ticket.isActive = !ticket.isActive; // Cambia el estado de activo/inactivo


    // Crear el objeto 'updatedTicket' con los campos necesarios para la actualización
    const updatedTicket: any = {
      requester_dni: ticket.requester_dni,
      department_name: ticket.department_name,
      external_user_name: ticket.external_user_name,
      appointment_date: ticket.appointment_date,
      status: ticket.status, // No cambian el estado, solo si es necesario
      isActive: ticket.isActive, // Actualizar el estado de activo/inactivo
      notes: ticket.notes, // Si existen notas, incluirlas
      creation_date: ticket.creation_date,
      attended_date: ticket.attended_date, // Si existe
      completion_date: ticket.completion_date, // Si existe
      phone: ticket.phone,
      roomId: ticket.room.roomId,
      technicianDNI: ticket.employee.DNI,
      cityHallId: ticket.cityCouncil.id
    };


    // Llamar al servicio para actualizar el ticket en el backend
    this.ticketsService.updateTickets(ticket.id_ticket, updatedTicket).subscribe(
      response => {
       
      },
      error => {
        console.error('Error al actualizar', error);
      }
    );
  }

  /**
   * Closes the current tab and navigates to the admin screen.
   * @returns void
   */
  closeTab()
  {
    this.router.navigate(['/admin']);
  }
}
