import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';

@Controller()
export class AuthController 
{
  /**
   * Constructor for the AuthController class.
   * Injects the AuthService dependency.
   * @param authService - The service that handles business logic for authentication.
   */
  constructor(private readonly authService: AuthService) {}


  /**
   * Handles the 'createAuth' message pattern to create a new authentication record.
   * @param createAuthDto - Data Transfer Object containing the details of the new authentication record.
   * @returns The result of the creation process from the AuthService.
   */
  @MessagePattern('createAuth')
  create(@Payload() createAuthDto: CreateAuthDto) 
  {
    
    return this.authService.create(createAuthDto);
  }

  /**
   * Handles the 'super-admin' message pattern to create a new super admin user.
   * @param createSuperAdminDto - DTO containing the details for the super admin user.
   * @returns The result of the super admin creation process from the AuthService.
   */
  @MessagePattern('super-admin')
  async createSuperAdmin(@Body() createSuperAdminDto: CreateSuperAdminDto) 
  {
    return this.authService.createSuperAdmin(createSuperAdminDto);
  }

  /**
   * Handles the 'createAuthLogin' message pattern for user login.
   * @param loginDto - DTO containing login credentials.
   * @returns The result of the login process, including a token if successful.
   */
  @MessagePattern('createAuthLogin')
  login(@Payload() loginDto: LoginDto) 
  {
    
    return this.authService.login(loginDto);
  }

   /**
   * Handles the 'updatePasswordSuperAdmin' message pattern to update the password of a super-admin.
   * @param newPassword - The new password provided by the user.
   * @returns A success message upon successful password update.
   */
   @MessagePattern('updatePasswordSuperAdmin')
   async updatePasswordSuperAdmin(@Payload() password: string) {
     return this.authService.updatePasswordSuperAdmin(password);
   }

  /**
   * Handles the 'findDepartmentByResponsible' message pattern to find a department by its responsible person's name.
   * @param responsibleName - The name of the department's responsible person.
   * @returns The department associated with the responsible person.
   */
  @MessagePattern('findDepartmentByResponsible')
  getDepartmentByResponsibleName(responsibleName:string) 
  {
   
    return this.authService.getDepartmentByResponsibleName(responsibleName);
  }
   /**
   * Handles the 'findAllAuth' message pattern to fetch all authentication records.
   * @returns A list of all authentication records.
   */
  @MessagePattern('findAllAuth')
  findAll() 
  {
   
    return this.authService.findAll();
  }
    /**
   * Handles the 'findAllActiveAuth' message pattern to fetch all active authentication records.
   * @returns A list of active authentication records.
   */
  @MessagePattern('findAllActiveAuth')
  async findAllActive() 
  {
    return await this.authService.findAllActive();
  }
  /**
   * Handles the 'findAllInactiveAuth' message pattern to fetch all inactive authentication records.
   * @returns A list of inactive authentication records.
   */
  @MessagePattern('findAllInactiveAuth')
  findAllInactive() 
  {
    
    return this.authService.findAllInactive();
  }
    /**
   * Handles the 'findOneAuth' message pattern to fetch a specific authentication record by DNI.
   * @param dni - The unique identifier of the authentication record.
   * @returns The authentication record matching the provided DNI.
   */
  @MessagePattern('findOneAuth')
  findOne(@Payload() dni: string) 
  {
    return this.authService.findOne(dni);
  }


   /**
   * Handles the 'updateAuth' message pattern to update an existing authentication record.
   * @param updateAuthDto - DTO containing updated authentication details.
   * @returns The updated authentication record.
   */
  @MessagePattern('updateAuth')
  update(@Payload() updateAuthDto: UpdateAuthDto) 
  {
    return this.authService.update(updateAuthDto.DNI, updateAuthDto);
  }

   /**
   * Handles the 'removeAuth' message pattern to desactivated an authentication record by DNI.
   * @param dni - The unique identifier of the authentication record to be desactivated.
   * @returns The result of the removal process.
   */
  @MessagePattern('removeAuth')
  remove(@Payload() dni: string) 
  {
    return this.authService.remove(dni);
  }
}
