import { Module } from '@nestjs/common';
import { EmpleadoSalaService } from './employee-room.service';
import { EmpleadoSalaController } from './employee-room.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TICKET_SERVICE } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from 'src/ticket/entities/ticket.entity';
import { EmployeeRoom } from './entities/employee-room.entity';
import { Employee } from 'src/auth/entities/auth.entity';
import { Room } from 'src/room/entities/sala.entity';

@Module({
  controllers: [EmpleadoSalaController],
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
    ]),TypeOrmModule.forFeature([EmployeeRoom,Room,Employee]),
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
  providers: [EmpleadoSalaService],
})
export class EmpleadoSalaModule {}
