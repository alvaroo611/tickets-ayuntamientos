import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';

import { ClientsModule, Transport } from '@nestjs/microservices';
import {  TICKET_SERVICE } from 'src/config/services';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';

import { Employee } from 'src/auth/entities/auth.entity';
import { Department } from 'src/department/entities/department.entity';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';
import { Room } from 'src/room/entities/sala.entity';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports:[ClientsModule.register([
    {
      name: TICKET_SERVICE, // Identificador del cliente
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001, // El mismo puerto que usa el microservicio
      },
    },
  ]),TypeOrmModule.forFeature([Department,CityCouncil,Ticket,Room,Employee]),],
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
    ]),
  ]
})
export class TicketModule {}
