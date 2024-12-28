import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TicketsService } from '../../../../../../dashboard/services/tickets.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SharedDataService } from '../../../../../services/shared-data.service';
import { EmployeeRoomService } from '../../../../../../dashboard/services/employee-room.service';
import { TicketViewerComponent } from './ticket-viewer/ticket-viewer.component';

/*
  AppointmentHoursComponent
  --------------------------
  Component to handle the selection and confirmation of appointment intervals.
  It displays available intervals, opens confirmation dialogs, and creates tickets
  after an appointment is confirmed. Additionally, it opens a ticket viewer dialog
  to display the details of the created ticket.
*/
@Component({
  selector: 'app-appointment-hours',
  templateUrl: './appointment-hours.component.html',
  styleUrls: ['./appointment-hours.component.css']
})
export class AppointmentHoursComponent
{
  @Input() intervals: any[] = [];
  @Input() selectedDate: Date | null = null;
  @Output() appointmentCreated = new EventEmitter<void>();
  roomId:string='';
  table:string='';

  /**
   * Constructor: Initializes the component and injects the necessary dependencies.
   *
   * @param data - Data passed through the MAT_DIALOG_DATA injection token.
   * @param dialogRef - Reference to the dialog containing this component.
   * @param dialog - Service to open additional dialogs.
   * @param appointmentService - Service for handling ticket creation.
   * @param sharedDataService - Service for managing shared data across components.
   * @param employeeRoomService - Service for retrieving employee-room relationships.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppointmentHoursComponent>,
    private dialog: MatDialog, // Para abrir diálogos
    private appointmentService: TicketsService, // Servicio de citas
    private sharedDataService:SharedDataService,
    private employeeRoomService:EmployeeRoomService,

  ) {
    this.intervals = data.intervals;
  }

  /**
   * Method: closeDialog
   * Purpose: Closes the current dialog.
   */
  closeDialog(): void
  {
    this.dialogRef.close();
  }

  /**
   * Method: formatTime
   * Purpose: Formats a datetime string into a user-friendly time format (HH:mm).
   *
   * @param datetime - The datetime string to format.
   * @returns The formatted time as a string.
   */
  formatTime(datetime: string): string
  {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Method: selectInterval
   * Purpose: Handles the selection of an interval by opening a confirmation dialog.
   *
   * @param interval - The selected interval.
   */
  selectInterval(interval: any): void
  {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar cita',
        message: `¿Estás seguro de que deseas confirmar esta cita? ${this.formatTime(interval.start_time)} - ${this.formatTime(interval.end_time)}`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmAppointment(interval);
      }
    });
  }


  /**
   * Method: confirmAppointment
   * Purpose: Confirms the selected appointment by creating a ticket and opening a viewer dialog.
   *
   * @param interval - The interval to confirm the appointment for.
   */
  confirmAppointment(interval: any): void
  {

    this.employeeRoomService.getEmpleadoSalaById(interval.id_empleado_sala).subscribe(
      (response) => {
        console.log(response)
        this.roomId = response.room.roomId;
        this.table=response.table

        localStorage.setItem("table",this.table);
        const ticket = {
          requester_dni:this.sharedDataService.getDni(),
          status: 'en_cumplimiento',
          appointment_date: new Date(interval.start_time).toISOString(),
          creation_date: new Date().toISOString(),
          department_name: this.sharedDataService.getDepartment().departmentName,
          external_user_name: this.sharedDataService.getNombre(),
          phone: Number(this.sharedDataService.getTelefono()),
          roomId: this.roomId,
          technicianDNI: interval.employeeDNI,
          cityHallId: this.sharedDataService.getAyuntamiento(),
          notes:''
        };

        this.appointmentService.createTicket(ticket).subscribe({
          next: () => {


            this.appointmentCreated.emit();
            this.dialog.open(TicketViewerComponent, { // Abre el nuevo componente con los datos del ticket
              data: ticket,
              maxHeight:'60vh',
              maxWidth: '70vh',

            });

          },
          error: (err) => {
            // Verifica si el mensaje del backend está disponible y muéstralo
            const backendMessage = err.error?.message || 'Unknown error occurred';
            alert('Ocurrió un error al confirmar la cita: ' + backendMessage);
          }
        });

      },
      (error) => {
        console.error('Error al obtener el empleado de la sala:', error);
      }
    );


  }

}
