import { Module } from '@nestjs/common';

import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Ticket } from './ticket/entities/ticket.entity';
import { Room } from './room/entities/sala.entity';
import { EmployeeRoom } from './employee-room/entities/employee-room.entity';
import { Employee } from './auth/entities/auth.entity';
import { Department } from './department/entities/department.entity';
import { CityCouncil } from './city-council/entities/city-council.entity';
import { DepartamentoModule as DepartmentModule } from './department/department.module';
import { AyuntamientoModule as CityCouncilModule } from './city-council/city-council.module';
import { EmpleadoSalaModule as EmployeeRoomModule } from './employee-room/employee-room.module';
import { SalaModule as RoomModule } from './room/room.module';
import { DepartmentConfigurationModule } from './department-configuration/department-configuration.module';
import { TechnicalHoursOutModule } from './technical-hours-out/technical-hours-out.module';
import { DepartmentConfiguration } from './department-configuration/entities/department-configuration.entity';
import { TechnicalHoursOut } from './technical-hours-out/entities/technical-hours-out.entity';


//Ejecutar docker  docker exec -it mysql_nestjs mysql -u root -p

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,  // Permite que las variables estén disponibles en toda la app
    envFilePath: '.env',  // Define el archivo .env (opcional si es el predeterminado)
  }) ,TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('MYSQL_USER'),
      password: configService.get<string>('MYSQL_ROOT_PASSWORD'),
      database: configService.get<string>('MYSQL_DATABASE'),
      entities: [Ticket, Room, EmployeeRoom, Employee, Department, CityCouncil, DepartmentConfiguration, TechnicalHoursOut],
      autoLoadEntities: true,
      synchronize: true, // Cambiar a false en producción
    }),
  }),DepartmentModule,DepartmentConfigurationModule,TechnicalHoursOutModule,CityCouncilModule,EmployeeRoomModule,RoomModule,TicketModule, AuthModule, DepartmentConfigurationModule, TechnicalHoursOutModule
],

  controllers: [],
  providers: [],
})
export class AppModule {}
