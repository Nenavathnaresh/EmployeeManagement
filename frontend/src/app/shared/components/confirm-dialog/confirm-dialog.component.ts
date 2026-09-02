import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DialogType = 'soft-delete' | 'restore' | 'hard-delete';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-box confirm-box">
          <div class="modal-header">
            <div class="confirm-title-box">
              <span class="type-icon">
                @switch (type) {
                  @case ('soft-delete') { 🗑️ }
                  @case ('restore') { ↩️ }
                  @case ('hard-delete') { ⚠️ }
                }
              </span>
              <h3 class="modal-title">{{ title }}</h3>
            </div>
            <button class="btn-icon" (click)="cancel.emit()">✕</button>
          </div>

          <div class="modal-body">
            <p class="confirm-message">{{ message }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="cancel.emit()">Cancel</button>
            <button 
              class="btn" 
              [ngClass]="type === 'restore' ? 'btn-success' : 'btn-danger'" 
              [disabled]="loading"
              (click)="confirm.emit()"
            >
              @if (loading) {
                Processing...
              } @else {
                {{ confirmBtnText }}
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-box {
      max-width: 440px;
    }

    .confirm-title-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .type-icon {
      font-size: 1.25rem;
    }

    .confirm-message {
      font-size: 0.9rem;
      color: var(--text-main);
      line-height: 1.5;
    }

    @media (max-width: 520px) {
      .confirm-box {
        width: calc(100% - 1.5rem);
        margin: 0.75rem;
        padding: 1rem;
      }
      .modal-footer {
        flex-direction: column-reverse;
        gap: 0.5rem;
      }
      .modal-footer button {
        width: 100%;
        padding: 0.7rem;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() type: DialogType = 'soft-delete';
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmBtnText = 'Confirm';
  @Input() loading = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cancel.emit();
    }
  }
}
