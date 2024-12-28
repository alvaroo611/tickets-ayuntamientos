import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from '../../../services/department.service';
/**
* Component for configuring department settings through a dialog.
*/
@Component({
  selector: 'app-departments-configure',
  templateUrl: './departments-configure.component.html',
  styleUrls: ['./departments-configure.component.css'],
})
export class DepartmentsConfigureComponent {
  departmentData: any[] = [];
  departmentId: string = '';
  /**
  * Constructor to inject necessary services and dependencies.
  * @param dialogRef - Reference to the MatDialog instance for controlling dialog behavior.
  * @param data - Injected data containing the department configuration.
  * @param departmentService - Service to handle department data operations.
  * @param snackBar
  */
  constructor(
    private dialogRef: MatDialogRef<DepartmentsConfigureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private departmentService: DepartmentService,
    private snackBar:MatSnackBar
  )
  {


    if (data && data.length > 0) {
      this.departmentData = data;

      this.departmentId = this.departmentData[0]?.department?.departmentId || '';

      if (this.departmentData[0]?.horaInicio) {
        this.departmentData[0].horaInicio = this.formatTimeOnly(this.departmentData[0].horaInicio);
      }
      if (this.departmentData[0]?.horaFinal) {
        this.departmentData[0].horaFinal = this.formatTimeOnly(this.departmentData[0].horaFinal);
      }
    }

    if (!this.departmentId) {
      console.error('El objeto `data` no contiene un `departmentId` válido.');
    }
  }

  /**
  * Formats an ISO date string to display only the time in HH:mm format.
  * @param isoDate - The ISO date string to format.
  * @returns The formatted time string in HH:mm format.
  */
  private formatTimeOnly(isoDate: string): string
  {
    const date = new Date(isoDate);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  /**
  * Closes the configuration dialog.
  */
  closeDialog(): void
  {
    this.dialogRef.close();
  }
  /**
  * Combines a base date with a given time string to create a new Date object.
  * @param baseDate - The base date to combine with the time.
  * @param time - The time string in HH:mm format.
  * @returns A new Date object with the combined date and time.
  */
  private combineDateWithTime(baseDate: Date, time: string): Date
  {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0); // Ajustar horas y minutos
    return newDate;
  }
  /**
  * Saves the current department configuration by sending the updated data to the service.
  * Validates the required fields before sending the payload.
  */
  saveConfiguration(): void
  {
    const configuration = this.departmentData[0];

    if (
      configuration.horaInicio &&
      configuration.horaFinal &&
      configuration.intervalo &&
      this.departmentId
    ) {
      const payload = {
        horaInicio: this.combineDateWithTime(new Date(), configuration.horaInicio),
        horaFinal: this.combineDateWithTime(new Date(), configuration.horaFinal),
        intervalo: configuration.intervalo,
        departmentId: this.departmentId,
      };

      this.departmentService.updateDepartmentConfiguration(configuration.id, payload).subscribe(
        (response) => {

          this.dialogRef.close(response); // Cerrar el diálogo con la respuesta
          this.snackBar.open(response.message, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snack'],
          });
        },
        (error) => {
         // Manejo de errores
          let errorMessage = 'Error saving settings';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error; // Si el backend envía un mensaje como texto plano
            } else if (error.error.message) {
              errorMessage = error.error.message; // Si el backend envía un mensaje en un objeto
            } else if (Array.isArray(error.error)) {
              errorMessage = error.error.join(', '); // Si el backend envía múltiples errores como un array
            }
          }

          // Mostrar el error en el snackbar
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snack'],
          });

          console.error('Error saving settings:', error); // Log opcional
        }
      );
    } else {
      console.error('Required fields are missing or the department ID is invalid.');
    }
  }


}
