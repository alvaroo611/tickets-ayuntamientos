import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeRoomService } from '../../../services/employee-room.service';
import { RoomService } from '../../../services/room.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../../login/auth.service';

@Component({
  selector: 'app-update-employee-room',
  templateUrl: './update-employee-room.component.html',
  styleUrls: ['./update-employee-room.component.css']
})
export class UpdateEmployeeRoomComponent implements OnInit
{

  employeeDNI: string = '';
  roomId: string = '';
  table: string = '';
  startDate: string = '';
  endDate: string = '';
  isActive: boolean = true;

  rooms: any[] = [];
  employees: any[] = [];
  departmentResponsibleId: string | null = '';

  constructor(
    private dialogRef: MatDialogRef<UpdateEmployeeRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeRoomService: EmployeeRoomService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) {}


   /**
   * Inicializa el componente. Obtiene el departamento responsable y carga los datos del empleado y las salas.
   */
  ngOnInit(): void
  {
    this.departmentResponsibleId = this.authService.getDepartmentResponsable();
    this.loadEmployeeRoomDataFromDialog();
    this.fetchEmployees();
    this.fetchRooms();
  }


  /**
   * Obtiene la lista de empleados activos y los filtra según el departamento responsable.
   */
  private fetchEmployees(): void
  {
    this.employeeService.fetchEmployeesActive().subscribe({
      next: (employees) => {
        this.employees = employees.filter(
          (employee) =>
            employee.department && employee.department.departmentId === this.departmentResponsibleId
        );
      },
      error: () => {
        this.showError('Error al cargar los empleados');
      }
    });
  }


  /**
   * Obtiene la lista de salas activas y las filtra según el departamento responsable.
   */
  private fetchRooms(): void
  {
    this.roomService.fetchRoomsActive().subscribe({
      next: (rooms) => {
        this.rooms = rooms.filter(
          (room) => room.department.departmentId === this.departmentResponsibleId
        );
      },
      error: () => {
        this.showError('Error al cargar las salas');
      }
    });
  }


   /**
   * Carga los datos del empleado y la sala que se desean actualizar desde los datos proporcionados en el diálogo.
   */
  private loadEmployeeRoomDataFromDialog(): void
  {
    const { employee, room, table, startDate, endDate, isActive } = this.data;
    this.employeeDNI = employee.DNI;
    this.roomId = room.roomId;
    this.table = table;
    this.startDate = startDate.split('T')[0];
    this.endDate = endDate.split('T')[0];
    this.isActive = isActive;
  }


  /**
   * Acción ejecutada cuando se cambia el empleado seleccionado.
   */
  onEmployeeChange(): void
  {

  }
   /**
   * Acción ejecutada cuando se cambia la sala seleccionada.
   */
  onRoomChange(): void
  {

  }


  /**
   * Actualiza los datos del empleado y la sala en el servicio correspondiente.
   */
  updateEmployeeRoom(): void
  {
    // Verificar los valores antes de enviarlos para la actualización
    console.log('Datos antes de la actualización:', {
      employeeDNI: this.employeeDNI,
      roomId: this.roomId,
      table: this.table,
      startDate: this.startDate,
      endDate: this.endDate,
      isActive: this.isActive
    });

    const updatedData = {
      employeeDNI: this.employeeDNI,
      roomId: this.roomId,
      table: this.table,
      startDate: this.startDate,
      endDate: this.endDate,
      isActive: this.isActive
    };

    // Verificar el objeto que se enviará al servicio
    console.log('Objeto enviado para actualización:', updatedData);

    this.employeeRoomService.updateEmployeeRoom(this.data.id, updatedData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor al actualizar:', response);
        this.showSuccess(response.message);
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error al actualizar los datos:', error);
        const errorMessage = error.error?.message || 'Error al actualizar los datos';
        this.showError(errorMessage);
      }
    });
  }


  /**
   * Cierra el formulario sin realizar ninguna acción.
   */
  closeForm(): void
  {
    this.dialogRef.close();
  }


  /**
   * Muestra un mensaje de error usando `MatSnackBar`.
   * @param message El mensaje a mostrar.
   */
  private showError(message: string): void
  {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['error-snack'] });
  }

  /**
   * Muestra un mensaje de éxito usando `MatSnackBar`.
   * @param message El mensaje a mostrar.
   */
  private showSuccess(message: string): void
  {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['success-snack'] });
  }
}
