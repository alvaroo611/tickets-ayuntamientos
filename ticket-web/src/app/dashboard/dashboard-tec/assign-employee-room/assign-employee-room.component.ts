import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EmployeeRoomService } from '../../services/employee-room.service';
import { Router } from '@angular/router'; // Si no usas router, puedes eliminarlo
import { MatDialog } from '@angular/material/dialog';
import { CreateEmployeeRoomComponent } from './create-employee-room/create-employee-room.component';
import { AuthService } from '../../../login/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateEmployeeRoomComponent } from './update-employee-room/update-employee-room.component';

@Component({
  selector: 'app-assign-employee-room',
  templateUrl: './assign-employee-room.component.html',
  styleUrls: ['./assign-employee-room.component.css']
})
export class AssignEmployeeRoomComponent implements OnInit
{
  employeeRooms: any[] = [];
  filteredEmployeeRooms: any[] = [];
  isLoading = true;
  departmentResponsibleId:string|null='';


   /**
   * Constructor del componente que inyecta las dependencias necesarias para interactuar con los servicios y la interfaz.
   * @param employeeRoomService Servicio para manejar las asignaciones de empleados a salas.
   * @param dialog Servicio para manejar los diálogos modales.
   * @param authService Servicio de autenticación para obtener el ID del responsable del departamento.
   * @param employeeService Servicio para obtener la información de los empleados.
   * @param snackBar Servicio para mostrar notificaciones al usuario.
   * @param cdr Servicio para detectar cambios en el componente.
   */
  constructor(
    private employeeRoomService: EmployeeRoomService,
    private dialog: MatDialog, // Inyectar MatDialog
    private authService:AuthService,

    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef

  ) {}


   /**
   * Método que se ejecuta al inicializar el componente.
   * Se cargan las asignaciones de empleados a salas.
   */
  ngOnInit(): void
  {
    this.loadEmployeeRooms();
  }


   /**
   * Método para cargar las asignaciones de empleados a salas.
   * Filtra los empleados por el ID del departamento responsable.
   */
  loadEmployeeRooms(): void
  {
    this.departmentResponsibleId =  this.authService.getDepartmentResponsable();




    this.employeeRoomService.fetchEmployeeRoom().subscribe({
      next: (data) => {


        // Filtrar los EmployeeRooms por departmentId
        this.employeeRooms = data.filter((employeRoom) =>{

          return employeRoom.room.department.departmentId === this.departmentResponsibleId

        });





        this.filteredEmployeeRooms = this.employeeRooms; // Asigna los datos filtrados a filteredEmployeeRooms
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading EmployeeRoom:', error);
        this.isLoading = false;
      }
    });

  }


  /**
   * Método para actualizar el estado de una asignación de empleado en una sala.
   * Activa o desactiva la asignación y recarga la lista de asignaciones.
   * @param employeeRoom La asignación de empleado a sala que se desea actualizar.
   */
  updateEmployeeRoomStatus(employeeRoom: any): void
  {
    const updatedStatus = !employeeRoom.isActive;

      const updatePayload = {
        employeeDNI: employeeRoom.employee.DNI,
        roomId: employeeRoom.roomId,
        table: employeeRoom.table,
        startDate: employeeRoom.startDate,
        endDate: employeeRoom.endDate,
        isActive:updatedStatus
       }; // Solo actualiza el estado

      this.employeeRoomService.updateEmployeeRoom(employeeRoom.id, updatePayload).subscribe({
        next: () => {
          this.snackBar.open(
            `Asignación ${updatedStatus ? 'activada' : 'desactivada'} con éxito.`,
            'Cerrar',
            { duration: 3000 }
          );
          this.loadEmployeeRooms(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al actualizar el estado:', error);
          this.snackBar.open('Error al actualizar el estado.', 'Cerrar', {
            duration: 3000,
          });
        },
      });

  }


  /**
   * Método para realizar la búsqueda de asignaciones de empleados a salas.
   * Filtra las asignaciones basándose en el término de búsqueda.
   * @param event El evento de búsqueda que contiene el término de búsqueda.
   */
  onSearch(event: any): void
  {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredEmployeeRooms = this.employeeRooms.filter((room) => {
      const employee = room.employee ? room.employee.name.toLowerCase() : '';
      const building = room.room?.building.toLowerCase() || '';
      const table = room.table ? room.table.toLowerCase() : '';
      const startDate = room.startDate ? room.startDate.toLowerCase() : '';
      const endDate = room.endDate ? room.endDate.toLowerCase() : '';

      // Compara el término de búsqueda con todas las propiedades relevantes
      return (
        employee.includes(searchTerm) ||
        building.includes(searchTerm) ||
        table.includes(searchTerm) ||
        startDate.includes(searchTerm) ||
        endDate.includes(searchTerm)
      );
    });
  }


   /**
   * Método para abrir el diálogo modal para crear una nueva asignación de empleado a sala.
   * Recarga los datos al cerrar el diálogo.
   */
  openCreateAssignmentDialog(): void
  {
    const dialogRef = this.dialog.open(CreateEmployeeRoomComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      panelClass: 'custom-modal'
    });

    dialogRef.componentInstance.employeeRoomCreated.subscribe(() => {
      this.loadEmployeeRooms(); // Recargar los datos de la lista
    });
  }

    /**
   * Método para abrir el diálogo modal de edición de una asignación de empleado a sala.
   * Recarga los datos después de cerrar el diálogo.
   * @param employeeRoom La asignación de empleado a sala que se desea editar.
   */
  editAssignment(employeeRoom: any): void
  {
    const dialogRef = this.dialog.open(UpdateEmployeeRoomComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      data:employeeRoom,
      panelClass: 'custom-modal'
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.loadEmployeeRooms(); // Actualizar la lista de empleados después de la edición
      }
    });

  }


  /**
   * Método para cerrar la pestaña actual y regresar a la página anterior en el historial del navegador.
   */
  closeTab(): void
  {
    window.history.back(); // Vuelve a la página anterior en el historial del navegador
  }
}
