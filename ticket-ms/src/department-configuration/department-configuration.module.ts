import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentConfigurationService } from './department-configuration.service';
import { DepartmentConfigurationController } from './department-configuration.controller';
import { DepartmentConfiguration } from './entities/department-configuration.entity';
import { Department } from 'src/department/entities/department.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TICKET_SERVICE } from 'src/config';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([DepartmentConfiguration, Department])],
  controllers: [DepartmentConfigurationController],
  providers: [DepartmentConfigurationService],
  exports: [
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
    DepartmentConfigurationService],
})
export class DepartmentConfigurationModule {}
