import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { RoomService } from '../../../../../../../dashboard/services/room.service';
import { EmployeeService } from '../../../../../../../dashboard/services/employee.service';
@Component({
  selector: 'app-ticket-viewer',
  templateUrl: './ticket-viewer.component.html',
  styleUrls: ['./ticket-viewer.component.css']
})
export class TicketViewerComponent implements OnInit
{
  table:string | null='';
  roomDetails: any;
  employeeDetails:any;
  /**
   * Constructor: Initializes the component and injects necessary dependencies.
   *
   * @param ticketData - Data passed through the MAT_DIALOG_DATA injection token containing ticket information.
   * @param dialogRef - Reference to the dialog containing this component.
   * @param roomService - Service to fetch room details.
   * @param employeeService - Service to fetch employee details.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public ticketData: any, private dialogRef: MatDialogRef<TicketViewerComponent>,  private roomService:RoomService,private employeeService: EmployeeService) {

  }

  /**
   * Method: ngOnInit
   * Purpose: Lifecycle hook that initializes component data. Fetches room and employee details.
   */
  ngOnInit(): void
  {
    this.table=localStorage.getItem("table");
    this.getRoomDetails(this.ticketData.roomId)
    this.getEmployeeDetails(this.ticketData.technicianDNI);
  }

  /**
   * Method: closeDialog
   * Purpose: Closes the current dialog.
   */
  closeDialog()
  {
    this.dialogRef.close();  // Cierra el diálogo
  }

  /**
   * Method: getRoomDetails
   * Purpose: Fetches details of the room associated with the ticket.
   *
   * @param roomId - The ID of the room to fetch details for.
   */
  getRoomDetails(roomId: string): void
  {
    this.roomService.findRoomById(roomId).subscribe({
      next: (data) => {
        this.roomDetails = data; // Guardamos los detalles de la sala
        console.log('Detalles de la sala:', this.roomDetails);
      },
      error: (err) => {
        console.error('Error al obtener los detalles de la sala:', err);
      },
    });
  }

   /**
   * Method: getEmployeeDetails
   * Purpose: Fetches details of the employee associated with the ticket.
   *
   * @param DNI - The DNI of the employee to fetch details for.
   */
  getEmployeeDetails(DNI: string): void
  {
    this.employeeService.findEmployeeByDNI(DNI).subscribe({
      next: (data) => {
        this.employeeDetails = data;
        console.log(this.employeeDetails.cityCouncil.name) // Guardamos los detalles del empleado
        console.log('Detalles del empleado:', this.employeeDetails);
      },
      error: (err) => {
        console.error('Error al obtener los detalles del empleado:', err);
      },
    });
  }

   /**
   * Method: downloadTicketAsPDF
   * Purpose: Captures the ticket container element, converts it to a PDF, and triggers the download.
   */
  downloadTicketAsPDF()
  {
    const element = document.querySelector('.ticket-container') as HTMLElement;
    element.classList.add('hide-buttons');

    html2canvas(element, { scale: 2 }).then((canvas) => {  // Escala 2 para mayor calidad
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;  // Ancho de A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('ticket.pdf');

      element.classList.remove('hide-buttons');
    });
  }

}
