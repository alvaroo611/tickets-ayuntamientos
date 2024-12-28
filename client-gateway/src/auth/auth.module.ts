import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AppModule } from 'src/app.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs } from 'src/config';
import { TICKET_SERVICE } from 'src/config/services';

@Module({
  controllers: [AuthController],
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
export class AuthModule {}
