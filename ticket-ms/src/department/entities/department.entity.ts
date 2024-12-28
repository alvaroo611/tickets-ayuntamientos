import { Employee } from "src/auth/entities/auth.entity";
import { CityCouncil } from "src/city-council/entities/city-council.entity";
import { DepartmentConfiguration } from "src/department-configuration/entities/department-configuration.entity";
import { Room } from "src/room/entities/sala.entity";

import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";

/**
 * Represents a department within the system.
 * 
 * This entity includes essential properties and relationships 
 * to define the department's attributes and its associations with other entities, 
 * such as `CityCouncil`, `Room`, `DepartmentConfiguration`, and `Employee`.
 */
@Entity()
export class Department 
{
  /**
   * Unique identifier for the department (UUID).
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  departmentId: string;

  /**
   * The name of the department.
   * @type {string}
   */
  @Column()
  departmentName: string;

  /**
   * A brief description of the department.
   * @type {string}
   */
  @Column()
  description: string;

  /**
   * The person responsible for the department.
   * @type {string}
   */
  @Column()
  responsible: string;
  
  /**
   * Indicates whether the department is active or deactivated.
   * Defaults to `true` when a new department is created.
   * @type {boolean}
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Indicates whether the department has administrative privileges.
   * Defaults to `false` when a new department is created.
   * @type {boolean}
   */
  @Column({ default: false })
  isAdmin: boolean;
  

  /**
   * Many-to-One relationship with `CityCouncil`.
   * Represents the city council to which the department belongs.
   * @type {CityCouncil}
   */
  @ManyToOne(() => CityCouncil, (cityCouncil) => cityCouncil.departments)
  @JoinColumn() 
  cityCouncil: CityCouncil;

  /**
   * One-to-Many relationship with `Room`.
   * Represents the rooms associated with the department.
   * @type {Room[]}
   */
  @OneToMany(() => Room, (room) => room.department)
  roomEntities: Room[];

  /**
   * One-to-One relationship with `DepartmentConfiguration`.
   * Represents the configuration settings for the department.
   * @type {DepartmentConfiguration}
   */
  @OneToOne(() => DepartmentConfiguration, (config) => config.department)
  configuration: DepartmentConfiguration;

  /**
   * One-to-Many relationship with `Employee`.
   * Represents the employees working in the department.
   * @type {Employee[]}
   */
  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[]; // Relación OneToMany con Employee


 
}
