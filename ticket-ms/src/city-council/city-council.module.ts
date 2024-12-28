import { Module } from '@nestjs/common';
import { AyuntamientoService } from './city-council.service';
import { AyuntamientoController } from './city-council.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TICKET_SERVICE } from 'src/config/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityCouncil } from './entities/city-council.entity';
import { Department } from 'src/department/entities/department.entity';


@Module({
  controllers: [AyuntamientoController],
  imports:[ClientsModule.register([
    {
        name: TICKET_SERVICE, // Identificador del cliente
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001, // El mismo puerto que usa el microservicio
        },
      },
    ]),TypeOrmModule.forFeature([CityCouncil,Department]),
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
  providers: [AyuntamientoService],
})
export class AyuntamientoModule {}
