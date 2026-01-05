import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModuloService {
  private apiUrl = `${environment.apiUrl}/modulos`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todos los módulos
   */
  listarTodos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl);
  }

  /**
   * Obtener un módulo por ID
   */
  obtenerPorId(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo módulo
   */
  crear(modulo: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(this.apiUrl, modulo);
  }

  /**
   * Actualizar un módulo existente
   */
  actualizar(id: number, modulo: Modulo): Observable<Modulo> {
    return this.http.put<Modulo>(`${this.apiUrl}/${id}`, modulo);
  }

  /**
   * Eliminar un módulo
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos legacy (mantener para compatibilidad con código existente)

  /**
   * @deprecated Use listarTodos() instead
   */
  listarModulos(): Observable<Modulo[]> {
    return this.listarTodos();
  }
}
