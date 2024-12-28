import { Module } from '@nestjs/common';

import { TicketController } from './ticket.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TICKET_SERVICE } from 'src/config/services';
import { envs } from 'src/config';

@Module({
  controllers: [TicketController],
  providers: [],
  imports:[ClientsModule.register([
    {
      name: TICKET_SERVICE, // Nombre del cliente para el microservicio
      transport: Transport.TCP,
      options: {
        host: envs.ticketMicroserviceHost,
        port: envs.ticketMicroservicePort, // Comunicación interna con el microservicio por TCP en puerto 3001
      },
    },
  ]),]
})
export class TicketModule {}
