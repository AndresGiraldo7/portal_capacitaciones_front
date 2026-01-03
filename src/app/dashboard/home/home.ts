import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ProgresoService } from '../../core/services/progreso';
import { ProgresoCurso, LoginResponse } from '../../core/models';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  progresos: ProgresoCurso[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private progresoService: ProgresoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.cargarProgresos();
    }
  }

  cargarProgresos(): void {
    if (!this.currentUser) return;

    this.progresoService.listarPorUsuario(this.currentUser.id).subscribe({
      next: (data) => {
        this.progresos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get cursosCompletados(): number {
    return this.progresos.filter((p) => p.estado === 'COMPLETADO').length;
  }

  get cursosEnProgreso(): number {
    return this.progresos.filter((p) => p.estado === 'EN_PROGRESO').length;
  }

  get cursosRecientes(): ProgresoCurso[] {
    // Filtrar solo cursos en progreso y tomar los 3 más recientes
    return this.progresos.filter((p) => p.estado === 'EN_PROGRESO').slice(0, 3);
  }

  irACursos(): void {
    this.router.navigate(['/cursos']);
  }

  irAPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}
