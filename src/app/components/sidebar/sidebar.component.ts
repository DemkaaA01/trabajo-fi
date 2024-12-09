import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isSidebarOpen = false;

  openSidebar() {
    this.isSidebarOpen = true; // Abre la sidebar
  }

  closeSidebar() {
    this.isSidebarOpen = false; // Cierra la sidebar
  }
}




