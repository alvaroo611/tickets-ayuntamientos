import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../login/auth.service';
import { EmployeeService } from '../../../services/employee.service';
import { isReactive } from '@angular/core/primitives/signals';

/**
* Component for updating department information through a dialog form.
*/
@Component({
  selector: 'app-deparments-form-update',
  templateUrl: './deparments-form-update.component.html',
  styleUrl: './deparments-form-update.component.css'
})
export class DeparmentsFormUpdateComponent implements OnInit {
  departmentName: string = '';
  description: string = '';
  responsible: string = '';
  responsibleUsers: any[] = []; //
  isActive: boolean = true;
  cityCouncilId: string = '';

  // Holds the department ID from injected data.
  departmentId: string = '';

  @Output() departmentEdit = new EventEmitter<void>();// Emits an event when the department is successfully edited.

  /**
  * Constructor to inject necessary services and dependencies.
  * @param dialogRef - Reference to the MatDialog instance for controlling dialog behavior.
  * @param department - Injected data containing the department details.
  * @param departmentService - Service to handle department data operations.
  * @param snackBar - Service to show notifications.
  * @param authService - Service for authentication and retrieving city council data.
  * @param employeeService - Service to fetch employee data.
  */
  constructor(
    private dialogRef: MatDialogRef<DeparmentsFormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public department: any,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private employeeService:EmployeeService
  ) {}
  /**
  * Lifecycle hook that runs when the component is initialized.
  * Populates form fields with injected department data and fetches responsible users.
  */
  ngOnInit(): void
  {

    if (this.department) {
      this.departmentId = this.department.departmentId;  // Obtener el ID del departamento
      this.departmentName = this.department.departmentName;
      this.description = this.department.description;
      this.responsible = this.department.responsible;
      this.isActive = this.department.isActive;

    }
    this.fetchResponsibleUsers();
  }

  /**
  * Fetches the list of responsible users based on the department type and city council.
  * Filters users with the role 'responsable' or 'admin' depending on the department type.
  */
  fetchResponsibleUsers(): void {
    const cityCouncilId=this.authService.getCityCouncil();
    if(!this.department.isAdmin)
    {
      this.employeeService.fetchEmployeesActive().subscribe(
        (users) => {

          // Filtrar usuarios con rol 'responsable'
          this.responsibleUsers = users.filter(user => user.rol === 'responsable' && user.cityCouncil.id===cityCouncilId && user.department.departmentId===this.department.departmentId);
        },
        (error) => {
          console.error('Error al obtener los responsables:', error);
        }
      );
    }else{
      this.employeeService.fetchEmployeesActive().subscribe(
        (users) => {
          // Filtrar usuarios con rol 'responsable'
          this.responsibleUsers = users.filter(user => user.rol === 'admin'&& user.cityCouncil.id===cityCouncilId);
        },
        (error) => {
          console.error('Error al obtener los responsables:', error);
        }
      );
    }

  }

  /**
  * Saves changes made to the department by sending the updated data to the service.
  * Constructs the updated department object and handles success or error responses.
  */
  saveChanges() {

    // Agregar el ID manualmente al objeto actualizado
    const updatedDepartment = {
      departmentName: this.departmentName,
      description: this.description,
      responsible: this.responsible,
      isActive: this.isActive,
      cityHallId: this.authService.getCityCouncil()
    };


    this.departmentService.updateDepartment(this.departmentId,updatedDepartment).subscribe(
      (response) => {
        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.departmentEdit.emit();
        this.dialogRef.close(response);
      },
      (error) => {
        const errorMessage =
          error?.error?.message || 'Unknown error updating department';
        const formattedErrorMessage = Array.isArray(errorMessage)
          ? errorMessage.join(', ')
          : errorMessage;
        this.snackBar.open(formattedErrorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
  }
  /**
  * Closes the dialog without saving changes.
  */
  closeTab() {
    this.dialogRef.close();
  }
}
