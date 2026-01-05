import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../core/services/curso';
import { ModuloService } from '../../core/services/modulo';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { Curso, Modulo } from '../../core/models';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-admin-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './admin-cursos.html',
  styleUrls: ['./admin-cursos.css'],
})
export class AdminCursosComponent implements OnInit {
  cursos: Curso[] = [];
  modulos: Modulo[] = [];
  loading = true;
  mostrarFormulario = false;
  modoEdicion = false;

  cursoActual: Curso = {
    titulo: '',
    descripcion: '',
    urlContenido: '',
    activo: true,
    modulo: undefined,
  };

  // ID del módulo seleccionado (para el select)
  moduloSeleccionadoId: number | undefined = undefined;

  constructor(
    private cursoService: CursoService,
    private moduloService: ModuloService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarModulos();
  }

  cargarCursos(): void {
    this.cursoService.listarTodos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
        this.toastService.error('Error al cargar los cursos');
        this.loading = false;
      },
    });
  }

  cargarModulos(): void {
    this.moduloService.listarTodos().subscribe({
      next: (data) => {
        this.modulos = data;
      },
      error: (err) => {
        console.error('Error al cargar módulos', err);
        this.toastService.error('Error al cargar los módulos');
      },
    });
  }

  nuevoCurso(): void {
    this.modoEdicion = false;
    this.cursoActual = {
      titulo: '',
      descripcion: '',
      urlContenido: '',
      activo: true,
      modulo: undefined,
    };
    this.moduloSeleccionadoId = undefined;
    this.mostrarFormulario = true;
  }

  editarCurso(curso: Curso): void {
    this.modoEdicion = true;
    this.cursoActual = { ...curso };

    // Establecer el ID del módulo para el select
    this.moduloSeleccionadoId = curso.idModulo;

    this.mostrarFormulario = true;
  }

  guardarCurso(): void {
    if (!this.validarFormulario()) {
      return;
    }

    // Asignar el módulo seleccionado al curso
    if (this.moduloSeleccionadoId) {
      const moduloSeleccionado = this.modulos.find((m) => m.idModulo === this.moduloSeleccionadoId);
      if (moduloSeleccionado) {
        this.cursoActual.modulo = moduloSeleccionado;
      }
    }

    const operacion = this.modoEdicion
      ? this.cursoService.actualizar(this.cursoActual.id!, this.cursoActual)
      : this.cursoService.crear(this.cursoActual);

    operacion.subscribe({
      next: () => {
        const mensaje = this.modoEdicion
          ? 'Curso actualizado exitosamente ✓'
          : 'Curso creado exitosamente ✓';

        this.toastService.success(mensaje);
        this.cerrarFormulario();
        this.cargarCursos();
      },
      error: (err) => {
        console.error('Error al guardar curso', err);

        // Extraer el mensaje de error del backend
        let mensajeError = 'Error al guardar el curso';

        if (err.error) {
          // Si el error es un string (como tu backend envía)
          if (typeof err.error === 'string') {
            mensajeError = err.error;
          }
          // Si el error es un objeto con mensaje
          else if (err.error.message) {
            mensajeError = err.error.message;
          }
          // Si el error es un objeto con error
          else if (err.error.error) {
            mensajeError = err.error.error;
          }
        }

        this.toastService.error(mensajeError);
      },
    });
  }

  eliminarCurso(id: number): void {
    this.confirmDialogService
      .danger(
        'Esta acción no se puede deshacer. El curso será eliminado permanentemente.',
        '¿Eliminar curso?',
        'Sí, eliminar',
        'Cancelar'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.cursoService.eliminar(id).subscribe({
            next: () => {
              this.toastService.success('Curso eliminado exitosamente ✓');
              this.cargarCursos();
            },
            error: (err) => {
              console.error('Error al eliminar curso', err);
              this.toastService.error('Error al eliminar el curso');
            },
          });
        }
      });
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.moduloSeleccionadoId = undefined;
    this.cursoActual = {
      titulo: '',
      descripcion: '',
      urlContenido: '',
      activo: true,
      modulo: undefined,
    };
  }

  private validarFormulario(): boolean {
    if (!this.cursoActual.titulo || this.cursoActual.titulo.trim() === '') {
      this.toastService.error('El título es obligatorio');
      return false;
    }

    if (!this.moduloSeleccionadoId) {
      this.toastService.error('Debes seleccionar un módulo');
      return false;
    }

    return true;
  }

  getNombreModulo(idModulo?: number): string {
    if (!idModulo) return 'Sin módulo';
    const modulo = this.modulos.find((m) => m.idModulo === idModulo);
    return modulo?.nombre || 'Desconocido';
  }
}
