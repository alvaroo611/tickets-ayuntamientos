import { Module } from '@nestjs/common';
import { DepartamentoService } from './department.service';
import { DepartamentoController } from './department.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TICKET_SERVICE } from 'src/config/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';
import { DepartmentConfiguration } from 'src/department-configuration/entities/department-configuration.entity';
import { DepartmentConfigurationModule } from 'src/department-configuration/department-configuration.module';
import { Room } from 'src/room/entities/sala.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';


@Module({
  controllers: [DepartamentoController],
  imports:[
    ClientsModule.register([
    {
        name: TICKET_SERVICE, // Identificador del cliente
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001, // El mismo puerto que usa el microservicio
        },
      },
    ]),TypeOrmModule.forFeature([Department,CityCouncil,DepartmentConfiguration,Room,Ticket]),DepartmentConfigurationModule
  ],
  
  exports:[
    ClientsModule.register([
    {
        name: TICKET_SERVICE, // Identificador del cliente
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001, // El mismo puerto que usa el microservicio
        },
      },
    ])
  ],
  providers: [DepartamentoService],
})
export class DepartamentoModule {}
