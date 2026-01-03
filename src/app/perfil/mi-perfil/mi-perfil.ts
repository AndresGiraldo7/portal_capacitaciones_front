import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { ProgresoService } from '../../core/services/progreso';
import { InsigniaService } from '../../core/services/insignia';
import { ProgresoCurso, LoginResponse, UsuarioInsignia } from '../../core/models';
import { NavbarComponent } from '../../shared/navbar/navbar';

interface ModuloProgreso {
  nombre: string;
  total: number;
  completados: number;
  porcentaje: number;
}

interface Actividad {
  icono: string;
  titulo: string;
  descripcion: string;
  fecha: string;
}

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css'],
})
export class MiPerfilComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  progresos: ProgresoCurso[] = [];
  insignias: UsuarioInsignia[] = [];
  loading = true;
  filtroEstado: 'TODOS' | 'COMPLETADO' | 'EN_PROGRESO' = 'TODOS';

  // Mapeo de iconos para cada insignia
  private readonly ICONOS_INSIGNIAS: { [key: number]: string } = {
    1: '🏆', // Curso Completado
    2: '📚', // Aprendiz Constante
    3: '🎓', // Maestro del Conocimiento
    4: '🚀', // Iniciador Rápido
    5: '💯', // Perfeccionista
  };

  constructor(
    private authService: AuthService,
    private progresoService: ProgresoService,
    private insigniaService: InsigniaService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.cargarDatos();
    }
  }

  // ✅ Getter para obtener la inicial del usuario de forma segura
  get inicialUsuario(): string {
    return this.currentUser?.nombre?.charAt(0).toUpperCase() || '?';
  }

  cargarDatos(): void {
    if (!this.currentUser) return;

    // Cargar progresos de cursos
    this.progresoService.listarPorUsuario(this.currentUser.id).subscribe({
      next: (data) => {
        this.progresos = data.sort((a, b) => {
          // Ordenar por fecha más reciente
          const dateA = a.fechaInicio ? new Date(a.fechaInicio).getTime() : 0;
          const dateB = b.fechaInicio ? new Date(b.fechaInicio).getTime() : 0;
          return dateB - dateA;
        });
        console.log('✅ Progresos cargados:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar progresos:', err);
      },
    });

    // Cargar insignias del usuario
    this.loading = true;
    this.insigniaService.listarPorUsuario(this.currentUser.id).subscribe({
      next: (data) => {
        this.insignias = data.sort((a, b) => {
          // Ordenar por fecha más reciente primero
          const dateA = new Date(a.fechaOtorgada).getTime();
          const dateB = new Date(b.fechaOtorgada).getTime();
          return dateB - dateA;
        });
        console.log('✅ Insignias cargadas:', this.insignias);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar insignias:', err);
        console.error('Detalles del error:', err.error);
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

  get porcentajeCompletado(): number {
    if (this.progresos.length === 0) return 0;
    return Math.round((this.cursosCompletados / this.progresos.length) * 100);
  }

  get progresosFiltrados(): ProgresoCurso[] {
    if (this.filtroEstado === 'TODOS') {
      return this.progresos;
    }
    return this.progresos.filter((p) => p.estado === this.filtroEstado);
  }

  get modulosProgreso(): ModuloProgreso[] {
    const modulosMap = new Map<string, ModuloProgreso>();

    this.progresos.forEach((progreso) => {
      const moduloNombre = progreso.nombreModulo;

      // Validar que nombreModulo existe antes de usarlo
      if (!moduloNombre) {
        return; // Saltar este progreso si no tiene nombre de módulo
      }

      if (!modulosMap.has(moduloNombre)) {
        modulosMap.set(moduloNombre, {
          nombre: moduloNombre,
          total: 0,
          completados: 0,
          porcentaje: 0,
        });
      }

      const modulo = modulosMap.get(moduloNombre)!;
      modulo.total++;
      if (progreso.estado === 'COMPLETADO') {
        modulo.completados++;
      }
    });

    // Calcular porcentajes
    const modulos = Array.from(modulosMap.values());
    modulos.forEach((modulo) => {
      modulo.porcentaje =
        modulo.total > 0 ? Math.round((modulo.completados / modulo.total) * 100) : 0;
    });

    return modulos.sort((a, b) => b.porcentaje - a.porcentaje);
  }

  get actividadReciente(): Actividad[] {
    const actividades: Actividad[] = [];

    // Insignias recientes (últimas 3)
    this.insignias.slice(0, 3).forEach((insignia) => {
      actividades.push({
        icono: this.getIconoInsignia(insignia),
        titulo: `Insignia obtenida: ${insignia.insignia.nombre}`,
        descripcion: insignia.insignia.descripcion,
        fecha: insignia.fechaOtorgada,
      });
    });

    // Cursos completados recientes (últimos 5)
    this.progresos
      .filter((p) => p.estado === 'COMPLETADO' && p.fechaCompletado)
      .slice(0, 5)
      .forEach((progreso) => {
        actividades.push({
          icono: '✅',
          titulo: `Curso completado: ${progreso.tituloCurso}`,
          descripcion: `Módulo: ${progreso.nombreModulo}`,
          fecha: progreso.fechaCompletado!,
        });
      });

    // Cursos iniciados recientes (últimos 3)
    this.progresos
      .filter((p) => p.estado === 'EN_PROGRESO' && p.fechaInicio)
      .slice(0, 3)
      .forEach((progreso) => {
        actividades.push({
          icono: '📚',
          titulo: `Curso iniciado: ${progreso.tituloCurso}`,
          descripcion: `Módulo: ${progreso.nombreModulo}`,
          fecha: progreso.fechaInicio!,
        });
      });

    // Ordenar por fecha más reciente
    return actividades
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 10); // Mostrar solo las últimas 10 actividades
  }

  /**
   * Obtiene el icono correcto para una insignia
   */
  getIconoInsignia(insignia: UsuarioInsignia): string {
    // Verificar que el ID existe antes de usarlo como índice
    if (!insignia?.insignia?.id) {
      return '🏅';
    }

    const iconoMapeado = this.ICONOS_INSIGNIAS[insignia.insignia.id];

    if (iconoMapeado) {
      return iconoMapeado;
    }

    if (
      insignia.insignia.imagenUrl &&
      insignia.insignia.imagenUrl !== '??' &&
      insignia.insignia.imagenUrl !== '?'
    ) {
      return insignia.insignia.imagenUrl;
    }

    return '🏅';
  }

  /**
   * Calcula el tiempo que tomó completar un curso
   */
  calcularTiempoCurso(progreso: ProgresoCurso): string {
    if (!progreso.fechaCompletado || !progreso.fechaInicio) {
      return '-';
    }

    const inicio = new Date(progreso.fechaInicio).getTime();
    const fin = new Date(progreso.fechaCompletado).getTime();
    const diffMs = fin - inicio;

    // Si el tiempo es negativo o cero, retornar guión
    if (diffMs <= 0) {
      return '-';
    }

    const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (dias > 0) {
      return `${dias}d ${horas}h`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${minutos}m`;
    }
  }
}
