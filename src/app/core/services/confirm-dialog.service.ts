import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmDialogData {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialogSubject = new BehaviorSubject<ConfirmDialogData | null>(null);
  public dialog$: Observable<ConfirmDialogData | null> = this.dialogSubject.asObservable();

  show(
    message: string,
    title: string = '¿Estás seguro?',
    options: {
      confirmText?: string;
      cancelText?: string;
      type?: 'info' | 'warning' | 'danger';
    } = {}
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const dialogData: ConfirmDialogData = {
        id: this.generateId(),
        title,
        message,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'warning',
        onConfirm: () => {
          this.close();
          resolve(true);
        },
        onCancel: () => {
          this.close();
          resolve(false);
        },
      };

      this.dialogSubject.next(dialogData);
    });
  }

  confirm(
    message: string,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ): Promise<boolean> {
    return this.show(message, title, { confirmText, cancelText, type: 'warning' });
  }

  danger(
    message: string,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ): Promise<boolean> {
    return this.show(message, title, { confirmText, cancelText, type: 'danger' });
  }

  info(
    message: string,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ): Promise<boolean> {
    return this.show(message, title, { confirmText, cancelText, type: 'info' });
  }

  close(): void {
    this.dialogSubject.next(null);
  }

  private generateId(): string {
    return `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
