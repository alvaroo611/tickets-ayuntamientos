import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// Asegúrate de importar el servicio

@Component({
  selector: 'app-changue-password-form',
  templateUrl: './changue-password-form.component.html',
  styleUrls: ['./changue-password-form.component.css']
})
export class ChanguePasswordFormComponent {
  password: string = '';  // Cambié de 'newPassword' a 'password'
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ChanguePasswordFormComponent>,
    private employeeService: EmployeeService,  // Inyectamos el servicio aquí
    private snackBar:MatSnackBar
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.password === this.confirmPassword) {
      const passwordSend={
        password:this.password
      }
      // Llamamos al método del servicio para actualizar la contraseña
      this.employeeService.updatePassword(passwordSend).subscribe(
        response => {
          // Mostrar el mensaje de éxito desde la respuesta

          this.snackBar.open(response.message, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snack'],
          });

          console.log('Contraseña actualizada con éxito', response);
          this.dialogRef.close();  // Cerrar el diálogo después de actualizar la contraseña
        },
        error => {
          // Extraer el mensaje de error desde el backend
          let errorMessage = 'Error desconocido al actualizar la contraseña';

          if (error.error) {
            // Verificamos si el backend envía un mensaje
            if (typeof error.error === 'string') {
              errorMessage = error.error; // Mensaje como texto plano
            } else if (error.error.message) {
              errorMessage = error.error.message; // Mensaje en un objeto
            } else if (Array.isArray(error.error)) {
              errorMessage = error.error.join(', '); // Lista de errores en un array
            }
          }

          // Mostrar el error en el snackbar
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snack'],
          });
        console.error('Error al actualizar la contraseña', error);
        }
      );
    } else {
      // Si las contraseñas no coinciden, puedes mostrar un mensaje de error o advertencia
      console.error('Las contraseñas no coinciden');
    }
  }
}
