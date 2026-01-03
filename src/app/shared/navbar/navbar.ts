import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LoginResponse } from '../../core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  mobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  /**
   * Obtiene la inicial del usuario de forma segura
   */
  get inicialUsuario(): string {
    return this.currentUser?.nombre?.charAt(0).toUpperCase() || '?';
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.mobileMenuOpen = false; // Cerrar menú móvil si está abierto
  }

  /**
   * Alterna la visibilidad del menú móvil
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Cierra el menú móvil cuando se hace click fuera de él
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('nav');

    if (!clickedInside && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  /**
   * Cierra el menú móvil al presionar Escape
   */
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }
}
