import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private apiUrl = `${environment.apiUrl}/cursos`;

  constructor(private http: HttpClient) {}

  /**
   * Listar TODOS los cursos (activos e inactivos)
   */
  listarTodos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  /**
   * Listar solo cursos activos
   */
  listarActivos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/activos`);
  }

  /**
   * Listar cursos por módulo
   */
  listarPorModulo(idModulo: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/modulo/${idModulo}`);
  }

  /**
   * Obtener un curso por ID
   */
  obtenerPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo curso
   */
  crear(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso);
  }

  /**
   * Actualizar un curso existente
   */
  actualizar(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${id}`, curso);
  }

  /**
   * Eliminar (desactivar) un curso
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos legacy (mantener para compatibilidad con código existente)

  /**
   * @deprecated Use listarTodos() instead
   */
  listarCursos(): Observable<Curso[]> {
    return this.listarTodos();
  }

  /**
   * @deprecated Use obtenerPorId() instead
   */
  obtenerCurso(id: number): Observable<Curso> {
    return this.obtenerPorId(id);
  }

  /**
   * @deprecated Use crear() instead
   */
  guardarCurso(curso: Curso): Observable<Curso> {
    return this.crear(curso);
  }

  /**
   * @deprecated Use eliminar() instead
   */
  eliminarCurso(id: number): Observable<void> {
    return this.eliminar(id);
  }
}
