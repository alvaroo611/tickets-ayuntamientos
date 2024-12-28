import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';

import { TicketModule } from './ticket/ticket.module';
import { AyuntamientoModule as CityCouncilModule } from './city-council/city-council.module';
import { DepartamentoModule as DepartmentModule } from './department/department.module';
import { SalaModule as RoomModule } from './room/room.module';
import { EmpleadoSalaModule as EmployeeRoomModule } from './employee-room/employee-room.module';
import { DepartmentConfigurationModule } from './department-configuration/department-configuration.module';
import { TechnicalHoursOutModule } from './technical_hours_out/technical_hours_out.module';





@Module({
  imports: [AuthModule, TicketModule, CityCouncilModule, DepartmentModule,RoomModule, EmployeeRoomModule, DepartmentConfigurationModule, TechnicalHoursOutModule],

  controllers: [],
  providers: [],
})
export class AppModule {}
