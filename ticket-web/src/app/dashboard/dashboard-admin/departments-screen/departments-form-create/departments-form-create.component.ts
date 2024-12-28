import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from '../../../services/department.service';
import { AuthService } from '../../../../login/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { CreateDepartmentDto } from '../../../services/models/create-department.dto';
/*
* Component for creating a new department, including form inputs and submission handling.
*/
@Component({
  selector: 'app-departments-form-create',
  templateUrl: './departments-form-create.component.html',
  styleUrl: './departments-form-create.component.css'
})
export class DepartmentFormCreateComponent
{
  departmentName: string = '';
  description: string = '';
  responsible: string = '';
  responsibleUsers: any[] = [];
  isActive: boolean = true;
  cityHallId: string = '';

  @Output() departmentCreated = new EventEmitter<void>();  // Event emitter for department creation notification.

  /**
  * Constructor to inject necessary services and dependencies.
  * @param dialogRef - Reference to the MatDialog instance for controlling dialog behavior.
  * @param departmentService - Service to handle department data operations.
  * @param authService - Service to handle authentication and authorization.
  * @param snackBar - Service to display notifications.
  * @param employeeService - Service to fetch employee data.
  */
  constructor(
    private dialogRef: MatDialogRef<DepartmentFormCreateComponent>,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private employeeService:EmployeeService
  ) {
    this.fetchResponsibleUsers();
  }


  /**
  * Fetches the list of active employees who can be responsible for a department.
  * Filters users by the 'responsable' role and current city council.
  */
  fetchResponsibleUsers(): void
  {
    const cityCouncilId=this.authService.getCityCouncil();
    this.employeeService.fetchEmployeesActive().subscribe(
      (users) => {
        // Filtrar usuarios con rol 'responsable'

      },
      (error) => {
        console.error('Error al obtener los responsables:', error);
      }
    );
  }

  /**
  * Creates a new department by gathering form data and sending it to the department service.
  * Shows a success or error message based on the result.
  */
  createDepartment()
  {
    const department:CreateDepartmentDto = {
      departmentName: this.departmentName,
      description: this.description,
      responsible: this.responsible,
      isActive: this.isActive,
      cityHallId:  this.authService.getCityCouncil(),
    };

    this.departmentService.createDepartment(department).subscribe(
      response => {

        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });


        this.departmentCreated.emit();


        this.dialogRef.close();
      },
      error => {
        let errorMessage = 'Unexpected error';
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error; // Si el backend envía un mensaje como texto plano
        } else if (error.error.message) {
          errorMessage = error.error.message; // Si el backend envía un mensaje en un objeto
        } else if (Array.isArray(error.error)) {
          errorMessage = error.error.join(', '); // Si el backend envía múltiples errores como un array
        }
      }
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
  }
  /**
  * Closes the department creation form dialog.
  */
  closeForm()
  {
    this.dialogRef.close();
  }
}
