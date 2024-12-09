import { Component } from '@angular/core';
import 'boxicons';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  iniciarSesion(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido!',
        text: 'Inicio de sesión exitoso.',
      }).then(() => {
        this.router.navigate(['/sticky-interface']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión.',
        text: 'Credenciales incorrectas!',
      });
    }
  }

  forgetPassword() {
    Swal.fire({
      icon: 'error',
      title: 'Perdon capo no te puedo ayudar 😞',
    });
  }
}
