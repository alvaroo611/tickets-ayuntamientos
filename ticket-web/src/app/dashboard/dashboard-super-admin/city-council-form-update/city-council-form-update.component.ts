import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CityCouncilService } from '../../services/city-council..service';
import { MatSnackBar } from '@angular/material/snack-bar';
/**
 * CityCouncilFormUpdateComponent is responsible for the dialog form to update a city council's information.
 * It receives the data of the city council to be edited, updates the data via a service, and provides
 * the option to close the form without making changes.
 * @returns void
 */
@Component({
  selector: 'app-city-council-form-update',
  templateUrl: './city-council-form-update.component.html',
  styleUrls: ['./city-council-form-update.component.css']
})
export class CityCouncilFormUpdateComponent
{

  cityCouncil: any;
  /**
   * Constructor to initialize the component with the required services and data.
   * @param cityCouncilService CityCouncilService for updating the city council data
   * @param dialogRef MatDialogRef to control the dialog's lifecycle (closing it)
   * @param data Data passed from the parent component to populate the form
   * @returns void
   */
  constructor(
    private cityCouncilService: CityCouncilService,
    public dialogRef: MatDialogRef<CityCouncilFormUpdateComponent>,
    private snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

      this.cityCouncil = { ...data };

    }

  /**
   * Updates the city council by calling the service and passing the updated data.
   * If successful, it closes the dialog and passes the updated data back to the parent component.
   * @returns void
   */
  updateCityCouncil(): void
  {
    // Llamamos al servicio para actualizar el ayuntamiento
    this.cityCouncilService.updateCityCouncil(this.cityCouncil.id, this.cityCouncil).subscribe(
      response => {
        // Comprobar si la respuesta tiene un mensaje
        const message =  'Has been succesfully update city council';

        // Mostrar mensaje de éxito en el snackbar
        this.snackBar.open(message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });

        // Cierra el diálogo y pasa los datos actualizados
        this.dialogRef.close(this.cityCouncil);
      },
      error => {
        // Extraer el mensaje de error desde el backend
        let errorMessage = 'Error updating town hall.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message; // Para errores genéricos del cliente
        }

        // Mostrar el mensaje de error en el snackbar
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });

        // Opcional: Registrar el error en la consola
        console.error('Error al actualizar el ayuntamiento:', error);
      }
    );
  }

  /**
   * Closes the dialog without making any changes to the city council.
   * @returns void
   */
  closeForm(): void
  {
    this.dialogRef.close();
  }
}
