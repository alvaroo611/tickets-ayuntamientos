import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/**
 * DashboardAdminComponent is responsible for managing the admin dashboard view.
 * It displays various sections like employees, departments, rooms, and tickets.
 * It also handles navigation between these sections and provides a logout functionality.
 * @returns void
 */
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent
{
  showLogoutMenu = false;// Flag to control the visibility of the logout menu
  employees: any[] = []; // Array to store employee data
  dashboardItems = [ // Array of items for the dashboard, each representing a section
    {
      title: 'Empleados',
      description: 'Gestiona todos los empleados.',
      icon: 'fa-users',
      route: '/employees'
    },
    {
      title: 'Departamentos',
      description: 'Administra los departamentos.',
      icon: 'fa-building',
      route: '/departments'
    },
    {
      title: 'Salas',
      description: 'Gestiona las salas de trabajo.',
      icon: 'fa-door-open',
      route: '/rooms'
    },
    {
      title: 'Tickets',
      description: 'Visualiza y gestiona los tickets.',
      icon: 'fa-ticket-alt',
      route: '/tickets'
    }
  ];
  /**
   * Constructor to initialize the component with the required services.
   * @param router Router service to navigate between views
   * @param dialog MatDialog service to open modals
   * @returns void
   */
  constructor(private router: Router, private dialog: MatDialog, ) {}
  /**
   * Toggles the visibility of the logout menu when triggered.
   * @returns void
   */
  toggleLogoutMenu()
  {
    this.showLogoutMenu = !this.showLogoutMenu;
  }

  /**
   * Logs out the user by navigating to the home page and closing the logout menu.
   * @returns void
   */
  logout()
  {
    this.router.navigate(['']);

    this.showLogoutMenu = false;
  }

  /**
   * Navigates to the selected section based on the item's title.
   * @param item The selected item from the dashboard
   * @returns void
   */
  navigateTo(item: any)
  {
    if (item.title === 'Empleados')
    {
      this.router.navigate([item.route]);
    }else if(item.title === 'Departamentos')
    {
      this.router.navigate([item.route]);
    }
    else if(item.title === 'Salas')
    {
      this.router.navigate([item.route]);
    }
    else if(item.title === 'Tickets')
      {
        this.router.navigate([item.route]);
      }
    else
    {
      this.router.navigate([item.route]);
    }
  }

}
