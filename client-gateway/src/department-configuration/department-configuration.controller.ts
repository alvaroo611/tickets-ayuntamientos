import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDepartmentConfigurationDto } from './dto/create-department-configuration.dto';
import { UpdateDepartmentConfigurationDto } from './dto/update-department-configuration.dto';
import { TICKET_SERVICE } from 'src/config/services';
import { catchError } from 'rxjs';

/**
 * Controller for managing Department Configurations.
 * Handles CRUD operations for Department Configuration entities.
 */
@Controller('department-configuration')
export class DepartmentConfigurationController 
{
  /**
   * Constructor that injects the ClientProxy for communication with the ticket service.
   * @param client - The client used to send messages to the ticket service via microservices.
   */
  constructor(
    @Inject(TICKET_SERVICE) 
    private readonly client: ClientProxy, // Cliente para enviar mensajes
  ) {}
 
   /**
   * Retrieves all Department Configurations.
   * @returns A list of all Department Configurations.
   */
  @Get()
  async findAll() 
  {
    return this.client.send('findAllDepartmentConfiguration', {}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Retrieves the Department Configuration by Department ID.
   * @param departmentId - The ID of the department for which to retrieve the configuration.
   * @returns The configuration for the specified department.
   */
  @Get('department/:departmentId')
  async findByDepartmentId(@Param('departmentId') departmentId: string) 
  {
    return this.client.send('findByDepartmentId', departmentId).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves a specific Department Configuration by its ID.
   * @param id - The ID of the Department Configuration to be retrieved.
   * @returns The requested Department Configuration.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) 
  {
    return this.client.send('findOneDepartmentConfiguration', id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Updates a Department Configuration by its ID.
   * @param id - The ID of the Department Configuration to be updated.
   * @param updateDepartmentConfigurationDto - The data transfer object containing updated configuration details.
   * @returns The result of the update operation.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentConfigurationDto: UpdateDepartmentConfigurationDto,
  ) {
    return this.client.send('updateDepartmentConfiguration', { id, ...updateDepartmentConfigurationDto }).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Deletes a Department Configuration by its ID.
   * @param id - The ID of the Department Configuration to be deleted.
   * @returns The result of the delete operation.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) 
  {
    return this.client.send('removeDepartmentConfiguration', id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
