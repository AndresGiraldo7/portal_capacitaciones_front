// Usuario
export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: 'USER' | 'ADMIN';
  fechaCreacion?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: string;
}

// Módulo
export interface Modulo {
  idModulo: number;
  nombre: string;
  descripcion: string;
}

// Curso
export interface Curso {
  id?: number;
  titulo: string;
  descripcion: string;
  urlContenido?: string;
  activo: boolean;
  fechaCreacion?: string;

  // Campos del DTO (cuando viene del backend en GET)
  idModulo?: number;
  nombreModulo?: string;
  descripcionModulo?: string;

  // Campo para crear/actualizar (POST/PUT)
  modulo?: Modulo;
}

// Progreso
export interface ProgresoCurso {
  idProgreso?: number;
  idUsuario?: number;
  nombreUsuario?: string;
  idCurso?: number;
  tituloCurso?: string;
  descripcionCurso?: string;
  urlContenido?: string;
  idModulo?: number;
  nombreModulo?: string;
  fechaInicio?: string;
  fechaCompletado?: string;
  estado?: string; // 'NO_INICIADO' | 'EN_PROGRESO' | 'COMPLETADO'

  // Para compatibilidad con el HTML actual
  curso?: {
    id?: number;
    titulo?: string;
    descripcion?: string;
  };
  usuario?: {
    id: number;
    username: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

// AGREGAR esta nueva interfaz para crear progreso
export interface CrearProgresoDTO {
  idUsuario: number;
  idCurso: number;
  estado: string;
}

// Insignia
export interface Insignia {
  id?: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
}

export interface UsuarioInsignia {
  usuario: Usuario;
  insignia: Insignia;
  fechaOtorgada: string;
}
