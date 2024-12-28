import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';  // Si estás utilizando diálogos
import { FormsModule } from '@angular/forms';  // Para el uso de ngModel en formularios
import { MatSelectModule } from '@angular/material/select';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { EmployeeFormComponent } from './dashboard-admin/employee-dialog/employee-form-create/employee-form-create.component';  // El formulario de empleados
import { EmployeeDialogComponent } from './dashboard-admin/employee-dialog/employee-dialog.component';
import { CommonModule } from '@angular/common';
import { DashboardTecComponent } from './dashboard-tec/dashboard-tec.component';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeFormUpdateComponent } from './dashboard-admin/employee-dialog/employee-form-update/employee-form-update.component';
import { DepartmentsScreenComponent } from './dashboard-admin/departments-screen/departments-screen.component';
import { DepartmentFormCreateComponent } from './dashboard-admin/departments-screen/departments-form-create/departments-form-create.component';
import { DeparmentsFormUpdateComponent } from './dashboard-admin/departments-screen/deparments-form-update/deparments-form-update.component';
import { MatCardModule } from '@angular/material/card';
import { RoomFormCreateComponent } from './dashboard-admin/room-screen/room-form-create/room-form-create.component';
import { RoomFormUpdateComponent } from './dashboard-admin/room-screen/room-form-update/room-form-update.component';
import { RoomsScreenComponent } from './dashboard-admin/room-screen/room-screen.component';
import { TicketsScreenComponent } from './dashboard-admin/tickets-screen/tickets-screen.component';
import { DepartmentsConfigureComponent } from './dashboard-admin/departments-screen/departments-configure/departments-configure.component';
import { AssignEmployeeRoomComponent } from './dashboard-tec/assign-employee-room/assign-employee-room.component';
import { CreateEmployeeRoomComponent } from './dashboard-tec/assign-employee-room/create-employee-room/create-employee-room.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UpdateEmployeeRoomComponent } from './dashboard-tec/assign-employee-room/update-employee-room/update-employee-room.component';
import { MatMenuModule } from '@angular/material/menu';
import { UpdateTicketComponent } from './dashboard-tec/update-ticket/update-ticket.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AssignHoursOutComponent } from './dashboard-tec/assign-hours-out/assign-hours-out.component';
import { CreateAssignHoursOutComponent } from './dashboard-tec/assign-hours-out/create-assign-hours-out/create-assign-hours-out.component';
import { UpdateAssignHoursOutComponent } from './dashboard-tec/assign-hours-out/update-assign-hours-out/update-assign-hours-out.component';
import { DashboardSuperAdminComponent } from './dashboard-super-admin/dashboard-super-admin.component';

import { CityCouncilFormCreateComponent } from './dashboard-super-admin/city-council-form-create/city-council-form-create.component';
import { CityCouncilFormUpdateComponent } from './dashboard-super-admin/city-council-form-update/city-council-form-update.component';
import { CityCouncilConfigComponent } from './dashboard-super-admin/city-council-config/city-council-config.component';
import { ConfigFormCreateComponent } from './dashboard-super-admin/city-council-config/config-form-create/config-form-create.component';
import { ConfigFormUpdateComponent } from './dashboard-super-admin/city-council-config/config-form-update/config-form-update.component';
import { TicketsByRoomComponent } from './dashboard-tec/tickets-by-room/tickets-by-room.component';
import { LiveTicketRoomComponent } from './dashboard-tec/tickets-by-room/live-ticket-room/live-ticket-room.component';
import { ChanguePasswordFormComponent } from './dashboard-super-admin/changue-password-form/changue-password-form.component';
@NgModule({
  declarations: [

    DashboardAdminComponent,
    DashboardTecComponent,
    EmployeeDialogComponent,
    EmployeeFormComponent,
    EmployeeFormUpdateComponent,
    DepartmentsScreenComponent,
    DepartmentFormCreateComponent,
    DeparmentsFormUpdateComponent,
    RoomsScreenComponent,
    RoomFormCreateComponent,
    RoomFormUpdateComponent,
    TicketsScreenComponent,
    DepartmentsConfigureComponent,
    AssignEmployeeRoomComponent,
    CreateEmployeeRoomComponent,
    UpdateEmployeeRoomComponent,
    UpdateTicketComponent,
    AssignHoursOutComponent,
    CreateAssignHoursOutComponent,
    UpdateAssignHoursOutComponent,
    DashboardSuperAdminComponent,
    CityCouncilFormCreateComponent,
    CityCouncilFormUpdateComponent,
    CityCouncilConfigComponent,
    ConfigFormCreateComponent,
    ConfigFormUpdateComponent,
    TicketsByRoomComponent,
    LiveTicketRoomComponent,
    ChanguePasswordFormComponent,


  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule,  // Necesario para ngModel
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,

  ],

  exports: [
    DashboardAdminComponent,
    DashboardTecComponent
  ]
})
export class DashboardModule { }
