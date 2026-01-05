import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService, ConfirmDialogData } from '../services/confirm-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="dialog" class="dialog-overlay" (click)="onOverlayClick()">
      <div
        class="dialog-container"
        [ngClass]="'dialog-' + dialog.type"
        (click)="$event.stopPropagation()"
      >
        <!-- Icono -->
        <div class="dialog-icon">
          <span>{{ getIcon(dialog.type) }}</span>
        </div>

        <!-- Contenido -->
        <div class="dialog-content">
          <h3 class="dialog-title">{{ dialog.title }}</h3>
          <p class="dialog-message">{{ dialog.message }}</p>
        </div>

        <!-- Botones -->
        <div class="dialog-actions">
          <button type="button" class="dialog-btn dialog-btn-cancel" (click)="onCancel()">
            {{ dialog.cancelText }}
          </button>
          <button
            type="button"
            class="dialog-btn dialog-btn-confirm"
            [ngClass]="'dialog-btn-' + dialog.type"
            (click)="onConfirm()"
          >
            {{ dialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease-out;
        padding: 1rem;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .dialog-container {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: scaleIn 0.2s ease-out;
      }

      @keyframes scaleIn {
        from {
          transform: scale(0.95);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .dialog-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        margin: 0 auto 1rem;
        border-radius: 50%;
        font-size: 1.5rem;
      }

      .dialog-info .dialog-icon {
        background-color: #dbeafe;
        color: #3b82f6;
      }

      .dialog-warning .dialog-icon {
        background-color: #fef3c7;
        color: #f59e0b;
      }

      .dialog-danger .dialog-icon {
        background-color: #fee2e2;
        color: #ef4444;
      }

      .dialog-content {
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .dialog-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin: 0 0 0.5rem 0;
      }

      .dialog-message {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.5;
      }

      .dialog-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .dialog-btn {
        padding: 0.625rem 1.25rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
      }

      .dialog-btn:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      .dialog-btn-cancel {
        background-color: #f3f4f6;
        color: #374151;
      }

      .dialog-btn-cancel:hover {
        background-color: #e5e7eb;
      }

      .dialog-btn-confirm {
        color: white;
      }

      .dialog-btn-info {
        background-color: #3b82f6;
      }

      .dialog-btn-info:hover {
        background-color: #2563eb;
      }

      .dialog-btn-warning {
        background-color: #f59e0b;
      }

      .dialog-btn-warning:hover {
        background-color: #d97706;
      }

      .dialog-btn-danger {
        background-color: #ef4444;
      }

      .dialog-btn-danger:hover {
        background-color: #dc2626;
      }

      @media (max-width: 640px) {
        .dialog-actions {
          flex-direction: column-reverse;
        }

        .dialog-btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  dialog: ConfirmDialogData | null = null;
  private subscription?: Subscription;

  constructor(private confirmDialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    this.subscription = this.confirmDialogService.dialog$.subscribe((dialog) => {
      this.dialog = dialog;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onConfirm(): void {
    if (this.dialog?.onConfirm) {
      this.dialog.onConfirm();
    }
  }

  onCancel(): void {
    if (this.dialog?.onCancel) {
      this.dialog.onCancel();
    }
  }

  onOverlayClick(): void {
    this.onCancel();
  }

  getIcon(type?: string): string {
    const icons = {
      info: 'ℹ',
      warning: '⚠',
      danger: '⚠',
    };
    return icons[type as keyof typeof icons] || icons.warning;
  }
}
