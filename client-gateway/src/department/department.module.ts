import { Module } from '@nestjs/common';

import { DepartamentoController } from './department.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TICKET_SERVICE } from 'src/config/services';
import { envs } from 'src/config';

@Module({
  controllers: [DepartamentoController],
  imports:[ ClientsModule.register([
    {
      name: TICKET_SERVICE, // Nombre del cliente para el microservicio
      transport: Transport.TCP,
      options: {
        host: envs.ticketMicroserviceHost,
        port: envs.ticketMicroservicePort, // Comunicación interna con el microservicio por TCP en puerto 3001
      },
    },
  ]),],
  providers: [],
})
export class DepartamentoModule {}
