import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgresoCurso, CrearProgresoDTO } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProgresoService {
  private apiUrl = 'http://localhost:8080/api/progreso';

  constructor(private http: HttpClient) {}

  listarPorUsuario(idUsuario: number): Observable<ProgresoCurso[]> {
    return this.http.get<ProgresoCurso[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  obtenerProgresoPorId(idProgreso: number): Observable<ProgresoCurso> {
    return this.http.get<ProgresoCurso>(`${this.apiUrl}/${idProgreso}`);
  }

  obtenerProgresoPorUsuarioYCurso(idUsuario: number, idCurso: number): Observable<ProgresoCurso> {
    return this.http.get<ProgresoCurso>(`${this.apiUrl}/usuario/${idUsuario}/curso/${idCurso}`);
  }

  // Para CREAR un nuevo progreso
  guardarProgreso(progreso: CrearProgresoDTO): Observable<ProgresoCurso> {
    return this.http.post<ProgresoCurso>(this.apiUrl, progreso);
  }

  // Para ACTUALIZAR un progreso existente
  actualizarProgreso(
    idProgreso: number,
    progreso: Partial<ProgresoCurso>
  ): Observable<ProgresoCurso> {
    return this.http.put<ProgresoCurso>(`${this.apiUrl}/${idProgreso}`, progreso);
  }

  // Para COMPLETAR un curso específicamente
  completarCurso(idProgreso: number): Observable<ProgresoCurso> {
    return this.http.patch<ProgresoCurso>(`${this.apiUrl}/${idProgreso}/completar`, {});
  }

  eliminarProgreso(idProgreso: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idProgreso}`);
  }
}
