import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketsService } from '../../services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../../login/auth.service';
import { CreateTicketDto } from '../../services/models/create-ticket.dto';


/*
 * UpdateTicketComponent manages the functionality for updating an existing ticket.
 * It allows the technician to modify the ticket's status, notes, appointment date, and other details.
 * It also ensures the correct flow of state changes and date management based on the ticket's status.
 */
@Component({
  selector: 'app-update-ticket',
  templateUrl: './update-ticket.component.html',
  styleUrls: ['./update-ticket.component.css']
})
export class UpdateTicketComponent implements OnInit
{
// Initializing variables with default or empty values
  requester_dni: string = '';
  notes: string = '';
  status: string = '';
  appointment_date: string = '';
  creation_date: string = '';
  attended_date: string | null= '';
  completion_date: string | null = '';

  external_user_name: string = '';
  phone: string = '';
  isActive: boolean = true;
  roomId: string = '';
  technicianDNI: string = '';
  cityHallId: string='';
  department_name:string='';


  @Output() ticketEdit = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<UpdateTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public ticket: any,
    private ticketsService: TicketsService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}


  /**
   * ngOnInit lifecycle hook. It initializes ticket data for editing by extracting relevant fields.
   * @returns void
   */
  ngOnInit(): void
  {


    this.creation_date = this.formatDate(this.ticket.ticket.creation_date);
    this.appointment_date = this.formatDate(this.ticket.ticket.appointment_date);
    // Asignación explícita de cada campo de datos del ticket recibido
    this.department_name = this.ticket.ticket.department_name;
    this.requester_dni = this.ticket.ticket.requester_dni;
    this.notes = this.ticket.ticket.notes;
    this.status = this.ticket.ticket.status;

    this.attended_date = this.ticket.ticket.attended_date;
    this.completion_date = this.ticket.ticket.completion_date;

    // Accediendo a propiedades dentro de objetos anidados

    this.external_user_name = this.ticket.ticket.external_user_name;
    this.phone = this.ticket.ticket.phone;
    this.isActive = this.ticket.ticket.isActive;
    this.roomId=this.ticket.ticket.room.roomId;
    this.technicianDNI=this.ticket.ticket.employee.DNI;
    this.cityHallId=this.ticket.ticket.cityCouncil.id;

  }


  /**
   * Formats the date string into a specific format suitable for input fields.
   * @param {string} dateString The date string to format.
   * @returns {string} The formatted date string in 'yyyy-MM-ddTHH:mm' format.
   */
  formatDate(dateString: string): string
  {
    const date = new Date(dateString);

    // Ajustamos la zona horaria para eliminar la 'Z'
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes de dos dígitos
    const day = ('0' + date.getDate()).slice(-2); // Día de dos dígitos
    const hours = ('0' + date.getHours()).slice(-2); // Hora de dos dígitos
    const minutes = ('0' + date.getMinutes()).slice(-2); // Minutos de dos dígitos

    // Retorna el formato que espera el input type="datetime-local"
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Saves the changes made to the ticket, including the status update and relevant dates.
   * It also ensures that the ticket follows the correct status flow and that necessary dates are assigned.
   * @returns void
   */
  saveTicketChanges(): void
  {

    if (this.status === 'en_progreso') {
      if (!this.attended_date) {

        this.attended_date = new Date().toISOString();
      }

      this.completion_date = null;
    }


    if (this.status === 'finalizado') {
      if (!this.completion_date) {

        this.completion_date = new Date().toISOString();
      }
      if(!this.attended_date)
      {
        this.snackBar.open('El ticket debe estar "en progreso" antes de finalizar', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
        this.status = this.ticket.ticket.status;
        return;
      }

    }

    // Si el estado no es ni 'en_progreso' ni 'finalizado', asigna una fecha vacía
    if (this.status !== 'en_progreso' && this.status !== 'finalizado') {
      this.attended_date = null; // Asigna una cadena vacía si la fecha no es válida
      this.completion_date = null; // Asigna una cadena vacía si la fecha no es válida
    }
      const updatedTicket:CreateTicketDto = {
        requester_dni: this.requester_dni,
        notes: this.notes,
        status: this.status,
        appointment_date: this.appointment_date,
        creation_date: this.creation_date,
        attended_date: this.attended_date,
        completion_date: this.completion_date,
        department_name:this.department_name,
        external_user_name: this.external_user_name,
        phone: Number(this.phone),
        isActive: this.isActive,
        roomId: this.roomId,
        technicianDNI: this.technicianDNI,
        cityHallId: this.cityHallId
      };

      this.ticketsService.updateTickets(this.ticket.ticket.id_ticket, updatedTicket).subscribe(
        (response) => {
          // Verificar si la respuesta contiene un mensaje, si no usar uno por defecto
          const successMessage = response.message ;

          // Mostrar mensaje de éxito en el snackbar
          this.snackBar.open(successMessage, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snack']
          });

          // Emitir evento para notificar que se ha actualizado el ticket
          this.ticketEdit.emit();

          // Cerrar el diálogo y pasar la respuesta
          this.dialogRef.close(response);
        },
        (error) => {
          // Extraer el mensaje de error desde el backend
          let errorMessage = 'Error updating ticket.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message; // Para errores genéricos del cliente
          }

          // Mostrar el mensaje de error en el snackbar
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snack']
          });


        }
      );

  }

  /**
   * Closes the dialog without saving any changes.
   * @returns void
   */
  closeDialog(): void
  {
    this.dialogRef.close();
  }
}
