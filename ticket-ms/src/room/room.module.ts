import { Module } from '@nestjs/common';
import { SalaService } from './room.service';
import { SalaController } from './room.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TICKET_SERVICE } from 'src/config';

import { Room } from './entities/sala.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/department/entities/department.entity';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';

@Module({
  controllers: [SalaController],
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
    ]),TypeOrmModule.forFeature([Department,Room,Ticket,CityCouncil]),
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
  providers: [SalaService],
})
export class SalaModule {}
