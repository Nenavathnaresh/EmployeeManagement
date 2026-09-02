import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeDTO, CreateEmployeeDTO, UpdateEmployeeDTO } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-modal.component.html',
  styles: [`
    .form-row {
      display: flex;
      gap: 1rem;
    }

    .flex-1 { flex: 1; min-width: 0; }
    .flex-2 { flex: 2; min-width: 0; }

    @media (max-width: 640px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .modal-box {
        width: calc(100% - 1.5rem);
        max-height: 92vh;
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
export class EmployeeModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() employee: EmployeeDTO | null = null;
  @Input() saving = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateEmployeeDTO | UpdateEmployeeDTO>();

  form!: FormGroup;

  departments: string[] = [
    'IT',
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Product',
    'Operations'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] || changes['isOpen']) {
      this.populateForm();
    }
  }

  get isEditMode(): boolean {
    return !!this.employee;
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      designation: ['', [Validators.required]],
      salary: [null, [Validators.required, Validators.min(1)]],
      department: ['IT', [Validators.required]],
      dateOfJoining: [new Date().toISOString().substring(0, 10), [Validators.required]],
      active: [true]
    });
  }

  private populateForm(): void {
    if (!this.form) this.initForm();

    if (this.employee) {
      const joinDate = this.employee.dateOfJoining || (this.employee as any).joiningDate;
      const formattedDate = joinDate ? joinDate.substring(0, 10) : new Date().toISOString().substring(0, 10);

      this.form.patchValue({
        firstName: this.employee.firstName || '',
        lastName: this.employee.lastName || '',
        email: this.employee.email || '',
        phoneNumber: this.employee.phoneNumber || (this.employee as any).phone || '',
        department: this.employee.department || 'IT',
        designation: this.employee.designation || '',
        salary: this.employee.salary ?? null,
        dateOfJoining: formattedDate,
        active: this.employee.active ?? !this.employee.deleted
      });
    } else {
      this.form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        department: 'IT',
        designation: '',
        salary: null,
        dateOfJoining: new Date().toISOString().substring(0, 10),
        active: true
      });
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
