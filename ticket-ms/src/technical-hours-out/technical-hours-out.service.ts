import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTechnicalHoursOutDto } from './dto/create-technical-hours-out.dto';
import { UpdateTechnicalHoursOutDto } from './dto/update-technical-hours-out.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnicalHoursOut } from './entities/technical-hours-out.entity';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Employee } from 'src/auth/entities/auth.entity';
import { RpcException } from '@nestjs/microservices';

/**
 * Service for managing technical hours records for employees.
 * Includes methods to create, update, find, and validate employee hours out records.
 * 
 * Key methods:
 * - `create(createTechnicalHoursOutDto: CreateTechnicalHoursOutDto)`: Creates a new technical hours record for an employee.
 * - `findAll()`: Fetches all technical hours out records.
 * - `findOne(id: string)`: Fetches a technical hours out record by its ID.
 * - `update(id: string, updateTechnicalHoursOutDto: UpdateTechnicalHoursOutDto)`: Updates an existing technical hours out record.
 * - `validateDates(fechaInicio: Date, fechaFin: Date)`: Validates the start and end dates for correctness.
 * - `validateEmployeeDni(employeeDni: string)`: Ensures that a valid employee DNI is provided.
 */
@Injectable()
export class TechnicalHoursOutService 
{
  /**
   * Constructor to inject necessary repositories for managing technical hours records and employees.
   * 
   * @param technicalHoursOutRepository Repository for handling technical hours records.
   * @param employeeRepository Repository for managing employee data.
   */
  constructor(
    @InjectRepository(TechnicalHoursOut)
    private readonly technicalHoursOutRepository: Repository<TechnicalHoursOut>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  
  ) {}


  /**
   * Validates that the start and end dates are correct.
   * - The start date should not be after the end date.
   * - Dates should not be in the past.
   * 
   * @param fechaInicio The start date of the technical hours record.
   * @param fechaFin The end date of the technical hours record.
   * @throws RpcException if the dates are invalid.
   */
  private validateDates(fechaInicio: Date, fechaFin: Date) {
    if (fechaInicio > fechaFin) {
      throw new RpcException({message:'The start date cannot be greater than the end date.',status:HttpStatus.CONFLICT});
    }
    const now = new Date();
    if (fechaInicio < now || fechaFin < now) {
      throw new RpcException({message:'Dates cannot be in the past.',status:HttpStatus.CONFLICT});
    }
  }

  /**
   * Validates that the employee DNI is provided and not empty.
   * 
   * @param employeeDni The DNI of the employee.
   * @throws RpcException if the employee DNI is invalid.
   */
  private validateEmployeeDni(employeeDni: string) {
    if (!employeeDni || employeeDni.trim().length === 0) {
      throw new RpcException({message:'It is required to select an employee',status:HttpStatus.CONFLICT});
    }
    // Aquí se pueden añadir validaciones adicionales si es necesario, por ejemplo, si el DNI debe tener un formato específico.
  }


  /**
   * Creates a new technical hours out record for an employee.
   * - Validates the start and end dates.
   * - Verifies if the employee exists.
   * - Checks for overlapping records.
   * 
   * @param createTechnicalHoursOutDto The DTO containing the details of the technical hours out record.
   * @returns The created record or throws an exception if there is a conflict.
   * @throws RpcException if any validation fails or if the record overlaps with existing records.
   */
  async create(createTechnicalHoursOutDto: CreateTechnicalHoursOutDto) {
    const { fechaInicioSalida, fechaFinSalida, employeeDni, motivo } = createTechnicalHoursOutDto;
  
    // Validar las fechas
    this.validateDates(fechaInicioSalida, fechaFinSalida);
  
    // Buscar al empleado
    const empleado = await this.employeeRepository.findOne({ where: { DNI: employeeDni } });
    if (!empleado) {
      throw new RpcException({message:`An employee with the ID was not found: ${employeeDni}`,status:HttpStatus.CONFLICT});
    }
  
    // Verificar solapamiento de fechas con more y less
    const overlappingRecords = await this.technicalHoursOutRepository.find({
      where: [
        { 
          employee: { DNI: empleado.DNI }, 
          fechaInicioSalida: LessThanOrEqual(fechaFinSalida), 
          fechaFinSalida: MoreThanOrEqual(fechaInicioSalida) 
        },
      ],
    });
  
    if (overlappingRecords.length > 0) {
      throw new RpcException({message:'The time entry matches an existing period for this employee.',status: HttpStatus.CONFLICT,});
    }
  
    // Crear el nuevo registro
    const newRecord = this.technicalHoursOutRepository.create({
      employee: empleado,
      fechaInicioSalida,
      fechaFinSalida,
      motivo,
    });
  
    // Guardar el nuevo registro
    return await this.technicalHoursOutRepository.save(newRecord);
  }
  
  
  
  
  /**
   * Retrieves all technical hours out records along with employee and department information.
   * 
   * @returns A list of all technical hours out records.
   */
  async findAll() {
    return await this.technicalHoursOutRepository.find({ relations: ['employee','employee.department'] });
  }

  /**
   * Retrieves a technical hours out record by its ID.
   * 
   * @param id The ID of the technical hours out record.
   * @returns The technical hours out record.
   * @throws RpcException if the record is not found.
   */
  async findOne(id: string) {
    const record = await this.technicalHoursOutRepository.findOne({ where: { id }, relations: ['employee'] });
    if (!record) {
      throw new RpcException({message:`Technician not found.`,status:HttpStatus.NOT_FOUND});
    }
    return record;
  }

  /**
   * Updates an existing technical hours out record.
   * - Validates the dates if they are provided.
   * - Validates the employee DNI if it is provided.
   * - Checks for overlapping records before updating.
   * 
   * @param id The ID of the technical hours out record to update.
   * @param updateTechnicalHoursOutDto The DTO containing the updated information.
   * @returns A success message or throws an exception if the update fails.
   * @throws RpcException if any validation fails or the record is not found.
   */
  async update(id: string, updateTechnicalHoursOutDto: UpdateTechnicalHoursOutDto) {
    const { fechaInicioSalida, fechaFinSalida, employeeDni } = updateTechnicalHoursOutDto;

    // Validar las fechas si se proporcionan
    if (fechaInicioSalida > fechaFinSalida) {
      throw new RpcException({message:'The start date cannot be greater than the end date.',status:HttpStatus.CONFLICT});
    }

    // Validar el DNI del empleado si se proporciona
    if (employeeDni) {
      this.validateEmployeeDni(employeeDni);
    }
    const empleado = await this.employeeRepository.findOne({ where: { DNI: employeeDni } });
    if (!empleado) {
      throw new RpcException({message:`An employee with the DNI ${employeeDni} was not found`,status:HttpStatus.NOT_FOUND});
    }
    const overlappingRecords = await this.technicalHoursOutRepository.find({
      where: [
        { 
          employee: { DNI: empleado.DNI }, 
          fechaInicioSalida: LessThanOrEqual(fechaFinSalida), 
          fechaFinSalida: MoreThanOrEqual(fechaInicioSalida),
          id: Not(id) 
        },
      ],
    });
  
    if (overlappingRecords.length > 0) {
      throw new RpcException({message:'The time entry matches an existing period for this employee.',status: HttpStatus.CONFLICT,});
    }
  

    const record = await this.technicalHoursOutRepository.preload({
      id,
      employee:empleado,
      ...updateTechnicalHoursOutDto,
    });
    if (!record) {
      throw new RpcException({message:`Technician not found.`,status:HttpStatus.NOT_FOUND});
    }
    await this.technicalHoursOutRepository.save(record);
    return {message:"Registry updated successfully"};
  }

  
}
