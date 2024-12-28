import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppModule } from 'src/app.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {  TICKET_SERVICE } from 'src/config/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/auth.entity';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';
import { Department } from 'src/department/entities/department.entity';
import { JwtModule } from '@nestjs/jwt';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[JwtModule.register({
    secret: process.env.JWT_SECRET, // Lee la clave secreta desde las variables de entorno
    signOptions: { expiresIn: '1h' },
  }), ClientsModule.register([
    {
      name: TICKET_SERVICE, // Identificador del cliente
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001, // El mismo puerto que usa el microservicio
      },
    },
  ]),TypeOrmModule.forFeature([Employee,CityCouncil,Department])],
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

export class AuthModule {}
