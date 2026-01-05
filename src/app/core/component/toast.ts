import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts; trackBy: trackByToastId"
        [class]="'toast toast-' + toast.type"
      >
        <div class="toast-icon">
          <span>{{ getIcon(toast.type) }}</span>
        </div>
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button
          class="toast-close"
          (click)="removeToast(toast.id)"
          aria-label="Cerrar notificación"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 400px;
        pointer-events: none;
      }

      @media (max-width: 640px) {
        .toast-container {
          left: 1rem;
          right: 1rem;
          max-width: none;
        }
      }

      .toast {
        display: flex;
        align-items: start;
        gap: 0.75rem;
        padding: 1rem;
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        pointer-events: auto;
        animation: slideIn 0.3s ease-out forwards;
        border-left: 4px solid;
        min-width: 300px;
        opacity: 1;
        transform: translateX(0);
      }

      @media (max-width: 640px) {
        .toast {
          min-width: auto;
        }
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast-success {
        border-left-color: #10b981;
        background: linear-gradient(to right, #f0fdf4, #ffffff);
      }

      .toast-error {
        border-left-color: #ef4444;
        background: linear-gradient(to right, #fef2f2, #ffffff);
      }

      .toast-warning {
        border-left-color: #f59e0b;
        background: linear-gradient(to right, #fffbeb, #ffffff);
      }

      .toast-info {
        border-left-color: #3b82f6;
        background: linear-gradient(to right, #eff6ff, #ffffff);
      }

      .toast-icon {
        flex-shrink: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        line-height: 1;
      }

      .toast-success .toast-icon {
        color: #10b981;
      }

      .toast-error .toast-icon {
        color: #ef4444;
      }

      .toast-warning .toast-icon {
        color: #f59e0b;
      }

      .toast-info .toast-icon {
        color: #3b82f6;
      }

      .toast-content {
        flex: 1;
        min-width: 0;
      }

      .toast-message {
        margin: 0;
        color: #374151;
        font-size: 0.875rem;
        line-height: 1.5;
        font-weight: 500;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .toast-close {
        flex-shrink: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s ease;
        padding: 0;
        line-height: 1;
        margin: 0;
      }

      .toast-close:hover {
        color: #4b5563;
      }

      .toast-close:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
        color: #4b5563;
      }
    `,
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getIcon(type: string): string {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  trackByToastId(index: number, toast: Toast): string {
    return toast.id;
  }
}
