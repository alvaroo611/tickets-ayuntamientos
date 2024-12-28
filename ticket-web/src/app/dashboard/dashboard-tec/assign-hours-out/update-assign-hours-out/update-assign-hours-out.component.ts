import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TechnicalHoursOutService } from '../../../services/technical-hours-out.service';
import { AuthService } from '../../../../login/auth.service';

@Component({
  selector: 'app-update-assign-hours-out',
  templateUrl: './update-assign-hours-out.component.html',
  styleUrls: ['./update-assign-hours-out.component.css']
})
export class UpdateAssignHoursOutComponent implements OnInit
{
  employeeDNI: string = '';
  startDate: string = '';
  startTime: string = '';
  endDate: string = '';
  endTime: string = '';
  reason: string = '';
  isActive: boolean = true;

  employees: any[] = [];
  @Output() hoursOutUpdated = new EventEmitter<void>();


  /**
   * Constructor for the UpdateAssignHoursOutComponent
   * @param dialogRef Reference to the dialog to close it
   * @param data Injected data containing the assignment to update
   * @param employeeService Service for fetching employee data
   * @param assignHoursService Service for updating the hours out assignment
   * @param snackBar Service for showing notifications
   * @param authService Service for handling authentication-related tasks
   */
  constructor(
    private dialogRef: MatDialogRef<UpdateAssignHoursOutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Inyecta los datos del dialog
    private employeeService: EmployeeService,
    private assignHoursService: TechnicalHoursOutService,
    private snackBar: MatSnackBar,
    private authService:AuthService
  ) {}

  /**
   * Initializes the component
   * - Loads data from the dialog to populate the fields
   * - Fetches the list of employees
   */
  ngOnInit(): void
  {
    this.initializeFields();
    this.fetchEmployees();
  }

  /**
   * Initializes the fields with the data received from the dialog
   */
  private initializeFields(): void
  {
    if (this.data) {
      this.employeeDNI=this.data.employee.DNI;
      this.startDate = this.formatDate(this.data.fechaInicioSalida) || '';
      this.startTime = this.formatTime(this.data.fechaInicioSalida) || '';
      this.endDate = this.formatDate(this.data.fechaFinSalida) || '';
      this.endTime = this.formatTime(this.data.fechaFinSalida) || '';
      this.reason = this.data.motivo || '';


    }
  }


 /**
   * Converts a date string to the format yyyy-MM-dd
   * @param date The date string to format
   * @returns The formatted date string
   */
  private formatDate(date: string): string
  {
    if (!date) return '';
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Mes en formato de dos dígitos
    const day = String(parsedDate.getDate()).padStart(2, '0'); // Día en formato de dos dígitos
    return `${year}-${month}-${day}`; // Devuelve la fecha en formato yyyy-MM-dd
  }

   /**
   * Extracts the time from a date string in HH:mm format
   * @param date The date string to extract the time from
   * @returns The formatted time string
   */
  private formatTime(date: string): string
  {
    if (!date) return '';
    const parsedDate = new Date(date);
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

 /**
   * Fetches the list of active employees from the service
   * Filters the employees based on the department responsible
   */
  private fetchEmployees(): void
  {
    const departmentResponsibleId = this.authService.getDepartmentResponsable();
    this.employeeService.fetchEmployeesActive().subscribe({
      next: (employees) => {
        this.employees = employees.filter(
          (employee) =>  employee.department && employee.department.departmentId === departmentResponsibleId
        );
      },
      error: () => {
        this.showError('Error al cargar los empleados');
      }
    });
  }

  /**
   * Updates the assignment of hours out
   * - Converts start and end dates to Date objects
   * - Formats them to the correct format
   * - Calls the service to update the assignment
   */
  updateAssignHours(): void
  {
    const startDateTime = new Date(`${this.startDate}T${this.startTime}`);
    const endDateTime = new Date(`${this.endDate}T${this.endTime}`);



    const fechaInicioSalida = this.formatLocalDateTime(startDateTime);
    const fechaFinSalida = this.formatLocalDateTime(endDateTime);

    const assignData = {
      employeeDni: this.employeeDNI,
      fechaInicioSalida: fechaInicioSalida,
      fechaFinSalida: fechaFinSalida,
      motivo: this.reason,
      isActive:this.isActive
    };

    this.assignHoursService.update(this.data.id, assignData).subscribe({
      next: (response) => {
        // Verificar si la respuesta contiene un mensaje, si no usar uno por defecto
        const successMessage = response.message ;

        // Mostrar el mensaje de éxito en el snackbar
        this.snackBar.open(successMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });

        // Emitir evento para notificar que se ha actualizado la asignación
        this.hoursOutUpdated.emit();

        // Cerrar el diálogo y pasar la respuesta
        this.dialogRef.close(response);
      },
      error: (error) => {
        // Extraer el mensaje de error desde el backend
        const errorMessage = error.error?.message || 'Error al actualizar los datos';

        // Mostrar el mensaje de error en el snackbar
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });

        // Opcional: Registrar el error en la consola
        console.error('Error al actualizar:', error);
      }
    });

  }

    /**
   * Formats a Date object to a local date-time string
   * @param date The Date object to format
   * @returns The formatted local date-time string
   */
  private formatLocalDateTime(date: Date): string
  {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


   /**
   * Closes the form without making any changes
   */
  closeForm(): void
  {
    this.dialogRef.close();
  }

   /**
   * Displays an error message using a Snackbar
   * @param message The error message to display
   */
  private showError(message: string): void
  {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['error-snack'] });
  }

  /**
   * Displays a success message using a Snackbar
   * @param message The success message to display
   */
  private showSuccess(message: string): void
  {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['success-snack'] });
  }
}
