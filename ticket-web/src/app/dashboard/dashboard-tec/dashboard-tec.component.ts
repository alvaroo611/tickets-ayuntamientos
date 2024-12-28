import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../services/tickets.service';
import { AuthService } from '../../login/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AssignEmployeeRoomComponent } from './assign-employee-room/assign-employee-room.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UpdateTicketComponent } from './update-ticket/update-ticket.component';
/*
 * DashboardTecComponent manages the technician's dashboard, showing and filtering tickets assigned to the technician.
 * It allows the technician to view tickets, filter by status, update tickets, and navigate to related sections.
 * It also checks the technician's role to display specific options.
 * @returns void
 */
@Component({
  selector: 'app-dashboard-tec',
  templateUrl: './dashboard-tec.component.html',
  styleUrls: ['./dashboard-tec.component.css'],
  providers: [DatePipe]
})
export class DashboardTecComponent implements OnInit
{
  tickets: any[] = [];
  pendingTicketsCount = 0;
  inProgressTicketsCount = 0;
  completedTicketsCount = 0;
  isResponsable: boolean = false; // Variable para verificar el rol de responsable
  showLogoutMenu = false;
  filteredTickets: any[] = [];
  selectedStatus: string = '';
  constructor(
    private ticketsService: TicketsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  /**
   * ngOnInit lifecycle hook, initializes the component by loading the tickets and checking if the user is a "responsable".
   * @returns void
   */
  ngOnInit(): void
  {
    this.loadTickets();
    this.checkIfResponsable(); // Verifica si el usuario es responsable
  }

  /**
   * Formats the appointment date to a more readable string in the format 'd de MMMM de yyyy, HH:mm'.
   * @param {string} date The appointment date to format.
   * @returns {string} The formatted date.
   */

  formatAppointmentDate(date: string): string
  {
    return this.datePipe.transform(date, 'd \'de\' MMMM \'de\' yyyy, HH:mm') || 'Fecha no válida';
  }

  /**
   * Toggles the visibility of the logout menu.
   * @returns void
   */
  toggleLogoutMenu()
  {
    this.showLogoutMenu = !this.showLogoutMenu;
  }
  /**
   * Logs out the technician by navigating to the login page.
   * @returns void
   */
  logout()
  {
    this.router.navigate(['login'])
  }
  /**
   * Loads the technician's tickets by fetching them from the service and filtering by technician's DNI.
   * It also updates the ticket counts and applies the selected status filter.
   * @returns void
   */
  loadTickets(): void
  {
    const dniTec = this.authService.getDniTec();
    if (dniTec) {
        this.ticketsService.getTicketsActive().subscribe((data) => {
            const now = new Date(); // Fecha actual
            // Filtrar por técnico, eliminar tickets en pasado y ordenar por fecha
            this.tickets = data
                .filter(ticket =>
                    ticket.employee.DNI === dniTec &&
                    new Date(ticket.appointment_date) >= now
                )
                .sort((a, b) =>
                    new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
                );
            this.updateTicketCounts();
            this.applyFilter(); // Aplica el filtro inicial
        });
    } else {
        console.error('DNI del técnico no encontrado.');
    }
  }
  /**
   * Applies the selected status filter to the tickets list.
   * If no filter is selected, it shows all tickets.
   * @returns void
   */
  applyFilter(): void
  {
    if (this.selectedStatus) {
      this.filteredTickets = this.tickets.filter(ticket => ticket.status === this.selectedStatus);
    } else {
      this.filteredTickets = [...this.tickets];
    }
  }

  /**
   * Opens a dialog to view tickets by room or navigate to the corresponding page.
   * @returns void
   */
  openRoomTicketsDialog(): void
  {
    // Navegar a la vista de tickets por sala o abrir un modal
    this.router.navigate(['/tickets-by-room']); // Reemplaza con tu ruta correspondiente
  }
  /**
   * Handles the change of the status filter, updating the selected status and applying the filter.
   * @param {any} event The event containing the selected status.
   * @returns void
   */
  onStatusFilterChange(event: any)
  {
    this.selectedStatus = event.target.value;
    this.applyFilter();
  }


  /**
   * Updates the counts of pending, in-progress, and completed tickets based on the tickets data.
   * @returns void
   */
  updateTicketCounts(): void
  {
    this.pendingTicketsCount = this.tickets.filter(ticket => ticket.status === 'en_cumplimiento').length;
    this.inProgressTicketsCount = this.tickets.filter(ticket => ticket.status === 'en_progreso').length;
    this.completedTicketsCount = this.tickets.filter(ticket => ticket.status === 'finalizado').length;
  }

  /**
   * Returns a CSS class based on the ticket's status for styling purposes.
   * @param {string} status The status of the ticket.
   * @returns {string} The CSS class corresponding to the status.
   */
  getTicketStatusClass(status: string): string
  {

    switch (status) {
      case 'en_cumplimiento':

        return 'pendiente';
      case 'en_progreso':

        return 'en proceso';
      case 'finalizado':

        return 'finalizado';
      default:
        return '';
    }
  }

  /**
   * Opens a dialog to update the selected ticket.
   * @param {any} ticket The ticket to update.
   * @returns void
   */
  openTicket(ticket: any): void
  {

    const dialogRef = this.dialog.open(UpdateTicketComponent, {
      width: '80vw',  // Aumento del ancho del modal
      maxWidth: '90vw', // Máximo ancho ajustado
      minWidth: '600px',  // Ancho mínimo mayor para que se vea más amplio
      maxHeight: '80vh',  // Altura máxima ajustada
      height: '80vh',  // Aumento de la altura
      panelClass: 'custom-modal',  // Clase personalizada para el modal
      data: {ticket}  // Pasa los datos del ticket seleccionado
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTickets(); // Actualiza la lista después de la actualización
      }
    });
  }


  /**
   * Opens the dialog to assign employees to rooms.
   * @returns void
   */
  openAssignDialog(): void
  {
    this.router.navigate(['/assign-employee-room']);
  }
  /**
   * Opens the dialog to assign hours to the technician.
   * @returns void
   */
  openTecHoursDialog(): void
  {
    this.router.navigate(['/assign-hours-out']);
  }

  /**
   * Checks if the user has the "responsable" role and adjusts the component accordingly.
   * @returns void
   */
  checkIfResponsable(): void
  {
    const userRole = this.authService.getUserRole(); // Obtén el rol del usuario desde el AuthService
    if (userRole === 'responsable') {
      this.isResponsable = true;
    }
  }
}
