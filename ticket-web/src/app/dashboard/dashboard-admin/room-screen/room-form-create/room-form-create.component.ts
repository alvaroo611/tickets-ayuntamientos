import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../../../services/room.service';
import { DepartmentService } from '../../../services/department.service'; // Importa el servicio de departamentos
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedDataService } from '../../../../login-user-external/services/shared-data.service';
import { AuthService } from '../../../../login/auth.service';

/**
 * Component for creating a new room. Allows input for building, office, floor, staff number,
 * room status, and department. Emits an event upon successful creation.
 * @returns void
 */
@Component({
  selector: 'app-room-form-create',
  templateUrl: './room-form-create.component.html',
  styleUrls: ['./room-form-create.component.css']
})
export class RoomFormCreateComponent implements OnInit
{
  building: string = '';
  office: string = '';
  floor: string = '';
  staffNumber: number = 0;

  isActive: boolean = true;
  departmentId: string = '';
  departments: any[] = [];

  @Output() roomCreated = new EventEmitter<void>();


  /**
   * Constructor for initializing the RoomFormCreateComponent.
   * @param dialogRef - Reference to the dialog box for closing it after creation.
   * @param roomService - Service for interacting with room-related API endpoints.
   * @param departmentService - Service for fetching department data.
   * @param snackBar - Service for showing feedback messages.
   * @param authService - Service for authentication and user-related functions.
   */
  constructor(
    private dialogRef: MatDialogRef<RoomFormCreateComponent>,
    private roomService: RoomService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private authService:AuthService
  ) {}

  /**
   * Initializes the component and loads active departments for the current city council.
   * @returns void
   */
  ngOnInit(): void
  {
    const cityCouncilId=this.authService.getCityCouncil();

    this.departmentService.fetchDepartmentsActive().subscribe(
      (departments) => {
        this.departments = departments.filter(department => department.cityCouncil.id === cityCouncilId && !department.isAdmin);

        ;
      },
      (error) => {
        this.snackBar.open('Error al cargar los departamentos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
  }
  /**
   * Creates a new room with the provided data and notifies the parent component upon success.
   * @returns void
   */
  createRoom()
  {
    const room = {
      building: this.building,
      office: Number(this.office),
      floor: Number(this.floor),
      staffNumber: this.staffNumber,
      isActive: this.isActive,
      departmentId: this.departmentId
    };

    this.roomService.createRoom(room).subscribe(
      response => {
        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.roomCreated.emit();
        this.dialogRef.close();
      },
      error => {
        let errorMessage = 'Error creating room.';
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
   * Closes the room creation form without saving any data.
   * @returns void
   */
  closeForm()
  {
    this.dialogRef.close();
  }
}
