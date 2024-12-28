import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { EmployeeFormComponent } from '../../../dashboard-admin/employee-dialog/employee-form-create/employee-form-create.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeFormUpdateComponent } from '../../../dashboard-admin/employee-dialog/employee-form-update/employee-form-update.component';
import { EmployeeService } from '../../../services/employee.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../login/auth.service';
import { CreateEmployeeDto } from '../../../services/models/create-empleado.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../../services/department.service';
import { Observable } from 'rxjs';


/**
 * ConfigFormCreateComponent manages the creation of new administrators in the system.
 * It provides an interface to input an admin's details such as DNI, name, password, role, and active status.
 * The component interacts with the backend services to create an employee and assign them to a department.
 * @returns void
 */
@Component({
  selector: 'app-config-form-create',
  templateUrl: './config-form-create.component.html',
  styleUrl: './config-form-create.component.css'
})
export class ConfigFormCreateComponent implements OnInit
{
  dni: string = '';
  name: string = '';
  password: string = '';
  confirmPassword: string = '';  // Nuevo campo para la confirmación de la contraseña
  rol: string = '';
  isActive: boolean = true;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false; // Propiedad para controlar la visibilidad de la confirmación de la contraseña
  selectedDepartmentId: string = '';  // Nuevo campo para almacenar el departamento seleccionado
  departments:any;  // Lista de departamentos


  @Output() employeeCreated = new EventEmitter<void>(); // Emitir el evento cuando un empleado es creado
  /**
   * Constructor to initialize the component with injected dependencies like employee service,
   * department service, authentication service, and snackbar for feedback.
   * @param dialogRef MatDialogRef for closing the dialog once the employee is created.
   * @param employeeService Service for employee CRUD operations.
   * @param authService Authentication service (not used in this specific component).
   * @param snackBar MatSnackBar for feedback messages to the user.
   * @param departmentService Service for fetching departments.
   * @param cityCouncil Data related to the city council from the parent dialog.
   */
  constructor(
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private departmentService: DepartmentService , // Inyección del servicio de departamentos
    @Inject(MAT_DIALOG_DATA) public cityCouncil: any,
  ) {}
  /**
   * ngOnInit lifecycle hook to fetch the department ID when the component initializes.
   * It subscribes to the Observable returned by getDepartmentId and updates the selected department.
   * @returns void
   */
  ngOnInit()
  {
    // Suscribirse al Observable para obtener el departmentId
    this.getDepartmentId().subscribe(
      (departmentId) => {
        this.selectedDepartmentId = departmentId;

      },
      (error) => {
        console.error('Error al obtener el departmentId:', error);
        this.snackBar.open('Error al obtener el departamento', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack'],
        });
      }
    );
  }
  /**
   * Toggles the visibility of the password field for security purposes.
   * @returns void
   */
  togglePasswordVisibility()
  {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggles the visibility of the confirm password field for security purposes.
   * @returns void
   */
  toggleConfirmPasswordVisibility()
  {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Fetches the department ID based on the city council provided. It calls the department service
   * to get the list of active departments and filters them to find the appropriate department for the admin.
   * If a matching department is found, it emits the department ID.
   * @returns Observable<string> - Returns an observable that emits the department ID.
   */
  getDepartmentId(): Observable<string>
  {
    const cityCouncilId = this.cityCouncil.id;

    return new Observable<string>((observer) => {
      this.departmentService.fetchDepartmentsActive().subscribe(
        (departments) => {

          const filteredDepartments = departments.filter(department => department.cityCouncil.id === cityCouncilId && department.isAdmin);

          // Verificamos si hay algún departamento filtrado
          if (filteredDepartments.length > 0) {
            const departmentId = filteredDepartments[0].departmentId;
            observer.next(departmentId); // Emitimos el departmentId
            observer.complete(); // Cerramos el observable
          } else {
            observer.error('No se encontró el departamento.');
          }
        },
        (error) => {
          this.snackBar.open('Error al obtener los departamentos.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snack']
          });
          observer.error(error); // Emitimos el error al observable
        }
      );
    });
  }


  /**
   * Handles the creation of a new employee (admin). It validates that the passwords match,
   * constructs an employee object, and calls the employee service to create the employee.
   * Upon success, it emits an event, shows a success message, and closes the dialog.
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
    const rol='admin';
    const employee = {
      DNI: this.dni,
      name: this.name,
      password: this.password,
      rol: rol,
      isActive: this.isActive,
      cityCouncilId: this.cityCouncil.id,
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
        // Manejo del error, se extrae el mensaje del backend
        let errorMessage = 'Error al crear el empleado';

        if (error.error) {
          // Verificar si el error es un string
          if (typeof error.error === 'string') {
            errorMessage = error.error;  // Mensaje de error en texto plano
          }
          // Si el error tiene un objeto con el campo message
          else if (error.error.message) {
            errorMessage = error.error.message;  // Mensaje de error en un objeto
          }
          // Si el error es un array de mensajes
          else if (Array.isArray(error.error)) {
            errorMessage = error.error.join(', ');  // Lista de errores en un array
          }
        }

        // Mostrar el mensaje de error en el snackbar
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    );
  }


  /**
   * Closes the form dialog without saving any changes.
   * @returns void
   */
  closeForm()
  {
    this.dialogRef.close();
  }
}
