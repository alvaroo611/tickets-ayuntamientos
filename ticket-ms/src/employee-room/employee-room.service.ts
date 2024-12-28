import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeRoomDto  } from './dto/create-employee-room.dto';
import { UpdateEmployeeRoomDto } from './dto/update-employee-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRoom } from './entities/employee-room.entity';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';

import { Employee } from 'src/auth/entities/auth.entity';
import { log } from 'console';
import { Room } from 'src/room/entities/sala.entity';
import { RpcException } from '@nestjs/microservices';

/**
 * EmpleadoSalaService is responsible for managing employee-room assignments.
 * It provides the following functionalities:
 * 1. Create a new assignment, ensuring no date overlaps.
 * 2. Retrieve all active and inactive assignments.
 * 3. Retrieve a specific assignment by its ID.
 * 4. Update an existing assignment, checking for date overlaps and existence of employee and room.
 * 5. Deactivate an assignment by marking it as inactive.
 * 
 * It uses TypeORM repositories to interact with the `EmployeeRoom`, `Room`, and `Employee` entities in the database.
 */
@Injectable()
export class EmpleadoSalaService {
  /**
   * Constructor for injecting repositories.
   * 
   * @param empleadoSalaRepository The repository for managing employee-room assignments.
   * @param salaRepository The repository for managing rooms.
   * @param empleadoRepository The repository for managing employees.
   */
  constructor(
    @InjectRepository(EmployeeRoom) 
    private empleadoSalaRepository: Repository<EmployeeRoom>,
    @InjectRepository(Room) 
    private salaRepository: Repository<Room>,
    @InjectRepository(Employee) 
    private empleadoRepository: Repository<Employee>,
  ) {}
  /**
   * Creates a new employee-room assignment.
   * Checks for existing employee and room, validates date ranges, and ensures no date overlaps.
   *
   * @param createEmpleadoSalaDto The DTO for creating the employee-room assignment.
   * @returns Success message or throws RpcException on failure.
   */
  async create(createEmpleadoSalaDto: CreateEmployeeRoomDto) {
    try {
       // Verificar que la fecha de inicio no esté en el pasado
    if (new Date(createEmpleadoSalaDto.startDate) < new Date()) {
      throw new RpcException({
        message: 'The start date cannot be in the past.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
      // Verificar que el empleado existe
      const empleado = await this.empleadoRepository.findOne({
        where: { DNI: createEmpleadoSalaDto.employeeDNI },
      });
      if (!empleado) {
        throw new RpcException({ message: 'The employee was not found.', status: HttpStatus.NOT_FOUND });
      }
  
      // Verificar que la sala existe
      const sala = await this.salaRepository.findOne({
        where: { roomId: createEmpleadoSalaDto.roomId },
      });
  
      if (!sala) {
        throw new RpcException({ message: 'The room was not found.', status: HttpStatus.NOT_FOUND });
      }
  
      // Verificar que endDate no sea antes de startDate
      if (new Date(createEmpleadoSalaDto.startDate) > new Date(createEmpleadoSalaDto.endDate)) {
        throw new RpcException({ message: 'The end date cannot be earlier than the start date.', status: HttpStatus.BAD_REQUEST });
      }
  
      // Verificar si ya existe un registro con solapamiento de fechas para este empleado
      const overlappingEmpleadoSala = await this.empleadoSalaRepository.findOne({
        where: {
          employee: empleado,
          // Verificamos si el nuevo intervalo de fechas se solapa con algún registro existente
          startDate: LessThanOrEqual(createEmpleadoSalaDto.endDate),
          endDate: MoreThanOrEqual(createEmpleadoSalaDto.startDate),
        },
        relations: ['employee'],
      });
  
      if (overlappingEmpleadoSala) {
        throw new RpcException({ message: 'The employee already has an overlapping assignment in the specified date range.', status: HttpStatus.CONFLICT });
      }
  
      // Crear la entidad EmpleadoSala y asignar los ids
      const empleadoSalaEntity = this.empleadoSalaRepository.create({
        ...createEmpleadoSalaDto,
        room: sala,
        employee: empleado,
      });
      await this.empleadoSalaRepository.save(empleadoSalaEntity);
      // Guardar el nuevo registro en la base de datos
      return {message:'Empleado asignado correctamente a la sala'}
  
    } catch (error) {
      throw new RpcException({
        message: `Unexpected error creating record: ${error.message}.`,
        status: HttpStatus.CONFLICT,
      });
    }
  }
  
  /**
   * Retrieves all employee-room assignments.
   * 
   * @returns List of all employee-room assignments with related room and employee information.
   */
  findAll() 
  {
    return this.empleadoSalaRepository.find({
      relations: ['room', 'room.department','employee'],
    });
  }

  /**
   * Retrieves all active employee-room assignments.
   * 
   * @returns List of active employee-room assignments.
   */
  async findAllActive() {
    return this.empleadoSalaRepository.find({
      where: { isActive: true }, 
      relations:  ['room', 'employee'], 
    });
  }

  /**
   * Retrieves all inactive employee-room assignments.
   * 
   * @returns List of inactive employee-room assignments.
   */
  async findAllInactive(){
    return this.empleadoSalaRepository.find({
      where: { isActive: false }, 
      relations:  ['room', 'employee'], 
    });
  }

   /**
   * Retrieves a specific employee-room assignment by ID.
   * 
   * @param id The ID of the employee-room assignment.
   * @returns The employee-room assignment or throws RpcException if not found.
   */
  async findOne(id: string) {
    const empleadoSala = await this.empleadoSalaRepository.findOne({ where: { id }, relations: ['room', 'employee'] });
    if(!empleadoSala)
    {
      throw new RpcException({message:`Employee not found in room.`,status:HttpStatus.NOT_FOUND});
    }
    return empleadoSala;
  }

  /**
   * Updates an existing employee-room assignment.
   * Validates if the room and employee exist, checks for date overlaps, and updates the assignment.
   *
   * @param id The ID of the assignment to update.
   * @param updateEmpleadoSalaDto The DTO with updated information.
   * @returns Success message or throws RpcException on failure.
   */
  async update(id: string, updateEmpleadoSalaDto: UpdateEmployeeRoomDto) {
    console.log({ dto: updateEmpleadoSalaDto });
  
    // Primero, asegúrate de que el roomId sea una instancia de la entidad Room
    const room = await this.salaRepository.findOne({
      where: { roomId: updateEmpleadoSalaDto.roomId },
    });
   
    if (!room) {
      throw new RpcException({
        message: `Room with ID ${updateEmpleadoSalaDto.roomId} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    const employee=await this.empleadoRepository.findOne({
      where:{DNI:updateEmpleadoSalaDto.employeeDNI}
    });
    if (!employee) {
      throw new RpcException({
        message: `Employee with dni ${updateEmpleadoSalaDto.employeeDNI} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    // Pre-cargar la entidad EmployeeRoom y asociar la sala
    const empleadoSala = await this.empleadoSalaRepository.preload({
      id, 
      room, 
      employee,
      ...updateEmpleadoSalaDto,
    });
  
    if (!empleadoSala) {
      throw new RpcException({
        message: `Employee not found in room.`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    const overlappingEmpleadoSala = await this.empleadoSalaRepository.findOne({
      where: {
        employee: empleadoSala.employee, // Empleado que estamos actualizando
        id: Not(id), // Excluir el registro actual
        startDate: LessThanOrEqual(updateEmpleadoSalaDto.endDate),
        endDate: MoreThanOrEqual(updateEmpleadoSalaDto.startDate),
      },
      relations: ['employee'],
    });
  
    if (overlappingEmpleadoSala) {
      throw new RpcException({
        message: 'The employee already has an overlapping assignment in the specified date range.',
        status: HttpStatus.CONFLICT,
      });
    }
    // Guarda la entidad actualizada
    await this.empleadoSalaRepository.save(empleadoSala);
  
    console.log({ data: empleadoSala });
  
    return { message: 'The registry has been updated successfully', data: empleadoSala };
  }
  
  /**
   * Deactivates an employee-room assignment by setting its isActive property to false.
   * 
   * @param id The ID of the employee-room assignment to deactivate.
   * @returns Success message or throws RpcException if already deactivated.
   */
  async remove(id: string) {
    const employeeRoom = await this.findOne(id);
    if(employeeRoom.isActive == false )
    {
      throw new RpcException({message:`The employee room is already deactivated`,statusCode: HttpStatus.CONFLICT});
    } 
    else 
    {
      employeeRoom.isActive = false; 
      await this.empleadoSalaRepository.save(employeeRoom); 
      
    }
  
    return "Employee room deactivated successfully."; 
  }
}
