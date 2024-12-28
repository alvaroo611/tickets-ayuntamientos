import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpException, HttpStatus, Query } from '@nestjs/common';


import { UpdateDepartmentDto } from './dto/update-department.dto';
import {  TICKET_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { catchError } from 'rxjs';


/**
 * Controller for managing Departments.
 * Handles all CRUD operations related to Departments.
 */
@Controller('departamento')
export class DepartamentoController 
{
  /**
   * Constructor that injects the ClientProxy to communicate with the ticket service.
   * @param client - The client used to communicate with the ticket service via microservices.
   */
  constructor(@Inject(TICKET_SERVICE) private readonly client:ClientProxy) {}

  /**
   * Retrieves appointments by Department ID and date.
   * @param id - The ID of the department.
   * @param date - The date for filtering appointments.
   * @returns A list of appointments for the specified department and date.
   */
  @Get('appointments/:id')
  async getAppointmentsByDepartment(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.client.send('getAppointmentsByDepartment', { id, date }).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }


   /**
   * Creates a new Department.
   * @param createDepartmentDto - The data transfer object containing the details of the Department to be created.
   * @returns The result of the creation operation.
   */
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) 
  {
    return this.client.send('createDepartment', createDepartmentDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all Departments.
   * @returns The list of all Departments.
   */
  @Get()
  findAll() 
  {
    return this.client.send('findAllDepartment', {}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Retrieves all active Departments.
   * @returns The list of all active Departments.
   */
  @Get('active')
  findAllActive() 
  {
    return this.client.send('findAllActiveDepartment',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all inactive Departments.
   * @returns The list of all inactive Departments.
   */
  @Get('inactive')
  findAllInactive() 
  {
    return this.client.send('findAllInactiveDepartment',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Retrieves a specific Department by its ID.
   * @param departmentId - The ID of the Department to be retrieved.
   * @returns The requested Department.
   */
  @Get(':id')
  findOne(@Param('id') departmentId: string) 
  {
    return this.client.send('findOneDepartment', departmentId).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
  
   /**
   * Updates a Department by its ID.
   * @param departmentId - The ID of the Department to be updated.
   * @param updateDepartmentDto - The data transfer object containing the updated details.
   * @returns The result of the update operation.
   */
  @Patch(':id')
  update(@Param('id') departmentId: string,@Body() updateDepartmentDto: UpdateDepartmentDto) 
  {
    updateDepartmentDto.departmentId=departmentId;
    return this.client.send('updateDepartment', updateDepartmentDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
   /**
   * Deletes a Department by its ID.
   * @param nom_depart - The ID of the Department to be deleted.
   * @returns The result of the delete operation.
   */
  @Delete(':id')
  remove(@Param('id') nom_depart: string) 
  {
    return this.client.send('removeDepartment', nom_depart).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
