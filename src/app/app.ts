import { Component, inject, signal } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet,
} from '@angular/router';
import { ToastComponent } from './core/component/toast';
import { ConfirmDialogComponent } from './core/component/confirm-dialog';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmDialogComponent],
  template: `<router-outlet></router-outlet> <app-toast></app-toast>
    <app-confirm-dialog></app-confirm-dialog>`,
})
export class App {
  protected readonly title = signal('portal-capacitaciones');
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError
        )
      )
      .subscribe((e) => console.log('[ROUTER EVENT]', e));
  }
}
