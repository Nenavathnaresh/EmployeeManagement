import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeDTO } from '../../../core/models/employee.model';

@Component({
  selector: 'app-audit-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './audit-modal.component.html',
  styleUrl: './audit-modal.component.css'
})
export class AuditModalComponent {
  @Input() isOpen = false;
  @Input() employee: EmployeeDTO | null = null;
  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
