import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpException, HttpStatus } from '@nestjs/common';


import { TICKET_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEmployeeRoomDto } from './dto/create-employee-room.dto';
import { UpdateEmployeeRoomDto } from './dto/update-employee-room.dto';
import { catchError } from 'rxjs';

/**
 * Controller for managing Employee Room associations.
 * Handles CRUD operations for Employee Room entities.
 */
@Controller('empleado-sala')
export class EmpleadoSalaController 
{
   /**
   * Constructor that injects the ClientProxy for communication with the ticket service.
   * @param client - The client used to send messages to the ticket service via microservices.
   */
  constructor(@Inject(TICKET_SERVICE) private readonly client:ClientProxy) {}

  /**
   * Creates a new Employee Room association.
   * @param createEmployeeRoomDto - The data transfer object containing employee room details.
   * @returns The result of the creation operation.
   */
  @Post()
  create(@Body() createEmployeeRoomDto: CreateEmployeeRoomDto) 
  {
    return this.client.send('createEmpleadoSala', createEmployeeRoomDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all Employee Room associations.
   * @returns A list of all Employee Room associations.
   */
  @Get()
  findAll() 
  {
    return this.client.send('findAllEmpleadoSala', {}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Retrieves all active Employee Room associations.
   * @returns A list of active Employee Room associations.
   */
  @Get('active')
  findAllActive() 
  {
    return this.client.send('findAllActiveEmpleadoSala',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all inactive Employee Room associations.
   * @returns A list of inactive Employee Room associations.
   */
  @Get('inactive')
  findAllInactive() 
  {
    return this.client.send('findAllInactiveEmpleadoSala',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves a specific Employee Room association by its ID.
   * @param id - The ID of the Employee Room association to be retrieved.
   * @returns The requested Employee Room association.
   */
  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.client.send('findOneEmpleadoSala',id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Updates a specific Employee Room association by its ID.
   * @param id - The ID of the Employee Room association to be updated.
   * @param updateEmployeeRoomDto - The data transfer object containing updated employee room details.
   * @returns The result of the update operation.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeRoomDto: UpdateEmployeeRoomDto) 
  {
    updateEmployeeRoomDto.id=id;
    return this.client.send('updateEmpleadoSala', updateEmployeeRoomDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Deactivated a specific Employee Room association by its ID.
   * @param id - The ID of the Employee Room association to be deactivated.
   * @returns The result of the deactivated operation.
   */
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.client.send('removeEmpleadoSala',id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
