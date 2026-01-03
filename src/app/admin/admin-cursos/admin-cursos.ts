import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../core/services/curso';
import { ModuloService } from '../../core/services/modulo';
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

  // Mensaje de feedback
  mensaje: { texto: string; tipo: 'success' | 'error' | 'info' } | null = null;

  constructor(private cursoService: CursoService, private moduloService: ModuloService) {}

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
        this.mostrarMensaje('Error al cargar los cursos', 'error');
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
        this.mostrarMensaje('Error al cargar los módulos', 'error');
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
    this.ocultarMensaje();
  }

  editarCurso(curso: Curso): void {
    this.modoEdicion = true;
    this.cursoActual = { ...curso };

    // Establecer el ID del módulo para el select
    this.moduloSeleccionadoId = curso.idModulo;

    this.mostrarFormulario = true;
    this.ocultarMensaje();
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
          ? 'Curso actualizado exitosamente'
          : 'Curso creado exitosamente';

        this.mostrarMensaje(mensaje, 'success');
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

        this.mostrarMensaje(mensajeError, 'error');
      },
    });
  }

  eliminarCurso(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.cursoService.eliminar(id).subscribe({
        next: () => {
          this.mostrarMensaje('Curso eliminado exitosamente', 'success');
          this.cargarCursos();
        },
        error: (err) => {
          console.error('Error al eliminar curso', err);
          this.mostrarMensaje('Error al eliminar el curso', 'error');
        },
      });
    }
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
      this.mostrarMensaje('El título es obligatorio', 'error');
      return false;
    }

    if (!this.moduloSeleccionadoId) {
      this.mostrarMensaje('Debes seleccionar un módulo', 'error');
      return false;
    }

    return true;
  }

  private mostrarMensaje(texto: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensaje = { texto, tipo };

    // Auto-ocultar después de 5 segundos si es success o info
    if (tipo === 'success' || tipo === 'info') {
      setTimeout(() => {
        this.ocultarMensaje();
      }, 5000);
    }
  }

  ocultarMensaje(): void {
    this.mensaje = null;
  }

  getNombreModulo(idModulo?: number): string {
    if (!idModulo) return 'Sin módulo';
    const modulo = this.modulos.find((m) => m.idModulo === idModulo);
    return modulo?.nombre || 'Desconocido';
  }
}
