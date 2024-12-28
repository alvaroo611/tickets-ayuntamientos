import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentHoursComponent } from '../appointment-hours.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent
{
  /**
   * Constructor: Initializes the component and injects the required data and dialog references.
   *
   * @param data - Data passed to the dialog containing information for the confirmation message.
   * @param dialogRef - Reference to the current confirmation dialog.
   * @param dialogRef2 - Reference to the parent `AppointmentHoursComponent` dialog.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialogRef2: MatDialogRef<AppointmentHoursComponent>
  ) {}

   /**
   * Method: onCancel
   * Purpose: Closes the confirmation dialog and returns `false`, indicating the user canceled the action.
   */
  onCancel(): void
  {
    this.dialogRef.close(false); // Devuelve false para indicar que se canceló.
  }

   /**
   * Method: onConfirm
   * Purpose: Closes the confirmation dialog and returns `true`, indicating the user confirmed the action.
   *          It also closes the parent dialog (`AppointmentHoursComponent`).
   */
  onConfirm(): void
  {
    this.dialogRef.close(true); // Devuelve true para indicar confirmación.
    this.dialogRef2.close(true);
  }
}
