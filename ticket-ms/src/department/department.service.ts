import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartamentoDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Between, DataSource, In, Repository } from 'typeorm';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';
import { RpcException } from '@nestjs/microservices';
import { DepartmentConfigurationService } from 'src/department-configuration/department-configuration.service';
import { DepartmentConfiguration } from 'src/department-configuration/entities/department-configuration.entity';
import { Room } from 'src/room/entities/sala.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';


/**
 * Service for managing departments in a city council.
 * Includes CRUD operations, data validation, and handling specific configurations.
 */
@Injectable()
export class DepartamentoService {

  /**
   * Initializes the `DepartamentoService` with the necessary repositories and services for managing departments,
   * department configurations, and city councils.
   * 
   * @param departamentoRepository - Repository to interact with department data.
   * @param configRepository - Repository to interact with department configuration data.
   * @param dataSource - Data source for database connections and transactions.
   * @param ayuntamientoRepository - Repository to interact with city council data.
   * @param departmentConfigService - Service for managing department configurations.
   */

  constructor(  
    @InjectRepository(Department)
    private departamentoRepository: Repository<Department>,
    @InjectRepository(Room)
    private salaRepository: Repository<Room>,
    @InjectRepository(DepartmentConfiguration)
    private configRepository: Repository<DepartmentConfiguration>,
  
    private readonly dataSource: DataSource,
    @InjectRepository(CityCouncil)
    private ayuntamientoRepository: Repository<CityCouncil>,
    private readonly departmentConfigService: DepartmentConfigurationService, // Inyectar el servicio
  ) {}


  /**
   * Gets the available appointments for a department on a specific date.
   * @param departmentId - The ID of the department.
   * @param date_appointment - The base date for the appointments.
   * @returns A list of available appointment times with the number of tickets and remaining intervals.
   */
  async getAppointmentsByDepartment(departmentId: string,date_appoinment:string) {
    // Obtener la configuración del departamento
    const config = await this.configRepository.findOne({
      where: { department: { departmentId } },
    });
  
    if (!config) {
      throw new RpcException({message:`No configuration found for department ${departmentId}`,status:HttpStatus.NOT_FOUND});
    }
    
    // Desestructurar los parámetros de configuración
    const { horaInicio, horaFinal, intervalo } = config;
    const startDate = new Date(date_appoinment); // Fecha base proporcionada
    startDate.setHours(horaInicio.getHours(), horaInicio.getMinutes(), 0, 0); // Asignar horas y minutos de horaInicio
  
    const endDate = new Date(date_appoinment); // Fecha base proporcionada
    endDate.setHours(horaFinal.getHours(), horaFinal.getMinutes(), 0, 0); // Asignar horas y minutos de horaFinal
   

    const query = `
      WITH RECURSIVE time_intervals AS (
        SELECT 
          ? AS start_time, 
          DATE_ADD(?, INTERVAL ? MINUTE) AS end_time,
          ? AS end_of_day
        UNION ALL
        SELECT
          DATE_ADD(start_time, INTERVAL ? MINUTE) AS start_time,
          DATE_ADD(end_time, INTERVAL ? MINUTE) AS end_time,
          end_of_day
        FROM time_intervals
        WHERE 
          DATE_ADD(start_time, INTERVAL ? MINUTE) < end_of_day
          AND DATE_ADD(end_time, INTERVAL ? MINUTE) <= end_of_day
      )
      SELECT 
        er.id AS id_empleado_sala,
        er.employeeDNI,
        ti.start_time,
        ti.end_time,
        COUNT(t.id_ticket) AS tickets_count,
        (SELECT COUNT(*) FROM time_intervals) AS total_intervals,
        (
          (SELECT COUNT(*) FROM time_intervals) 
          - COUNT(t.id_ticket) 
          - SUM(CASE WHEN thf.id IS NOT NULL THEN 1 ELSE 0 END)  -- Restar intervalos fuera
        ) AS remaining_intervals
      FROM time_intervals ti
      JOIN employee_room er
        ON ti.start_time >= er.startDate 
        AND ti.end_time <= er.endDate
      JOIN room r
        ON er.roomRoomId = r.roomId
        AND r.departmentDepartmentId = ?
      LEFT JOIN ticket t
        ON t.employeeDNI = er.employeeDNI
        AND t.appointment_date >= ti.start_time
        AND t.appointment_date < ti.end_time
      LEFT JOIN tecnico_horas_fuera thf
        ON er.employeeDNI = thf.employeeDNI
        AND ti.start_time >= thf.fechaInicioSalida  -- El intervalo comienza después de la salida del técnico
        AND ti.end_time <= thf.fechaFinSalida    -- El intervalo termina antes de la llegada del técnico
        AND thf.isActive = 1
      WHERE er.isActive = 1
        AND r.isActive = 1
        AND thf.id IS NULL  -- Excluir los intervalos donde el técnico está fuera
      GROUP BY er.id, er.employeeDNI, ti.start_time, ti.end_time
      ORDER BY er.id, ti.start_time;


        `;
  
  // Parámetros para la consulta
  return await this.dataSource.query(query, [
    startDate,    // Primer start_time
    startDate,    // Para calcular el primer end_time
    intervalo,     // Intervalo en minutos
    endDate,     // Límite del día (end_of_day)
    intervalo,     // Calcular el siguiente start_time
    intervalo,     // Calcular el siguiente end_time
    intervalo,     // Validación en la recursión
    intervalo,     // Validación del end_time en la recursión
    departmentId,  // Filtro en la tabla de salas
  ]);
  
  }
  
  

  
  /**
   * Creates a new department with the given data.
   * @param createDepartamentoDto - The DTO containing the department details.
   * @returns A success message indicating the department was created.
   * @throws RpcException - If the department already exists or there is a conflict.
   */
  async create(createDepartamentoDto: CreateDepartmentDto) {
    try {
      // Verificar si ya existe un registro con el mismo nombre
      const existingDepartamento = await this.departamentoRepository.findOne({
        where: {
          departmentName: createDepartamentoDto.departmentName,
          cityCouncil: { id: createDepartamentoDto.cityHallId },
        },
        relations: ['cityCouncil'],
      });
      
      if (existingDepartamento) {
        throw new RpcException({
          message: 'There is already a department with the same name in this town hall.',
          status: HttpStatus.CONFLICT,
        });
      }
      
      // Cargar el Ayuntamiento con el uso del ID proporcionado
      const ayuntamiento = await this.ayuntamientoRepository.findOne({
        where: { id: createDepartamentoDto.cityHallId },
      });

      if (!ayuntamiento) {
        throw new RpcException({
          message: 'The city council was not found.',
          status: HttpStatus.NOT_FOUND,
        });
      }

      // Crear la entidad Departamento y asignar el Ayuntamiento
      const departamentoEntity = this.departamentoRepository.create({
        ...createDepartamentoDto,
        cityCouncil: ayuntamiento,
      });

      const departamentoCreado = await this.departamentoRepository.save(departamentoEntity);

      // Crear configuración por defecto
      await this.departmentConfigService.create({
        horaInicio: new Date('2025-01-01T09:00:00'), // 9:00 AM del 1 de enero de 2024
        horaFinal: new Date('2025-01-01T14:00:00'), // 2:00 PM del 1 de enero de 2024
        intervalo: 30,
        departmentId: departamentoCreado.departmentId, 
      });
      

      return {message:"Department created successfully"};
    } catch (error) {
      throw new RpcException({
        message: `Unexpected error creating record: ${error.message}.`,
        status: HttpStatus.CONFLICT,
      });
    }
  }




  /**
   * Retrieves all departments.
   * @returns A list of all departments with their associated city council.
   */
  async findAll() 
  {
   return this.departamentoRepository.find({relations: ['cityCouncil']});
  }


  /**
   * Retrieves all active departments.
   * @returns A list of active departments with their associated city council.
   */
  async findAllActive() 
  {
    return this.departamentoRepository.find({
      where: { isActive: true }, 
      relations: ['cityCouncil'], 
    });
  }

  /**
   * Retrieves all inactive departments.
   * @returns A list of inactive departments with their associated city council.
   */
  async findAllInactive()
  {
    return this.departamentoRepository.find({
      where: { isActive: false }, 
      relations: ['cityCouncil'], 
    });
  }


  /**
   * Retrieves a department by its ID.
   * @param departmentId - The ID of the department.
   * @returns The department with its associated city council.
   * @throws RpcException - If the department is not found.
   */
  async findOne(departamentId: string) 
  {
    const departamento = await this.departamentoRepository.findOne({ where: { departmentId:departamentId } ,relations: ['cityCouncil']});
    if(!departamento)
    {
      throw new RpcException({message:`Department "${departamentId}" not found.`,status:HttpStatus.NOT_FOUND});
    }
    return departamento;
  }


  /**
   * Updates the department with the provided ID using the given data.
   * @param departmentId - The ID of the department to update.
   * @param updateDepartamentoDto - The DTO containing the updated department details.
   * @returns A success message indicating the department was updated.
   * @throws RpcException - If the department is not found.
   */
  async update(departmentId: string, updateDepartamentoDto: UpdateDepartamentoDto) {
    // Buscar el departamento con preload
    const departamento = await this.departamentoRepository.preload({
      departmentId: departmentId, 
      ...updateDepartamentoDto,
    });
  
    if (!departamento) {
      throw new RpcException({
        message: `Department "${departmentId}" not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    }
  
    // Guardar los cambios del departamento
    await this.departamentoRepository.save(departamento);
  
    // Verificar si el estado del departamento cambió (isActive)
    if (updateDepartamentoDto.isActive !== undefined) {
      // Actualizar el estado de todas las salas asociadas
      await this.salaRepository.update(
        { department: { departmentId } }, // Condición: salas asociadas al departamento
        { isActive: updateDepartamentoDto.isActive } // Nuevo estado
      );
    }
  
    return { message: 'The registry has been updated successfully.' };
  }
  

  /**
   * Deactivates a department by its ID.
   * @param idDepartment - The ID of the department to deactivate.
   * @returns A success message indicating the department was deactivated.
   * @throws RpcException - If the department is already deactivated.
   */
  async remove(idDepartment: string) 
  {
    const department = await this.findOne(idDepartment);
   
    if(department.isActive == false )
    {
      throw new RpcException({message:`The department is already deactivated`,statusCode: HttpStatus.CONFLICT});
    } 
    else 
    {
      department.isActive = false; 
      await this.departamentoRepository.save(department); 
     
    } 
  
    return "Department deactivated successfully."; 
  }
}
