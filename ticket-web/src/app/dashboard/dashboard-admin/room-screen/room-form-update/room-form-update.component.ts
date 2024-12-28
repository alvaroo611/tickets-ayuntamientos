import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../../../services/room.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../login/auth.service';
import { DepartmentService } from '../../../services/department.service';
/**
 * Component for updating the details of an existing room.
 * Allows input for building, office, floor, staff number, room status, and department.
 * Emits an event upon successful update.
 * @returns void
 */
@Component({
  selector: 'app-room-form-update',
  templateUrl: './room-form-update.component.html',
  styleUrls: ['./room-form-update.component.css']
})
export class RoomFormUpdateComponent implements OnInit
{
  building: string = '';
  office: number = 0;
  floor: number = 0;
  staffNumber: number = 0;
  isActive: boolean = true;
  departmentId: string = '';
  departments: Array<{departmentId:string, departmentName: string; description: string; responsible: string; isActive: boolean; cityHallId: string }> = [];
  currentDepartment: {
    departmentName: string;
    description: string;
    responsible: string;
    isActive: boolean;
    cityHallId: string;
  } = {
    departmentName: '',
    description: '',
    responsible: '',
    isActive: false,
    cityHallId: ''
  };

  currentDepartmentName:string='';//Variable donde se almacenara el placeholder de departamento
  @Output() roomEdit = new EventEmitter<void>();// Evento emitido cuando se actualiza la sala


  /**
   * Constructor for initializing the RoomFormUpdateComponent.
   * @param dialogRef - Reference to the dialog box for closing it after the update.
   * @param room - Room data passed from the parent component for updating.
   * @param roomService - Service for interacting with room-related API endpoints.
   * @param departmentService - Service for fetching department data.
   * @param snackBar - Service for showing feedback messages.
   * @param authService - Service for authentication and user-related functions.
   */
  constructor(
    private dialogRef: MatDialogRef<RoomFormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public room: any,
    private roomService: RoomService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  /**
   * Initializes the component and loads departments, setting current room values if available.
   * @returns void
   */
  ngOnInit(): void
  {
    if (this.room) {
      this.building = this.room.building;
      this.office = this.room.office;
      this.floor = this.room.floor;
      this.staffNumber = this.room.staffNumber;
      this.isActive = this.room.isActive;
      this.departmentId = this.room.departmentId;

    }
    this.loadDepartments();
  }

  /**
   * Loads active departments and sets the current department name based on the departmentId.
   * @returns void
   */
  loadDepartments()
  {
    const cityCouncilId=this.authService.getCityCouncil();
    this.departmentService.fetchDepartmentsActive().subscribe(
      (data) => {
        this.departments = data.filter(department => department.cityCouncil.id === cityCouncilId && !department.isAdmin);


        // Establecemos el nombre del departamento actual basado en departmentId
        const currentDept = this.departments.find(dept => dept.departmentId === this.departmentId);
        this.currentDepartmentName = currentDept ? currentDept.departmentName : '';

      },
      (error) => {
        console.error('Error al cargar departamentos:', error);
      }
    );
  }
  /**
   * Handles department change from the dropdown and updates the departmentId and name.
   * @param event - The event triggered when a new department is selected.
   * @returns void
   */
  onDepartmentChange(event: Event)
  {
    const selectElement = event.target as HTMLSelectElement;
    this.departmentId = selectElement.value;


    const selectedDept = this.departments.find(dept => dept.departmentId === this.departmentId);
    this.currentDepartmentName = selectedDept ? selectedDept.departmentName : '';

  }

  /**
   * Updates the room with the new data and emits an event upon success.
   * @returns void
   */
  saveRoomChanges()
  {
    const updatedRoom = {
      building: this.building,
      office: this.office,
      floor: this.floor,
      staffNumber: this.staffNumber,
      isActive: this.isActive,
      departmentId: this.departmentId // Asegúrate de que `departmentId` sea el nombre correcto del departamento
    };


    this.roomService.updateRooms(this.room.roomId, updatedRoom).subscribe(
      (response) => {

        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.roomEdit.emit();
        this.dialogRef.close(response);
      },
      (error) => {
        let errorMessage = 'Error desconocido al actualizar la sala';

        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error; // Mensaje como texto plano
          } else if (error.error.message) {
            errorMessage = error.error.message; // Mensaje dentro de un objeto
          } else if (Array.isArray(error.error)) {
            errorMessage = error.error.join(', '); // Lista de errores en un array
          }
        }

        // Mostrar el error en el snackbar
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack'],
        });
      }
    );
  }

  /**
   * Closes the update room dialog without saving any changes.
   * @returns void
   */
  closeTab()
  {
    this.dialogRef.close();
  }
}
