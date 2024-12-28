export class CreateEmployeeDto {
  DNI: string;
  rol: string;
  password?: string;
  name: string;
  isActive: boolean;
  cityCouncilId?: string|null;
  department_id?:string;


  /**
   * Constructor para la creación de un nuevo empleado.
   * @param DNI - El DNI del empleado.
   * @param rol - El rol o puesto del empleado en la organización.
   * @param password - La contraseña del empleado.
   * @param name - El nombre completo del empleado.
   * @param isActive - Indica si el empleado está activo.
   * @param cityCouncilId - El identificador del ayuntamiento al que pertenece el empleado.
   */
  constructor(
    DNI: string,
    rol: string,
    password: string,
    name: string,
    isActive: boolean,
    cityCouncilId: string
  ) {
    this.DNI = DNI;
    this.rol = rol;
    this.password = password;
    this.name = name;
    this.isActive = isActive;
    this.cityCouncilId = cityCouncilId;
    this.department_id= cityCouncilId;
  }
}
