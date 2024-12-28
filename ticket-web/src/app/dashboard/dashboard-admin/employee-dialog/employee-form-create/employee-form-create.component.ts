import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../../login/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../../services/department.service'; // Asegúrate de que esta ruta sea correcta

/**
 * Component for update employee.
 */
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form-create.component.html',
  styleUrls: ['./employee-form-create.component.css']
})
export class EmployeeFormComponent implements OnInit
{
  //Propertys form
  dni: string = '';
  name: string = '';
  password: string = '';
  confirmPassword: string = '';
  rol: string = '';
  isActive: boolean = true;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  selectedDepartmentId: string = '';
  departments:any[] = [];

  @Output() employeeCreated = new EventEmitter<void>();  // Emit event

  /**
   * Constructor: injects necessary dependencies
   */
  constructor(
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private departmentService: DepartmentService  // Inyección departments service
  ) {}

  /**
   * Initializes the component and fetches departments.
   * @returns void
   */
  ngOnInit()
  {

    this.getDepartments();
  }


  /**
   * Toggles the visibility of the password field.
   * @returns void
   */
  togglePasswordVisibility()
  {
    this.showPassword = !this.showPassword;
  }


  /**
   * Toggles the visibility of the confirm password field.
   * @returns void
   */

  toggleConfirmPasswordVisibility()
  {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Fetches the list of active departments for the current city council.
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
   * Validates form data and creates a new employee if valid.
   * @returns void
   */
  createEmployee()
  {
    if (this.password !== this.confirmPassword) {
      // Si las contraseñas no coinciden, no crear el empleado
      this.snackBar.open('Las contraseñas no coinciden.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snack']
      });
      return; // Detener la ejecución de la creación del empleado
    }

    const employee = {
      DNI: this.dni,
      name: this.name,
      password: this.password,
      rol: this.rol,
      isActive: this.isActive,
      cityCouncilId: this.authService.getCityCouncil(),
      department_id: this.selectedDepartmentId  // Incluir el departamento seleccionado
    };

    this.employeeService.createEmployee(employee).subscribe(
      response => {
        // Mostrar el mensaje de éxito
        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });

        // Emitir evento para notificar que se ha creado un empleado
        this.employeeCreated.emit();  // Emitir el evento

        // Cerrar el diálogo
        this.dialogRef.close();
      },
      error => {
        // Mostrar mensaje de error
        let errorMessage = 'Error al crear el empleado';
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
   * Closes the form dialog.
   * @returns void
   */
  closeForm()
  {
    this.dialogRef.close();
  }
}
