
import { CityCouncil } from "src/city-council/entities/city-council.entity";
import { Department } from "src/department/entities/department.entity";
import { EmployeeRoom } from "src/employee-room/entities/employee-room.entity";
import { TechnicalHoursOut } from "src/technical-hours-out/entities/technical-hours-out.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique, OneToOne } from "typeorm";

/**
 * Represents an employee within the system.
 * 
 * This entity includes essential properties and relationships 
 * to define the employee's attributes and their associations with other entities, 
 * such as `CityCouncil`, `Department`, `EmployeeRoom`, `Ticket`, and `TechnicalHoursOut`.
 */
@Entity()
@Unique(['DNI']) 
export class Employee 
{

  /**
   * Unique identifier for the employee (DNI).
   */
  @PrimaryColumn()
  DNI: string;

  /**
   * The role of the employee (e.g., admin, technician).
   */
  @Column()
  rol: string; 

  /**
   * The encrypted password for the employee.
   */
  @Column()
  password: string;

  /**
   * The full name of the employee.
   */
  @Column()
  name: string;

  /**
   * Indicates whether the employee is active or deactivated.
   * Defaults to `true` when a new employee is created.
   */
  @Column({ default: true })
  isActive: boolean;
  

  /**
   * Many-to-One relationship with `CityCouncil`.
   * Represents the city council the employee belongs to.
   */
  @ManyToOne(() => CityCouncil, (cityCouncil) => cityCouncil.employees )
  @JoinColumn() 
  cityCouncil: CityCouncil;

  /**
   * One-to-Many relationship with `EmployeeRoom`.
   * Represents the rooms assigned to the employee.
   */
  @OneToMany(() => EmployeeRoom, (employeeRoom) => employeeRoom.employee)
  employeeRooms: EmployeeRoom[];

   /**
   * One-to-Many relationship with `Ticket`.
   * Represents the tickets handled by the employee.
   */
  @OneToMany(() => Ticket, (ticket) => ticket.employee)
  tickets: Ticket[];

  /**
   * One-to-Many relationship with `TechnicalHoursOut`.
   * Tracks the hours spent by the employee outside of technical tasks.
   */
  @OneToMany(() => TechnicalHoursOut, (technicalHoursOut) => technicalHoursOut.employee)
  technicalHoursOuts: TechnicalHoursOut[]; // Relación OneToMany con TechnicalHoursOut

  
  /**
   * Many-to-One relationship with `Department`.
   * Represents the department to which the employee belongs.
   */
  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'department_id' }) // Define la clave foránea
  department: Department; // Relación ManyToOne con Department


}


