import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../core/services/curso';
import { ProgresoService } from '../../core/services/progreso';
import { AuthService } from '../../core/services/auth';
import { Curso, ProgresoCurso, CrearProgresoDTO } from '../../core/models';
import { NavbarComponent } from '../../shared/navbar/navbar';

interface Insignia {
  idInsignia: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  fechaOtorgada: string;
}

@Component({
  selector: 'app-lista-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './lista-cursos.html',
  styleUrls: ['./lista-cursos.css'],
})
export class ListaCursosComponent implements OnInit {
  cursos: Curso[] = [];
  progresos: ProgresoCurso[] = [];
  insignias: Insignia[] = [];
  loading = true;
  idModulo!: number;
  nombreModulo = '';
  mostrarInsigniaModal = false;
  insigniaRecienGanada: Insignia | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private progresoService: ProgresoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idModulo = +params['idModulo'];
      if (isNaN(this.idModulo)) {
        console.error('ID de módulo inválido');
        return;
      }
      this.cargarCursos();
      this.cargarProgresos();
      this.cargarInsignias();
    });
  }

  cargarCursos(): void {
    this.cursoService.listarPorModulo(this.idModulo).subscribe({
      next: (data) => {
        this.cursos = data;
        if (data.length > 0 && data[0].nombreModulo) {
          this.nombreModulo = data[0].nombreModulo;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
        this.loading = false;
      },
    });
  }

  cargarProgresos(): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId) {
      this.progresoService.listarPorUsuario(userId).subscribe({
        next: (data) => {
          this.progresos = data;
        },
        error: (err) => {
          console.error('Error al cargar progresos', err);
        },
      });
    }
  }

  cargarInsignias(): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId) {
      // Ajusta esta URL según tu API
      fetch(`/api/usuario-insignias/usuario/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          this.insignias = data;
        })
        .catch((err) => console.error('Error al cargar insignias', err));
    }
  }

  getProgreso(idCurso: number): ProgresoCurso | undefined {
    return this.progresos.find((p) => p.idCurso === idCurso);
  }

  getCursosCompletados(): number {
    return this.progresos.filter((p) => p.estado === 'COMPLETADO').length;
  }

  getCursosEnProgreso(): number {
    return this.progresos.filter((p) => p.estado === 'EN_PROGRESO').length;
  }

  iniciarCurso(curso: Curso): void {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.mostrarMensaje('Debes iniciar sesión para continuar', 'error');
      return;
    }

    if (!curso.id) {
      this.mostrarMensaje('Error: Curso inválido', 'error');
      return;
    }

    const progresoExistente = this.getProgreso(curso.id);
    if (progresoExistente) {
      if (progresoExistente.estado === 'EN_PROGRESO') {
        this.mostrarMensaje(
          'Ya tienes este curso en progreso. Haz clic en "Continuar Curso"',
          'info'
        );
      } else if (progresoExistente.estado === 'COMPLETADO') {
        this.mostrarMensaje('Ya completaste este curso. Puedes revisarlo cuando quieras.', 'info');
      }
      return;
    }

    const progreso: CrearProgresoDTO = {
      idUsuario: user.id,
      idCurso: curso.id,
      estado: 'EN_PROGRESO',
    };

    this.progresoService.guardarProgreso(progreso).subscribe({
      next: (response) => {
        console.log('Curso iniciado exitosamente:', response);
        this.mostrarMensaje('¡Curso iniciado exitosamente! 🎉', 'success');
        this.cargarProgresos();
      },
      error: (err) => {
        console.error('Error al iniciar curso:', err);
        if (err.error?.error) {
          this.mostrarMensaje(err.error.error, 'error');
        } else {
          this.mostrarMensaje('Error al iniciar el curso. Intenta de nuevo.', 'error');
        }
      },
    });
  }

  continuarCurso(curso: Curso): void {
    this.mostrarMensaje('Redirigiendo al contenido del curso...', 'info');
    console.log('Continuar curso:', curso);
  }

  revisarCurso(curso: Curso): void {
    this.mostrarMensaje('Abriendo curso para revisión...', 'info');
    console.log('Revisar curso:', curso);
  }

  completarCurso(progreso: ProgresoCurso): void {
    if (!progreso.idProgreso) {
      this.mostrarMensaje('Error: Progreso inválido', 'error');
      return;
    }

    if (confirm('¿Estás seguro de que deseas marcar este curso como completado?')) {
      this.progresoService.completarCurso(progreso.idProgreso).subscribe({
        next: (response) => {
          console.log('Curso completado:', response);
          this.mostrarMensaje('¡Felicitaciones! Has completado el curso. 🎉', 'success');

          // Mostrar modal de insignia ganada
          this.mostrarInsigniaGanada();

          // Recargar datos
          this.cargarProgresos();
          this.cargarInsignias();
        },
        error: (err) => {
          console.error('Error al completar curso', err);
          this.mostrarMensaje('Error al completar el curso', 'error');
        },
      });
    }
  }

  mostrarInsigniaGanada(): void {
    this.insigniaRecienGanada = {
      idInsignia: 1,
      nombre: 'Curso Completado',
      descripcion: '¡Has completado tu primer curso exitosamente!',
      imagenUrl: '🎓',
      fechaOtorgada: new Date().toISOString(),
    };
    this.mostrarInsigniaModal = true;

    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
      this.cerrarModalInsignia();
    }, 5000);
  }

  cerrarModalInsignia(): void {
    this.mostrarInsigniaModal = false;
    this.insigniaRecienGanada = null;
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    const iconos = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
    };
    alert(`${iconos[tipo]} ${mensaje}`);
  }
}
