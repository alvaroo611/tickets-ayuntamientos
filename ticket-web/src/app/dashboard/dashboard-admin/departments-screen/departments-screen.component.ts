import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { DepartmentFormCreateComponent } from './departments-form-create/departments-form-create.component';
import { DeparmentsFormUpdateComponent } from './deparments-form-update/deparments-form-update.component';
import { AuthService } from '../../../login/auth.service';
import { DepartmentsConfigureComponent } from './departments-configure/departments-configure.component';

/**
* Component representing the departments screen, handling department display, creation, editing, and configuration.
*/
@Component({
  selector: 'app-departments-screen',
  templateUrl: './departments-screen.component.html',
  styleUrl: './departments-screen.component.css'
})
export class DepartmentsScreenComponent implements OnInit
{

  departments: any[] = [];
  filteredDepartments: any[] = [];
  dialogRefCrear: MatDialogRef<DepartmentFormCreateComponent> | null = null;
  dialogRefEdit: MatDialogRef<DeparmentsFormUpdateComponent> | null = null;

  /**
  * Constructor to inject necessary services and dependencies.
  * @param dialog - MatDialog service to open dialogs.
  * @param departmentService - Service to handle department data operations.
  * @param router - Router service to navigate between routes.
  * @param authService - Service to handle authentication and authorization.
  */
  constructor(
    private dialog: MatDialog,
    private departmentService: DepartmentService,
    private router: Router,
    private authService: AuthService
  ) {}
  /**
  * Lifecycle hook to initialize the component and fetch department data.
  */
  ngOnInit(): void
  {
    this.fetchDepartments();
  }
  /**
  * Fetches the list of departments from the service and filters them based on the current city council.
  */
  fetchDepartments()
  {
    this.departmentService.fetchDepartments().subscribe(
      data => {
        const cityCouncilId=this.authService.getCityCouncil();
        this.departments = data.filter(department => department.cityCouncil.id=== cityCouncilId);
        this.filteredDepartments = [...this.departments];
      },
      error => {
        console.error('Error al obtener departamentos:', error);
      }
    );
  }
  /**
  * Opens a dialog to configure a specific department.
  * @param department - The department object to be configured.
  */
  configureDepartment(department: any): void
  {

    this.departmentService.findConfigureDepartmentByDepartmentId(department.departmentId).subscribe(
      (configData) => {


        const dialogRef = this.dialog.open(DepartmentsConfigureComponent,
        {
          width: '60vw',
          maxWidth: '400px',
          minWidth: '300px',
          height: '50vh',
          panelClass: 'custom-modal',
          data: configData
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result)
          {
            this.fetchDepartments();
          }
        });
      },
      (error) => {
        console.error('Error al obtener la configuración del departamento:', error);
      }
    );
  }


  /**
  * Filters the list of departments based on a search query.
  * @param event - The search input event containing the query.
  */
  onSearch(event: any)
  {
    const query = event.target.value.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (query) {
      this.filteredDepartments = this.departments.filter(department =>
        Object.values(department).some(value =>
          value
            ? value.toString().toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(query)
            : false
        )
      );
    } else {
      this.filteredDepartments = [...this.departments];
    }
  }

  /**
  * Opens a dialog to create a new department.
  */
  openCreateDepartmentDialog()
  {
    this.dialogRefCrear = this.dialog.open(DepartmentFormCreateComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      panelClass: 'custom-modal'
    });


    this.dialogRefCrear.componentInstance.departmentCreated.subscribe(() => {
      this.fetchDepartments();  //Update employee list
    });

    this.dialogRefCrear.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
/**
  * Opens a dialog to edit an existing department.
  * @param department - The department object to be edited.
  */
  openEditDepartmentDialog(department: any)
  {

    this.dialogRefEdit = this.dialog.open(DeparmentsFormUpdateComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      panelClass: 'custom-modal',
      data: department
    });

    this. dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {

        this.fetchDepartments(); // Update list later edit.
      }
    });
  }
/**
  * Updates the status (active/inactive) of a department.
  * @param department - The department object to be updated.
  */
  updateDepartmentStatus(department: any)
   {
    department.isActive = !department.isActive;

    const updatedDepartment:any = {
      departmentName: department.departmentName,
      description: department.description,
      responsible: department.responsible,
      isActive: department.isActive,
      cityHallId: this.authService.getCityCouncil()
    };



    this.departmentService.updateDepartment(department.departmentId,updatedDepartment).subscribe(
      response => console.log('Actualización exitosa', response),
      error => console.error('Error al actualizar', error)
    );
  }
/**
  * Navigates back to the admin screen.
  */
  closeTab()
  {
    this.router.navigate(['/admin']);
  }
}
