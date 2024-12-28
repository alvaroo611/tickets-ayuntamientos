import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateEmployeeDto } from '../../../services/models/create-empleado.dto';
import { EmployeeService } from '../../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../login/auth.service';
import { DepartmentService } from '../../../services/department.service';

/*
 * Component for create employee.
 */
@Component({
  selector: 'app-employee-form-update',
  templateUrl: './employee-form-update.component.html',
  styleUrls: ['./employee-form-update.component.css']
})
export class EmployeeFormUpdateComponent implements OnInit
{
  dni: string = '';
  name: string = '';
  password: string = '';
  confirmPassword: string = '';
  rol: string = '';
  isActive: boolean = true;
  showPassword: boolean = false;  /** Controls password visibility */
  showConfirmPassword: boolean = false;   /** Controls confirmation password visibility */
  department_id?: string = '';   /** ID of the department the employee belongs to */
  currentDepartment:string='';  /** Current department name of the employee */
  departments:any[] = [];
  @Output() employeeEdit = new EventEmitter<void>(); /** EventEmitter for notifying parent component when employee details are updated */

  /**
   * Constructor for EmployeeFormUpdateComponent.
   * @param dialogRef - The dialog reference used to close the dialog after saving changes.
   * @param employee - The employee data passed into the dialog for editing.
   * @param employeeService - Service for interacting with employee-related API endpoints.
   * @param snackBar - Service for showing snack bar notifications.
   * @param authService - Service for authentication and user-related functions.
   * @param departmentService - Service for fetching department data.
   */
  constructor(
    private dialogRef: MatDialogRef<EmployeeFormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: CreateEmployeeDto,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private authService:AuthService,
    private departmentService:DepartmentService
  ) {}
  /**
   * ngOnInit is called when the component is initialized.
   * It sets the employee data and retrieves the list of active departments.
   * @returns void
   */
  ngOnInit(): void
  {
    if (this.employee) {

      this.dni = this.employee.DNI;
      this.name = this.employee.name;
      this.password ='';
      this.confirmPassword='';
      this.rol = this.employee.rol;
      this.isActive = this.employee.isActive;
      this.department_id = this.employee.department_id;
      // Set the current department name based on the department ID
      const department = this.departments.find(department => department.departmentId === this.department_id);
      if (department) {
        this.currentDepartment = department.departmentName;  // Almacena el nombre del departamento
      }
      }
      this.getDepartments();//Fetch departments on component load

  }

  /**
   * Toggles the visibility of the password field.
   * @returns void
   */
  togglePasswordVisibility(): void
  {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggles the visibility of the confirm password field.
   * @returns void
   */
  toggleConfirmPasswordVisibility(): void
  {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Fetches the list of active departments for the current city council.
   * Filters departments by the current city council's ID.
   * @returns void
   */
  getDepartments()
  {
    const cityCouncilId=this.authService.getCityCouncil();
    this.departmentService.fetchDepartmentsActive().subscribe(
      (departments) => {

        this.departments = departments.filter(department => department.cityCouncil.id === cityCouncilId);


      },
      (error) => {
        this.snackBar.open('Error al obtener los departamentos.', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );

  }

  /**
   * Saves the changes made to the employee.
   * Validates the password fields and updates the employee's data via the API.
   * @returns void
   */
  saveChanges()
  {
    if (this.password !== this.confirmPassword)
    {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snack']
      });
      return;
    }
    const updatedEmployee:CreateEmployeeDto = {
      DNI: this.dni,
      name: this.name,
      rol: this.rol,
      department_id:this.department_id,
      isActive: this.isActive
    };
    if (this.password)
    {
      updatedEmployee.password = this.password;
    }
    this.employeeService.updateEmployee(updatedEmployee).subscribe(
      (response) => {


        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.employeeEdit.emit();
        this.dialogRef.close(response);
      },
      (error) => {
        console.error('Error al actualizar el empleado:', error);


        const errorMessage =
          error?.error?.message || 'Error desconocido al actualizar el empleado';


        const formattedErrorMessage = Array.isArray(errorMessage)
          ? errorMessage.join(', ')// If multiple errors, show all
          : errorMessage;


        this.snackBar.open(formattedErrorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );

  }


  /**
   * Closes the employee form dialog without saving changes.
   * @returns void
   */
  closeTab()
  {
    this.dialogRef.close();
  }
}
