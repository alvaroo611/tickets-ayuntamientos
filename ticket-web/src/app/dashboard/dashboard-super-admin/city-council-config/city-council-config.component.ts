import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 // Ajusta el path al servicio
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../../dashboard-admin/employee-dialog/employee-form-create/employee-form-create.component';
import { ConfigFormCreateComponent } from './config-form-create/config-form-create.component';
import { ConfigFormUpdateComponent } from './config-form-update/config-form-update.component';
import { CreateEmployeeDto } from '../../services/models/create-empleado.dto';


/**
 * CityCouncilConfigComponent handles the configuration and management of city council admins.
 * It loads the administrators, handles search filtering, opens dialogs for creating and editing admins,
 * and allows toggling the admin status (active/inactive).
 * @returns void
 */
@Component({
  selector: 'app-city-council-config',
  templateUrl: './city-council-config.component.html',
  styleUrls: ['./city-council-config.component.css']
})
export class CityCouncilConfigComponent implements OnInit
{
  cityCouncil?: any;
  admins: any[] = [];
  filteredAdmins: any[] = [];
  loading = false;
  errorMessage = '';
  dialogRefCrear: MatDialogRef<ConfigFormCreateComponent> | null = null;
  dialogRefEdit: MatDialogRef<ConfigFormUpdateComponent> | null = null;


  /**
   * Constructor initializes services and injects required dependencies.
   * @param router Router to navigate between routes
   * @param route ActivatedRoute to access query params
   * @param dialog MatDialog to open modal dialogs
   * @param employeeService EmployeeService to fetch and manage employee data
   * @returns void
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog:MatDialog,
    private employeeService: EmployeeService // Inyectamos el servicio
  ) {}


  /**
   * ngOnInit is called when the component is initialized.
   * It loads the city council data from the query parameters and fetches the list of admins.
   * @returns void
   */
  ngOnInit(): void
  {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.cityCouncil = {
          id: params['id'],
          name: params['name']
        };

      } else {
        console.error('No se encontraron query params en la navegación.');
      }
    });

    // Cargamos los administradores
    this.loadAdmins();
  }

  /**
   * loadAdmins fetches the list of admins from the employee service,
   * filters them by the role 'admin', and updates the filtered admins list.
   * Handles error by displaying a message and ensuring the loading state is updated.
   * @returns void
   */
  loadAdmins(): void
  {
    this.loading = true;
    this.employeeService.fetchEmployees()
      .pipe(
        catchError(err => {
          console.error('Error al cargar administradores:', err);
          this.errorMessage = 'Error al cargar la lista de administradores.';
          return of([]);
        })
      )
      .subscribe(data => {

        // Filtramos solo los administradores
        this.admins = data.filter(admin => admin.rol === 'admin' && admin.cityCouncil.id===this.cityCouncil.id);
        this.filteredAdmins = this.admins;
        this.loading = false;
      });
  }

  /**
   * onSearch filters the admins list based on the search input.
   * It removes accents and matches the search term in the admin's name.
   * @param event The search input event
   * @returns void
   */
  onSearch(event: any): void
  {
    const searchTerm = event.target.value.toLowerCase();

    // Función para eliminar tildes
    const removeAccents = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    this.filteredAdmins = this.admins.filter(admin =>
      removeAccents(admin.name.toLowerCase()).includes(removeAccents(searchTerm))
    );
  }


  /**
   * openCreateAdminDialog opens a dialog to create a new admin for the current city council.
   * It subscribes to the event when a new admin is created to refresh the list of admins.
   * @returns void
   */
  openCreateAdminDialog(): void
  {
    this.dialogRefCrear = this.dialog.open(ConfigFormCreateComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      data:this.cityCouncil,
      panelClass: 'custom-modal'
    });

    // Suscribirse al evento de creación de empleado
    this.dialogRefCrear.componentInstance.employeeCreated.subscribe(() => {
      this.loadAdmins();  // Actualizar la lista de empleados
    });

    this.dialogRefCrear.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  /**
   * openEditAdminDialog opens a dialog to edit an existing admin.
   * It subscribes to the event when the admin is edited to refresh the list of admins.
   * @param admin The admin data to be edited
   * @returns void
   */
  openEditAdminDialog(admin: any): void
  {
    this.dialogRefEdit = this.dialog.open(ConfigFormUpdateComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '435px',
      height: '70vh',
      data:admin,
      panelClass: 'custom-modal'
    });

    // Suscribirse al evento de creación de empleado

    this.dialogRefEdit.componentInstance.employeeEditer.subscribe(() => {
      this.loadAdmins();  // Actualizar la lista de empleados
    });
    this.dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.loadAdmins();
      }
    });
  }


  /**
   * toggleAdminStatus changes the status of an admin between active and inactive.
   * It sends the updated status to the backend for persistence.
   * @param employee The employee whose status is being toggled
   * @returns void
   */
  toggleAdminStatus(employee: any): void
  {
    employee.isActive=!employee.isActive
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
   * closeTab navigates back to the super admin page, or closes the current tab.
   * @returns void
   */
  closeTab(): void
  {
    this.router.navigate(['/super-admin']);
    // Aquí puedes usar el router para navegar a otra página o cerrar el componente actual
  }
}
