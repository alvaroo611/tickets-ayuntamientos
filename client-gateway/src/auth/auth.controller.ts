import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpException, HttpStatus } from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { TICKET_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
/**
 * Controller for handling authentication-related requests.
 */
@Controller('auth')
export class AuthController 
{
  
   /**
   * Constructor that injects the client proxy for communication with other services.
   * @param client - Client proxy for sending requests to the ticket service.
   */
  constructor( @Inject(TICKET_SERVICE) private readonly client:ClientProxy) {}

  /**
   * Handles the creation of a new authentication record.
   * @param createAuthDto - Data transfer object containing the authentication details to be created.
   * @returns Observable of the response from the ticket service.
   */
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) 
  {
    
    return this.client.send('createAuth', createAuthDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Handles the creation of a super admin.
   * @param createSuperAdmin - Data transfer object containing the super admin details.
   * @returns Observable of the response from the ticket service.
   */
  @Post('super-admin')
  createSuperAdmin(@Body() createSuperAdmin: CreateSuperAdminDto) 
  {
   
    return this.client.send('super-admin', createSuperAdmin).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }



  /**
   * Handles the update of the super-admin password.
   * @param newPassword - The new password to be set for the super-admin.
   * @returns Observable of the response from the service handling password update.
   */
  @Patch('updatePasswordSuperAdmin')
  updatePasswordSuperAdmin(@Body() newPassword: any) 
  {
    return this.client.send('updatePasswordSuperAdmin', newPassword).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Handles user login authentication.
   * @param loginAuthDto - Data transfer object containing the login credentials.
   * @returns Observable of the response from the ticket service.
   */
  @Post('login')
  login(@Body() loginAuthDto: LoginDto) 
  {
  
    return this.client.send('createAuthLogin', loginAuthDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all active authentication records.
   * @returns Observable of the active authentication records.
   */
  @Get('active')
  findAllActive() 
  {
    return this.client.send('findAllActiveAuth',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all inactive authentication records.
   * @returns Observable of the inactive authentication records.
   */
  @Get('inactive')
  findAllInactive() 
  {
    return this.client.send('findAllInactiveAuth',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }


  /**
   * Finds departments by the responsible name.
   * @param responsibleName - The name of the person responsible for the department.
   * @returns Observable of the department records associated with the responsible person.
   */
  @Get('responsible/:responsibleName')
  findDepartmentByResponsible(@Param('responsibleName') responsibleName: string) : Observable<any> {
    console.log('Get funciona en client res');
    return this.client.send('findDepartmentByResponsible', responsibleName).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all authentication records.
   * @returns Observable of all authentication records.
   */
  @Get()
  findAll() {
    
    return this.client.send('findAllAuth', {}).pipe(
      catchError(err => {
        console.log(err);
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        
      }),
    );
  }
  
   /**
   * Retrieves a single authentication record by ID.
   * @param id - The ID of the authentication record to retrieve.
   * @returns Observable of the authentication record.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('findOneAuth', id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Updates an existing authentication record.
   * @param updateAuthDto - Data transfer object containing the updated authentication details.
   * @returns Observable of the response from the ticket service.
   */
  @Patch(':id')
  update(@Body() updateAuthDto: UpdateAuthDto) {
    return this.client.send('updateAuth', updateAuthDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Deletes an authentication record by ID.
   * @param id - The ID of the authentication record to delete.
   * @returns Observable of the response from the ticket service.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send('removeAuth', id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
