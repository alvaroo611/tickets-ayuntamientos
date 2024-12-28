import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CityCouncilService } from '../../services/city-council..service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * CityCouncilFormCreateComponent is responsible for the dialog form to create a new city council.
 * It initializes a new city council object, sends the data to the service for creation,
 * and allows closing the form either with or without submitting the data.
 * @returns void
 */
@Component({
  selector: 'app-city-council-form-create',
  templateUrl: './city-council-form-create.component.html',
  styleUrls: ['./city-council-form-create.component.css']
})
export class CityCouncilFormCreateComponent
{
  cityCouncil = {
    name: '',// Name of the city council
    isActive: true// Initial status of the city council (active by default)
  };
   /**
   * Constructor to initialize the component with the required services and dialog reference.
   * @param cityCouncilService CityCouncilService to manage city council data
   * @param dialogRef MatDialogRef to control the dialog's lifecycle (closing it)
   * @returns void
   */
  constructor(
    private cityCouncilService: CityCouncilService,
    private dialogRef: MatDialogRef<CityCouncilFormCreateComponent>,
    private snackBar:MatSnackBar
  ) {}
  /**
   * Creates a new city council by calling the service and sending the data to the backend.
   * If successful, it closes the dialog and notifies the parent component that a new city council was created.
   * @returns void
   */
  createCityCouncil(): void
  {
    this.cityCouncilService.createCityCouncil(this.cityCouncil).subscribe({
      next: (response) => {


        // Mostrar mensaje de éxito en el snackbar
        this.snackBar.open(response.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snack']
        });

        // Cerrar el modal y notificar que se creó el ayuntamiento
        this.dialogRef.close(true);
      },
      error: (err) => {
        // Extraer el mensaje de error desde el backend
        let errorMessage = 'Error creating town hall.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message; // Para errores genéricos del cliente
        }

        // Mostrar el mensaje de error en el snackbar
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });

        // Opcional: Registrar el error en la consola
        console.error('Error creating town hall.:', err);
      }
    });

  }
  /**
   * Closes the form dialog without making any changes.
   * @returns void
   */
  closeForm(): void
  {
    this.dialogRef.close();
  }
}
