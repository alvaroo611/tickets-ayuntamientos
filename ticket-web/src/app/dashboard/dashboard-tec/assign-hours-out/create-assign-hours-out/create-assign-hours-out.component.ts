import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { TechnicalHoursOutService } from '../../../services/technical-hours-out.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../login/auth.service';
import { CreateTechnicalHoursOutDto } from '../../../services/models/create-technical-hours-out.dto';

@Component({
  selector: 'app-create-assign-hours-out',
  templateUrl: './create-assign-hours-out.component.html',
  styleUrls: ['./create-assign-hours-out.component.css']
})
export class CreateAssignHoursOutComponent implements OnInit {
  employeeDni: string = '';
  isActive: boolean = true;
  startDate: string = '';
  startTime: string = '';
  endDate: string = '';
  endTime: string = '';
  reason: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';
  departmentResponsibleId: string | null = null;

  @Output() hoursOutCreated = new EventEmitter<void>();
    /**
   * Constructor del componente que inyecta las dependencias necesarias para interactuar con los servicios y la interfaz.
   * @param dialogRef Referencia al diálogo para cerrar el formulario.
   * @param employeeService Servicio para obtener los empleados.
   * @param technicalHoursOutService Servicio para crear las asignaciones de horas fuera.
   * @param authService Servicio de autenticación para obtener el ID del responsable del departamento.
   * @param snackBar Servicio para mostrar notificaciones al usuario.
   */
  constructor(
    private dialogRef: MatDialogRef<CreateAssignHoursOutComponent>,
    private employeeService: EmployeeService,
    private technicalHoursOutService: TechnicalHoursOutService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
   /**
   * Método que se ejecuta al inicializar el componente.
   * Se obtiene el ID del responsable del departamento y se cargan los empleados activos.
   */
  ngOnInit(): void
  {
    this.departmentResponsibleId = this.authService.getDepartmentResponsable();

    this.employeeService.fetchEmployeesActive().subscribe(
      (employees) => {
        this.employees = employees.filter(
          (employee) =>  employee.department && employee.department.departmentId === this.departmentResponsibleId
        );
        this.filteredEmployees = [...this.employees];
      },
      (error) => {
        this.snackBar.open('Error al cargar los empleados', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
  }


   /**
   * Método para crear la asignación de horas fuera.
   * Envía los datos al servicio `TechnicalHoursOutService` para crear la asignación.
   */
  createAssignHoursOut(): void
  {
    // Crear objetos Date con la fecha y hora local
    const startDateTime = new Date(`${this.startDate}T${this.startTime}`);
    const endDateTime = new Date(`${this.endDate}T${this.endTime}`);

    // Ajustar las fechas al formato ISO con la hora local
    const fechaInicioSalida = this.formatLocalDateTime(startDateTime);
    const fechaFinSalida = this.formatLocalDateTime(endDateTime);


    const technicalHoursOut:CreateTechnicalHoursOutDto = {
      fechaInicioSalida,
      fechaFinSalida,
      motivo: this.reason,
      isActive:this.isActive,
      employeeDni: this.employeeDni,
    };

    this.technicalHoursOutService.create(technicalHoursOut).subscribe({
      next: (response) => {
        // Verificar si la respuesta contiene un mensaje, si no usar uno por defecto
        const successMessage = response.message ;

        // Mostrar el mensaje de éxito en el snackbar
        this.snackBar.open(successMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });

        // Emitir evento para notificar que se ha asignado las horas
        this.hoursOutCreated.emit();

        // Cerrar el diálogo y pasar la respuesta
        this.dialogRef.close();
      },
      error: (error) => {
        // Extraer el mensaje de error desde el backend
        const errorMessage = error.error?.message || 'Error al asignar las horas';

        // Mostrar el mensaje de error en el snackbar
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });

        // Opcional: Registrar el error en la consola
        console.error('Error al asignar las horas:', error);
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
   * Método para cerrar el formulario sin realizar cambios.
   */
  closeForm(): void
  {
    this.dialogRef.close();
  }
}
