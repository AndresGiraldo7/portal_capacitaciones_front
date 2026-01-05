import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioInsignia } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsigniaService {
  private apiUrl = `${environment.apiUrl}/usuario-insignias`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las insignias de un usuario
   */
  listarPorUsuario(idUsuario: number): Observable<UsuarioInsignia[]> {
    return this.http.get<UsuarioInsignia[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  /**
   * Eliminar una insignia de un usuario
   */
  eliminarInsignia(idUsuario: number, idInsignia: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, {
      params: {
        idUsuario: idUsuario.toString(),
        idInsignia: idInsignia.toString(),
      },
    });
  }
}
