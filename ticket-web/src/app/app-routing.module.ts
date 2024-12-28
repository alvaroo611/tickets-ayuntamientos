import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardTecComponent } from './dashboard/dashboard-tec/dashboard-tec.component';
import { DashboardAdminComponent } from './dashboard/dashboard-admin/dashboard-admin.component';
import { LoginComponent } from './login/login/login.component';
import { AuthGuard } from './login/guards/auth.guard';
import { EmployeeDialogComponent } from './dashboard/dashboard-admin/employee-dialog/employee-dialog.component';
import { DepartmentsScreenComponent } from './dashboard/dashboard-admin/departments-screen/departments-screen.component';
import { RoomsScreenComponent } from './dashboard/dashboard-admin/room-screen/room-screen.component';
import { TicketsScreenComponent } from './dashboard/dashboard-admin/tickets-screen/tickets-screen.component';
import { AssignEmployeeRoomComponent } from './dashboard/dashboard-tec/assign-employee-room/assign-employee-room.component';
import { LoginUserExternalComponent } from './login-user-external/login-user-external/login-user-external.component';
import { AppointmentTypeComponent } from './login-user-external/login-user-external/appointment-type/appointment-type.component';
import { PriorAppointmentComponent } from './login-user-external/login-user-external/appointment-type/prior-appointment/prior-appointment.component';
import { CalendarAppointmentsComponent } from './login-user-external/login-user-external/appointment-type/prior-appointment/calendar-appointments/calendar-appointments.component';
import { AssignHoursOutComponent } from './dashboard/dashboard-tec/assign-hours-out/assign-hours-out.component';
import { DashboardSuperAdminComponent } from './dashboard/dashboard-super-admin/dashboard-super-admin.component';
import { CityCouncilConfigComponent } from './dashboard/dashboard-super-admin/city-council-config/city-council-config.component';
import { TicketsByRoomComponent } from './dashboard/dashboard-tec/tickets-by-room/tickets-by-room.component';
import { LiveTicketRoomComponent } from './dashboard/dashboard-tec/tickets-by-room/live-ticket-room/live-ticket-room.component';

// Componente para la página de técnico

const routes: Routes = [
  {
    path: 'admin', component: DashboardAdminComponent,
    canActivate: [AuthGuard], data: { roles: ['admin'] }
  },
  {
    path: 'tec', component: DashboardTecComponent,
     canActivate: [AuthGuard], data: { roles:['tec','responsable'] }
  },
  {
    path: 'employees',
    component: EmployeeDialogComponent,
    canActivate: [AuthGuard], data: { roles: ['admin'] } // Pantalla de listado de empleados
  },
  {
    path: 'departments',
    component: DepartmentsScreenComponent,
    canActivate: [AuthGuard], data: { roles: ['admin'] }  // Pantalla de listado de empleados
  },
  {
    path: 'rooms',
    component: RoomsScreenComponent ,
    canActivate: [AuthGuard], data: { roles: ['admin'] } // Pantalla de listado de empleados
  },
  {
    path: 'tickets',
    component: TicketsScreenComponent ,
    canActivate: [AuthGuard], data: { roles: ['admin'] } // Pantalla de listado de empleados
  },
  {
     path: 'assign-employee-room', component: AssignEmployeeRoomComponent,
     canActivate: [AuthGuard], data: { roles:['responsable'] }
  },
  {
    path: 'assign-hours-out', component: AssignHoursOutComponent,
    canActivate: [AuthGuard], data: { roles:['responsable'] }
  },
  {
    path: 'tickets-by-room', component: TicketsByRoomComponent,
    canActivate: [AuthGuard], data: { roles:['responsable'] }
  },
  {
    path: 'live-ticket-room', component: LiveTicketRoomComponent,
    canActivate: [AuthGuard], data: { roles:['responsable'] }
  },
  {
    path: 'super-admin', component: DashboardSuperAdminComponent,
    canActivate: [AuthGuard], data: { roles:['super-admin'] }
  },
  {
    path: 'config-admin', component: CityCouncilConfigComponent,
    canActivate: [AuthGuard], data: { roles:['super-admin'] }
  },
  {
    path: 'login-appointment', component: LoginUserExternalComponent  // Esta ruta se mostrará al inicio, por ejemplo
  },
  {
    path: 'prior-appointment', component: PriorAppointmentComponent
  },
  {
    path: 'calendar', component: CalendarAppointmentsComponent
  },
  {
    path: 'type-cita', component:AppointmentTypeComponent
  },
  {
    path: '', component: LoginComponent  // Esta ruta se mostrará al inicio, por ejemplo
  },
  {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
