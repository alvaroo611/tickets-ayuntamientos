import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeRoomService } from '../../../services/employee-room.service';
import { RoomService } from '../../../services/room.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../../login/auth.service';
import { CreateEmployeeRoomDto } from '../../../services/models/create-employee-room.dto';

@Component({
  selector: 'app-create-employee-room',
  templateUrl: './create-employee-room.component.html',
  styleUrls: ['./create-employee-room.component.css']
})
export class CreateEmployeeRoomComponent implements OnInit
{
  employeeDNI: string = '';
  roomId: string = '';
  table: string = '';
  startDate: string = '';
  endDate: string = '';
  isActive: boolean = true;
  rooms: any[] = []; // Almacena las salas disponibles
  employees: any[] = [];
  filteredEmployees: any[] = []; // Empleados filtrados según búsqueda
  searchTerm: string = ''; // Término de búsqueda para el filtro
  departmentResponsibleId: string|null = '';

  @Output() employeeRoomCreated = new EventEmitter<void>();

  constructor(
    private dialogRef: MatDialogRef<CreateEmployeeRoomComponent>,
    private employeeRoomService: EmployeeRoomService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) {}
   /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene la fecha actual, las salas y empleados disponibles, y filtra por departamento.
   */
  ngOnInit(): void
  {
    const today = new Date();
    this.startDate = this.formatDate(today); // Asignar una fecha inicial válida
    this.endDate = this.formatDate(today);   // Asignar una fecha inicial válida

    this.departmentResponsibleId = this.authService.getDepartmentResponsable();

    this.employeeService.fetchEmployeesActive().subscribe(
      (employees) => {
        this.employees = employees.filter(
          (employee) => employee.department && employee.department.departmentId === this.departmentResponsibleId,
        );

      },
      (error) => {
        this.snackBar.open('Error al cargar los empleados', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
    // Obtener salas filtradas por departamento
    this.roomService.fetchRoomsActive().subscribe(
      (rooms) => {
        // Filtrar las salas por departmentId
        this.rooms = rooms.filter(
          (room) => room.department.departmentId === this.departmentResponsibleId
        );

      },
      (error) => {
        this.snackBar.open('Error al cargar las salas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
  }
   /**
   * Método que convierte una fecha en formato ISO 8601 (YYYY-MM-DD).
   * @param date La fecha que se va a formatear.
   * @returns La fecha formateada como string en formato 'YYYY-MM-DD'.
   */
  formatDate(date: Date): string
  {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  /**
   * Método para crear la asignación de un empleado a una sala.
   * Envía los datos al servicio para crear la asignación, y muestra un mensaje de éxito o error.
   */
  createEmployeeRoom()
  {
    const employeeRoom:CreateEmployeeRoomDto = {
      employeeDNI: this.employeeDNI,
      roomId: this.roomId,
      table: this.table,
      startDate: this.startDate, // Convertir a formato ISO 8601
      endDate: this.endDate,     // Convertir a formato ISO 8601
      isActive: this.isActive
    };

    this.employeeRoomService.createEmployeeRoom(employeeRoom).subscribe(
      (response) => {
        this.snackBar.open('Employee asigned in room.', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.employeeRoomCreated.emit();
        this.dialogRef.close();
      },
      (error) => {
        let errorMessage = 'Error assigning employee to room';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
  }


  /**
   * Método para cerrar el formulario de creación de asignación de empleado a sala.
   */
  closeForm()
  {
    this.dialogRef.close();
  }

  /**
   * Método para obtener el nombre del empleado según su DNI (para mostrar en el trigger del mat-select).
   * @param dni DNI del empleado.
   * @returns El nombre del empleado si se encuentra, de lo contrario null.
   */
  getEmployeeNameByDNI(dni: string): string | null
  {
    const employee = this.employees.find((emp) => emp.DNI === dni);
    return employee ? employee.name : null;
  }
}
