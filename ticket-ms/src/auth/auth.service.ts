import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Department } from 'src/department/entities/department.entity';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; 

/**
 * Service for managing authentication and user-related operations.
 * Includes interactions with Employee, Department, and CityCouncil data,
 * as well as handling authentication logic.
 */
@Injectable()
export class AuthService 
{
  private readonly logger = new Logger(AuthService.name);

  /**
   * Constructor for the authentication service.
   *
   * @param authRepository Repository for employee CRUD operations.
   * @param departmentRepository Repository for department operations.
   * @param cityCouncilRepository Repository for city council operations.
   */
  constructor(
    @InjectRepository(Employee) 
    private authRepository: Repository<Employee>,
    @InjectRepository(Department) 
    private departmentRepository: Repository<Department>,
    @InjectRepository(CityCouncil) 
    private ayuntamientoRepository: Repository<CityCouncil>,
    private jwtService: JwtService,
    private readonly configService: ConfigService 
  ) {}

  /**
   * Método ejecutado automáticamente cuando el módulo se inicializa.
   * Inserta un super-administrador predeterminado en la base de datos si no existe.
   */
  async onModuleInit() 
  {
    await this.insertSuperAdminIfNotExists();
  }


  /**
   * Genera una contraseña aleatoria que cumple con los requisitos de seguridad.
   *
   * @param length Longitud deseada para la contraseña. Debe ser al menos 6 caracteres.
   * @returns Una contraseña aleatoria que incluye al menos una letra y un número.
   * @throws Error si la longitud proporcionada es menor a 6.
   */
  private generateRandomPassword(length: number): string 
  {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  
    if (length < 6) {
      throw new RpcException({message:'The minimum password length must be at least 6 characters.',status:HttpStatus.CONFLICT});
    }
  
    let password = '';
  
    while (!passwordRegex.test(password)) {
      let tempPassword = '';
      const randomBuffer = randomBytes(length);
  
      for (let i = 0; i < length; i++) {
        tempPassword += charset[randomBuffer[i] % charset.length];
      }
  
      if (passwordRegex.test(tempPassword)) {
        password = tempPassword;
      }
    }
  
    return password;
  }

  /**
   * Inserta un super-administrador en la base de datos si no existe.
   * Genera una contraseña segura aleatoria y crea el super-administrador.
   * Registra mensajes de log para indicar el éxito o advertir si ya existe.
   */
  private async insertSuperAdminIfNotExists() 
  {
    // Comprobar si existe un super-admin en la base de datos
    const superAdminExists = await this.authRepository.findOne({
      where: { rol: 'super-admin' },
    });

    // Si no existe, crear uno nuevo
    if (!superAdminExists) {
      const superAdminDto: CreateSuperAdminDto = {
        DNI: '12345678A',  // Cambia por el DNI adecuado
        rol: 'super-admin',
        password: this.generateRandomPassword(10), // Usa una contraseña segura
        name: 'Super Admin',
        isActive: true,
      };

     
      // Crear el super-admin
      await this.createSuperAdmin(superAdminDto);
      
      this.logger.log('Super Admin created successfully');
      this.logger.log('Password super-admin: ',superAdminDto.password)

    } else {
     this.logger.warn('The Super Admin already exists');
    }
  }


/**
 * Updates the password of an existing employee.
 *
 * @param DNI The DNI of the employee whose password needs to be updated.
 * @param newPassword The new password provided by the user.
 * @returns A message indicating the password was updated successfully.
 */
async updatePasswordSuperAdmin( password: any) 
{
  const empleado = await this.authRepository.findOne({ where: { rol: 'super-admin' } });

  if (!empleado) {
    throw new RpcException({
      message: `Employee not found.`,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
  const newPassword=password.password;
  // Validación de longitud y contenido de la contraseña
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword);
  if (!isValidPassword) {
    throw new RpcException({
      message: 'The new password must be at least 6 characters and include letters and numbers.',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  // Si la contraseña es válida, encripta la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  empleado.password = hashedPassword;

  // Guardar el empleado con la nueva contraseña
  await this.authRepository.save(empleado);

  return { message: 'The password has been updated successfully.' };
}


  /**
   * Creates a new employee in the database.
   *
   * @param createAuthDto DTO containing new employee data.
   * @returns A success message indicating the employee was created.
   */
  async create(createAuthDto: CreateAuthDto) 
  {
    try {
      const existingAuth = await this.authRepository.findOne({
        where: { DNI: createAuthDto.DNI },
      });
  
      if (existingAuth) {
        throw new RpcException({
          message: 'Records with same DNI already exist.',
          statusCode: HttpStatus.CONFLICT,
        });
      }
  
      const ayuntamiento = await this.ayuntamientoRepository.findOne({
        where: { id: createAuthDto.cityCouncilId },
      });
  
      if (!ayuntamiento) {
        throw new RpcException({
          message: 'The specified town hall does not exist.',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
  

         // Validar el departamento
    const departamento = await this.departmentRepository.findOne({
      where: { departmentId: createAuthDto.department_id },
    });

    if (!departamento) {
      throw new RpcException({
        message: 'The specified department does not exist.',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    // Si el departamento es "Administrador", verifica el rol del usuario
    if (departamento.isAdmin && createAuthDto.rol !== 'admin') {
          throw new RpcException({
            message: 'Only users with the "admin" role can be assigned to the Administrators department',
            statusCode: HttpStatus.BAD_REQUEST,
          });
    }

    if(createAuthDto.rol==='admin' && !departamento.isAdmin){
        throw new RpcException({
          message: 'Users with the "admin" role can only be assigned to the Administrators department.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    }
     // Validar la contraseña
     const password = createAuthDto.password;
     const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
     if (!isValidPassword) {
       throw new RpcException({
         message: 'The password must be at least 6 characters and include letters and numbers.',
         statusCode: HttpStatus.BAD_REQUEST,
       });
     }
 
     // Cifrar la contraseña antes de guardarla
     const hashedPassword = await bcrypt.hash(password, 10);


    
     if(createAuthDto.rol==='responsable'||createAuthDto.rol==='admin')
     {
      departamento.responsible=createAuthDto.name;
      this.departmentRepository.save(departamento);
     }
     
     



     
     // Crear la entidad de autenticación con la contraseña cifrada
     const authEntity = this.authRepository.create({
       ...createAuthDto,
       password: hashedPassword,
       cityCouncil: ayuntamiento,
       department: departamento, // Asocia el departamento
     });
     await this.authRepository.save(authEntity);
     return {message: "Successfully created employee."}
 
   
 

  
     
    } catch (error) {
      throw new RpcException({
        message: `Unexpected error creating record: ${error.message}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }


 /**
   * Creates a new super admin in the database.
   *
   * @param createSuperAdminDto DTO containing new super admin data.
   * @returns A success message indicating the admin was created.
   */
  async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto) 
  {
    try {
      const existingAuth = await this.authRepository.findOne({
        where: { DNI: createSuperAdminDto.DNI },
      });
  
      if (existingAuth) {
        throw new RpcException({
          message: 'The registration with the same ID already exists.',
          statusCode: HttpStatus.CONFLICT,
        });
      }
  
     
     // Validar la contraseña
     const password = createSuperAdminDto.password;
     const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
     if (!isValidPassword) {
       throw new RpcException({
         message: 'The password must be at least 6 characters and include letters and numbers.',
         statusCode: HttpStatus.BAD_REQUEST,
       });
     }
 
     // Cifrar la contraseña antes de guardarla
     const hashedPassword = await bcrypt.hash(password, 10);
     
     // Crear la entidad de autenticación con la contraseña cifrada
     const authEntity = this.authRepository.create({
       ...createSuperAdminDto,
       password: hashedPassword,
      
     });
     await this.authRepository.save(authEntity);
     return {message: "Administrator created successfully."}
 
   
 

  
     
    } catch (error) {
      throw new RpcException({
        message: `Unexpected error creating record: ${error.message}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  

  /**
   * Authenticates an employee by login credentials.
   *
   * @param loginDto DTO containing the employee's login credentials.
   * @returns The authenticated employee's data, including relations.
   */
  async login(loginDto: LoginDto) 
  {
    try {
      // Buscar usuario por DNI
      const authEntity = await this.authRepository.findOne({
        where: { DNI: loginDto.dni },
        relations: ['cityCouncil','department'],
      });

      // Verificar si el usuario existe
      if (!authEntity) {
        throw new RpcException({
          message: 'User with this DNI does not exist.',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      // Comparar la contraseña ingresada con la almacenada
      const isPasswordValid = await bcrypt.compare(loginDto.password, authEntity.password);
      
      if (!isPasswordValid || authEntity.isActive === false) {
        throw new RpcException({
          message: !isPasswordValid
            ? 'Invalid password.'
            : 'User is inactive. Please contact support.',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
       // Crear el payload para el token JWT
       const payload = {
        sub: authEntity.DNI, // Identificador único del usuario
        role: authEntity.rol, // Rol del usuario
     
      };
      const secret =process.env.JWT_SECRET ;
      // Generar el token JWT
      const access_token = this.jwtService.sign(payload,{ secret:secret });
     
      // Si la autenticación es exitosa, puedes devolver un token o cualquier otro dato relevante
      return {
        access_token,
        message: 'Login successful',
        employee: {
          ...authEntity,  // Toda la información del usuario
          cityCouncil: authEntity.cityCouncil, // Aquí se incluye la relación con CityCouncil
          department: authEntity.department
        },
      };
    } catch (error) {
      throw new RpcException({
        message: `Unexpected error during login: ${error.message}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

   /**
   * Retrieves a department by the name of its responsible person.
   *
   * @param responsibleName Name of the department's responsible person.
   * @returns The department associated with the given name, or null if not found.
   */
  async getDepartmentByResponsibleName(responsibleName: string)
  {
    // Buscamos el departamento donde el responsable sea el nombre pasado como parámetro
    const department = await this.departmentRepository.findOne({
      where: { responsible: responsibleName },
    });

    return department;
  }

  /**
   * Retrieves all employees.
   *
   * @returns A list of employees including their relations.
   */
  findAll() 
  {
    return this.authRepository.find({relations: ['cityCouncil','department']});
  }
   

  /**
   * Retrieves all active employees.
   *
   * @returns A list of active employees including their relations.
   */
  async findAllActive() 
  {
    return this.authRepository.find({
      where: { isActive: true },  
      relations: ['cityCouncil','department'], 
    });
  }

  
  /**
   * Retrieves all inactive employees.
   *
   * @returns A list of inactive employees including their relations.
   */
  async findAllInactive()
  {
    return this.authRepository.find({
      where: { isActive: false },  
      relations: ['cityCouncil','department'],
    });
  }



   /**
   * Finds an employee by their DNI.
   *
   * @param DNI The DNI of the employee to search for.
   * @returns The found employee or throws an exception if not found.
   */
  async findOne(DNI: string) 
  {
    const empleado= await this.authRepository.findOne({ where: { DNI: DNI },relations: ['cityCouncil'] });
    if(!empleado)
    {
      throw new RpcException({message:`Employee with DNI ${DNI} not found.`,statusCode: HttpStatus.NOT_FOUND,});
    }

    return  empleado;
  }


  /**
   * Updates an existing employee.
   *
   * @param DNI The DNI of the employee to update.
   * @param updateAuthDto DTO containing the updated data.
   * @returns A message indicating the record was updated successfully.
   */
  async update(DNI: string, updateAuthDto: UpdateAuthDto) {
    const empleado = await this.authRepository.preload({
      DNI: DNI, // Busca por DNI en lugar de id
      ...updateAuthDto,
    });
  
    if (!empleado) {
      throw new RpcException({
        message: `Employee with DNI ${DNI} not found.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  
    // Validar el departamento si se proporciona
    if (updateAuthDto.department_id) {
      const departamento = await this.departmentRepository.findOne({
        where: { departmentId: updateAuthDto.department_id },
      });
  
      if (!departamento) {
        throw new RpcException({
          message: 'The specified department does not exist.',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (departamento.isAdmin && empleado.rol !== 'admin') {
        throw new RpcException({
          message: 'Only users with the "admin" role can be assigned to the Administrators department.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if(empleado.rol==='admin' && !departamento.isAdmin){
          throw new RpcException({
            message: 'Users with the "admin" role can only be assigned to the Administrators department.',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }

      empleado.department = departamento; // Asocia el nuevo departamento
    }
  
    // Verifica si se proporcionó una nueva contraseña en updateAuthDto
    if (updateAuthDto.password) {
      const password = updateAuthDto.password;
  
      // Validación de longitud y contenido de la contraseña
      const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
      if (!isValidPassword) {
        throw new RpcException({
          message: 'The new password must be at least 6 characters and include letters and numbers.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
  
      // Si la contraseña es válida, encripta
      const hashedPassword = await bcrypt.hash(password, 10);
      empleado.password = hashedPassword;
    }
  
    // Guardar el empleado actualizado
    await this.authRepository.save(empleado);
  
    return { message: 'The registry has been updated successfully.' };
  }
  
  /**
   * Deactivates an employee by their DNI.
   *
   * @param DNI The DNI of the employee to deactivate.
   * @returns A message indicating the employee was deactivated.
   */
  async remove(DNI: string) 
  {
    const employee = await this.findOne(DNI);
 
    if(employee.isActive == false )
    {
     throw new RpcException({message:`The employee is already deactivated`,statusCode: HttpStatus.CONFLICT});
    } 
    else
    {
      employee.isActive = false; 
      await this.authRepository.save(employee); 
     
    } 
  
    return {message:"Employee deactivated successfully."}; 
  }

  
}
