import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeFormComponent } from './employee-form-create/employee-form-create.component';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormUpdateComponent } from './employee-form-update/employee-form-update.component';
import { Router } from '@angular/router';
import { CreateEmployeeDto } from '../../services/models/create-empleado.dto';
import { AuthService } from '../../../login/auth.service';
/**
 * Component for managing employee data through dialog forms, including creating, updating, and filtering employees.
 */
@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css']
})
export class EmployeeDialogComponent implements OnInit
{
  employees: any[] = [];
  filteredEmployees: any[] = [];
  departmentName:string='';
  dialogRefCrear: MatDialogRef<EmployeeFormComponent> | null = null;
  dialogRefEdit: MatDialogRef<EmployeeFormUpdateComponent> | null = null;
  /**
   * Constructor to inject necessary services and dependencies.
   * @param dialog - Service for opening dialogs.
   * @param employeeService - Service to handle employee data operations.
   * @param router - Router service for navigation.
   * @param authService - Service for authentication and retrieving city council data.
   */
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService
  ) {}
  /**
   * Lifecycle hook that runs when the component is initialized.
   * Fetches the list of employees.
   */
  ngOnInit(): void
  {
    this.fetchEmployees();
  }
  /**
   * Fetches the list of employees from the service and filters them based on the city council ID.
   */
  fetchEmployees()
  {
    this.employeeService.fetchEmployees().subscribe(
      data => {
        const cityCouncilId=this.authService.getCityCouncil();


        this.employees = data.filter(employee => employee.cityCouncil && employee.cityCouncil.id === cityCouncilId && employee.department);
        this.filteredEmployees = [...this.employees];
      },
      error => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }
  /**
   * Filters the list of employees based on the search input.
   * @param event - The input event containing the search query.
   */
  onSearch(event: any)
  {
    const query = event.target.value.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Eliminar diacríticos (tildes)

    if (query) {
      // Filtrar empleados por nombre, rol o DNI
      this.filteredEmployees = this.employees.filter(employee =>
        Object.values(employee).some(value =>
          value
            ? value.toString().toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(query)
            : false
        )
      );
    } else {
      // Si no hay texto en la búsqueda, mostrar todos los empleados
      this.filteredEmployees = [...this.employees];
    }
  }


   /**
   * Opens a dialog to create a new employee.
   */
  openCreateEmployeeDialog()
  {
    this.dialogRefCrear = this.dialog.open(EmployeeFormComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      panelClass: 'custom-modal'
    });

    // Suscribirse al evento de creación de empleado
    this.dialogRefCrear.componentInstance.employeeCreated.subscribe(() => {
      this.fetchEmployees();  // Actualizar la lista de empleados
    });

    this.dialogRefCrear.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  /**
   * Opens a dialog to edit an existing employee.
   * @param employee - The employee data to be edited.
   */
  openEditEmployeeDialog(employee: any)
  {
      this.dialogRefEdit = this.dialog.open(EmployeeFormUpdateComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '450px',
      height: '70vh',
      panelClass: 'custom-modal',
      data: employee // Pasa los datos del empleado seleccionado al componente de actualización
    });
    this.dialogRefEdit.componentInstance.employeeEdit.subscribe(() => {
       // Actualizar la lista de empleados
    });
    this. dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {

        this.fetchEmployees(); // Actualizar la lista de empleados después de la edición
      }
    });
  }
  /**
   * Returns the role name based on the role identifier.
   * @param rol - The role identifier (e.g., 'admin', 'tec', 'responsable').
   * @returns The role name in a readable format.
   */
  getRoleName(rol: string): string
  {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'tec':
        return 'Técnico';
        case 'responsable':
          return 'Responsable';
      default:
        return 'Desconocido';
    }
  }
  /**
   * Updates the active status of an employee and sends the updated data to the service.
   * @param employee - The employee whose status needs to be updated.
   * No return value.
   */
  updateEmployeeStatus(employee:any)
  {
    employee.isActive = !employee.isActive;  // Cambia el estado de activo/inactivo o realiza cualquier otra actualización

    const updatedEmployee:CreateEmployeeDto = {
      DNI: employee.DNI,
      name: employee.name,
      rol: employee.rol,
      isActive: employee.isActive,
      cityCouncilId:employee.cityCouncil.id
    };


    // Aquí iría la lógica para actualizar en el backend, si es necesario
    this.employeeService.updateEmployee(updatedEmployee).subscribe(
      response => {},
      error => {}
    );
  }

  /**
   * Closes the current tab and navigates back to the admin panel.
   */
  closeTab()
  {
    this.router.navigate(['/admin']);
  }
}
