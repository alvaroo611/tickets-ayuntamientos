import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../../login/auth.service';
import { CreateEmployeeDto } from '../../../services/models/create-empleado.dto';

/**
 * ConfigFormUpdateComponent handles the functionality of updating the admin configuration,
 * including the admin's name, password, and active status. It communicates with the backend to save changes,
 * and provides feedback to the user through SnackBar notifications.
 * It also handles password visibility toggling and closes the form upon successful update.
 */
@Component({
  selector: 'app-config-form-update',
  templateUrl: './config-form-update.component.html',
  styleUrls: ['./config-form-update.component.css']
})

export class ConfigFormUpdateComponent {
  @Output() employeeEditer = new EventEmitter<void>();
  dni: string;
  name: string;
  password: string='';
  confirmPassword: string='';
  isActive: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  cityCouncil:string='';
  departmentId:string='';


  /**
   * Constructor to initialize the component with injected dependencies and set up initial values
   * based on the modal data.
   * @param dialogRef MatDialogRef for closing the dialog after updates.
   * @param employeeService Service to interact with employee data.
   * @param authService Authentication service (though not currently used here).
   * @param snackBar MatSnackBar for showing feedback messages.
   * @param data Data passed from the parent dialog to initialize the form.
   */
  constructor(
    private dialogRef: MatDialogRef<ConfigFormUpdateComponent>,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {

    this.dni = data.DNI;

    this.name = data.name;
    this.isActive = data.isActive;
    this.cityCouncil=data.cityCouncil.id;
    this.departmentId=data.department.departmentId;
  }

  /**
   * Function to handle the update of admin information including password and active status.
   * Displays a Snackbar for feedback, emits an event for parent components, and closes the dialog.
   * @returns void
   */
  updateConfig(): void
  {
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden.', 'Cerrar', { duration: 3000 });
      return;
    }
    const rol='admin';
    const updatedConfig:CreateEmployeeDto = {
      DNI: this.dni,
      name: this.name,
      password: this.password,
      rol: rol,
      isActive: this.isActive,
      cityCouncilId: this.cityCouncil,
      department_id: this.departmentId
    };
    if (this.password)
      {
        updatedConfig.password = this.password;
      }


    this.employeeService.updateEmployee(updatedConfig).subscribe(
      response => {
        
        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.employeeEditer.emit();
        this.dialogRef.close();
      },
      error => {
       // Extraer el mensaje de error del backend
        let errorMessage = 'Error al actualizar la configuración.';

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
   * Closes the form dialog without saving any changes.
   * @returns void
   */
  closeForm(): void
  {
    this.dialogRef.close();
  }
}
