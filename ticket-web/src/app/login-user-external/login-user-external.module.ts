import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginUserExternalComponent } from './login-user-external/login-user-external.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentTypeComponent } from './login-user-external/appointment-type/appointment-type.component';
import { PriorAppointmentComponent } from './login-user-external/appointment-type/prior-appointment/prior-appointment.component';
import { MatIconModule } from '@angular/material/icon';
import { CalendarAppointmentsComponent } from './login-user-external/appointment-type/prior-appointment/calendar-appointments/calendar-appointments.component';

import { MatDialogModule } from '@angular/material/dialog';
import { AppointmentHoursComponent } from './login-user-external/appointment-type/prior-appointment/calendar-appointments/appointment-hours/appointment-hours.component';
import { ConfirmDialogComponent } from './login-user-external/appointment-type/prior-appointment/calendar-appointments/appointment-hours/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Importa la localización de tu idioma
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { TicketViewerComponent } from './login-user-external/appointment-type/prior-appointment/calendar-appointments/appointment-hours/ticket-viewer/ticket-viewer.component';

// Registra el idioma (en este caso, español)
registerLocaleData(localeEs);


@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }, // Establece el idioma a español
  ],
  declarations: [

    LoginUserExternalComponent,
      AppointmentTypeComponent,
      PriorAppointmentComponent,
      CalendarAppointmentsComponent,
      AppointmentHoursComponent,
      ConfirmDialogComponent,
      TicketViewerComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],

  exports: [
    LoginUserExternalComponent // Exportar si lo usarás en otros módulos
  ]
})
export class LoginUserExternalModule { }
