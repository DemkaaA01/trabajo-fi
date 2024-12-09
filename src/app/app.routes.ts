import { StickyInterfaceComponent } from './pages/sticky-interface/sticky-interface.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StadisticsComponent } from './pages/stadistics/stadistics.component';

export const routes: Routes = [
  {
    path: "login",
    component:LoginComponent
  },
  {
    path:"",
    redirectTo: "login",
    pathMatch:  "full"

  },
  {
    path: "sidebar",
    component:SidebarComponent
  },
  {
    path: "stadistics",
    component: StadisticsComponent
  },
  {
  path: "sticky-interface",
  component: StickyInterfaceComponent,
  }

];
