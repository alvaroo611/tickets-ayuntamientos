  import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CreateDepartmentConfigurationDto } from './dto/create-department-configuration.dto';
  import { UpdateDepartmentConfigurationDto } from './dto/update-department-configuration.dto';
  import { DepartmentConfiguration } from './entities/department-configuration.entity';
  import { Department } from 'src/department/entities/department.entity';
import { RpcException } from '@nestjs/microservices';

  /**
   * Service for managing department configurations.
   * This service provides methods to create, update, retrieve, and delete department configuration records.
   */
  @Injectable()
  export class DepartmentConfigurationService 
  {

    /**
     * Constructor for DepartmentConfigurationService.
     * 
     * @param departmentConfigRepository Repository for interacting with DepartmentConfiguration entities.
     * @param departmentRepository Repository for interacting with Department entities.
     */
    constructor(
      @InjectRepository(DepartmentConfiguration)
      private readonly departmentConfigRepository: Repository<DepartmentConfiguration>,
      @InjectRepository(Department)
      private readonly departmentRepository: Repository<Department>,
    ) {}


    /**
     * Creates a new department configuration.
     * 
     * @param createDepartmentConfigurationDto DTO containing the data to create a department configuration.
     * @returns The created department configuration.
     * @throws RpcException if the department is not found.
     */
    async create(createDepartmentConfigurationDto: CreateDepartmentConfigurationDto) 
    {
      const department = await this.departmentRepository.findOne({
        where: { departmentId: createDepartmentConfigurationDto.departmentId },
      });

      if (!department) {
        throw new RpcException({message:'Department not found',status:HttpStatus.NOT_FOUND});
      }

      const departmentConfig = this.departmentConfigRepository.create({
        ...createDepartmentConfigurationDto,
        department,
      });

      return this.departmentConfigRepository.save(departmentConfig);
    }

    /**
     * Retrieves all department configurations.
     * 
     * @returns A list of all department configurations.
     */
    async findAll() 
    {
      const departamentos = await this.departmentConfigRepository.find({ relations:['department']});
      return departamentos;
    }
    
    /**
     * Retrieves department configurations by department ID.
     * 
     * @param departmentId The ID of the department to find configurations for.
     * @returns A list of configurations for the specified department.
     * @throws RpcException if the department is not found or no configurations exist for the department.
     */
    async findByDepartmentId(departmentId: string) 
    {
      const department = await this.departmentRepository.findOne({
        where: { departmentId },
      });
    
      if (!department) {
        throw new RpcException({message:'Department not found',status:HttpStatus.NOT_FOUND});
      }
    
      const configurations = await this.departmentConfigRepository.find({
        where: { department },
        relations: ['department'],
      });
    
      if (!configurations.length) {
        throw new RpcException({message:`Department configuration not found.`,status:HttpStatus.NOT_FOUND});
      }
    
      return configurations;
    }
    
    /**
     * Retrieves a specific department configuration by ID.
     * 
     * @param id The ID of the department configuration to retrieve.
     * @returns The department configuration if found.
     * @throws RpcException if the department configuration is not found.
     */
    async findOne(id: string) 
    {
      const config = await this.departmentConfigRepository.findOne({
        where: { id },
        relations: ['department'],
      });

      if (!config) {
        throw new RpcException({message:`Department configuration not found.`,status:HttpStatus.NOT_FOUND});
      }

      return config;
    }


    /**
     * Updates an existing department configuration.
     * 
     * @param id The ID of the department configuration to update.
     * @param updateDepartmentConfigurationDto DTO containing the data to update the department configuration.
     * @returns A message indicating the success of the update.
     * @throws RpcException if the department configuration or department is not found, or if the start time is greater than the end time.
     */
    async update(id: string, updateDepartmentConfigurationDto: UpdateDepartmentConfigurationDto) 
    {
      const departmentConfig = await this.departmentConfigRepository.preload({
        id,
        ...updateDepartmentConfigurationDto,
      });

      if (!departmentConfig) {
        throw new RpcException({message:`Department configuration not found.`,status:HttpStatus.NOT_FOUND});
      }
      if (updateDepartmentConfigurationDto.horaInicio > updateDepartmentConfigurationDto.horaFinal) {
        throw new RpcException({message:'The start time cannot be greater than the end time.',status:HttpStatus.CONFLICT});
      }
      if (updateDepartmentConfigurationDto.departmentId) {
        const department = await this.departmentRepository.findOne({
          where: { departmentId: updateDepartmentConfigurationDto.departmentId },
        });

        if (!department) {
          throw new RpcException({message:'Department not found',status:HttpStatus.NOT_FOUND});
        }

        departmentConfig.department = department;
      }
      await this.departmentConfigRepository.save(departmentConfig)

      return {message:"Department successfully updated."};
    }

  
  }
