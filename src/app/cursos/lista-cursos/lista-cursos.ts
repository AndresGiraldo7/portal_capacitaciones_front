import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../core/services/curso';
import { ProgresoService } from '../../core/services/progreso';
import { AuthService } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
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
    private authService: AuthService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
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
        this.toastService.error('Error al cargar los cursos. Por favor, intenta nuevamente.');
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
          this.toastService.error('Error al cargar tu progreso.');
        },
      });
    }
  }

  cargarInsignias(): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId) {
      fetch(`/api/usuario-insignias/usuario/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          this.insignias = data;
        })
        .catch((err) => {
          console.error('Error al cargar insignias', err);
        });
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
      this.toastService.error('Debes iniciar sesión para continuar');
      return;
    }

    if (!curso.id) {
      this.toastService.error('Error: Curso inválido');
      return;
    }

    const progresoExistente = this.getProgreso(curso.id);
    if (progresoExistente) {
      if (progresoExistente.estado === 'EN_PROGRESO') {
        this.toastService.info('Ya tienes este curso en progreso. Haz clic en "Continuar Curso"');
      } else if (progresoExistente.estado === 'COMPLETADO') {
        this.toastService.info('Ya completaste este curso. Puedes revisarlo cuando quieras.');
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
        this.toastService.success('¡Curso iniciado exitosamente! 🎉');
        this.cargarProgresos();
      },
      error: (err) => {
        console.error('Error al iniciar curso:', err);
        if (err.error?.error) {
          this.toastService.error(err.error.error);
        } else {
          this.toastService.error('Error al iniciar el curso. Intenta de nuevo.');
        }
      },
    });
  }

  continuarCurso(curso: Curso): void {
    this.toastService.info('Redirigiendo al contenido del curso...');
    console.log('Continuar curso:', curso);
  }

  revisarCurso(curso: Curso): void {
    this.toastService.info('Abriendo curso para revisión...');
    console.log('Revisar curso:', curso);
  }

  completarCurso(progreso: ProgresoCurso): void {
    if (!progreso.idProgreso) {
      this.toastService.error('Error: Progreso inválido');
      return;
    }

    this.confirmDialogService
      .confirm(
        '¿Estás seguro de que deseas marcar este curso como completado?',
        'Completar Curso',
        'Sí, completar',
        'Cancelar'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.progresoService.completarCurso(progreso.idProgreso!).subscribe({
            next: (response) => {
              console.log('Curso completado:', response);
              this.toastService.success('¡Felicitaciones! Has completado el curso. 🎉');

              // Mostrar modal de insignia ganada
              this.mostrarInsigniaGanada();

              // Recargar datos
              this.cargarProgresos();
              this.cargarInsignias();
            },
            error: (err) => {
              console.error('Error al completar curso', err);
              this.toastService.error('Error al completar el curso');
            },
          });
        }
      });
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
}
