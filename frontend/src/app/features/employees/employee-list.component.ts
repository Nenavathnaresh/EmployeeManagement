import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeDTO, CreateEmployeeDTO, UpdateEmployeeDTO } from '../../core/models/employee.model';
import { PageResponse } from '../../core/models/api-response.model';
import { EmployeeSearchParams } from '../../core/models/query-params.model';

import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { EmployeeModalComponent } from '../../shared/components/employee-modal/employee-modal.component';
import { AuditModalComponent } from '../../shared/components/audit-modal/audit-modal.component';
import { ConfirmDialogComponent, DialogType } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    DataTableComponent,
    EmployeeModalComponent,
    AuditModalComponent,
    ConfirmDialogComponent,
    HasRoleDirective
  ],
  templateUrl: "./employee-list.component.html",
  styleUrl: "./employee-list.component.css"
})
export class EmployeeListComponent implements OnInit {
  employeeService = inject(EmployeeService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);

  queryParams: EmployeeSearchParams = {
    page: 0,
    size: 10,
    sortBy: 'id',
    direction: 'asc',
    search: '',
    department: '',
    designation: '',
    active: undefined,
    minSalary: undefined,
    maxSalary: undefined
  };

  pageData: PageResponse<EmployeeDTO> | null = null;
  loading = false;

  // Modals state
  isFormModalOpen = false;
  isAuditModalOpen = false;
  isConfirmOpen = false;
  selectedEmployee: EmployeeDTO | null = null;
  saving = false;
  confirming = false;

  // Confirm dialog properties
  confirmType: DialogType = 'soft-delete';
  confirmTitle = '';
  confirmMessage = '';
  confirmBtnText = '';
  pendingAction?: () => void;

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees(this.queryParams).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.data) {
          this.pageData = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFilterChange(changes: Partial<EmployeeSearchParams>): void {
    this.queryParams = {
      ...this.queryParams,
      ...changes
    };
    this.fetchEmployees();
  }

  onSortChange(event: { sortBy: string; direction: 'asc' | 'desc' }): void {
    this.queryParams.sortBy = event.sortBy;
    this.queryParams.direction = event.direction;
    this.fetchEmployees();
  }

  onPageChange(page: number): void {
    this.queryParams.page = page;
    this.fetchEmployees();
  }

  onPageSizeChange(size: number): void {
    this.queryParams.size = size;
    this.queryParams.page = 0;
    this.fetchEmployees();
  }

  openCreateModal(): void {
    this.selectedEmployee = null;
    this.isFormModalOpen = true;
  }

  openEditModal(emp: EmployeeDTO): void {
    this.selectedEmployee = emp;
    this.isFormModalOpen = true;
  }

  openAuditModal(emp: EmployeeDTO): void {
    this.selectedEmployee = emp;
    this.isAuditModalOpen = true;
  }

  onSaveEmployee(formValue: any): void {
    this.saving = true;
    if (this.selectedEmployee) {
      // Update
      const updateDto: UpdateEmployeeDTO = {
        id: this.selectedEmployee.id,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        designation: formValue.designation,
        salary: Number(formValue.salary),
        department: formValue.department,
        active: formValue.active ?? true,
        dateOfJoining: formValue.dateOfJoining
      };
      this.employeeService.updateEmployee(this.selectedEmployee.id, updateDto).subscribe({
        next: (res) => {
          this.saving = false;
          this.isFormModalOpen = false;
          this.notificationService.showSuccess('Employee Updated', `Employee #${this.selectedEmployee?.id} updated successfully.`);
          this.fetchEmployees();
        },
        error: () => this.saving = false
      });
    } else {
      // Create
      const createDto: CreateEmployeeDTO = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        designation: formValue.designation,
        salary: Number(formValue.salary),
        department: formValue.department,
        dateOfJoining: formValue.dateOfJoining
      };
      this.employeeService.createEmployee(createDto).subscribe({
        next: (res) => {
          console.log(res)
          this.saving = false;
          this.isFormModalOpen = false;
          this.notificationService.showSuccess('Employee Created', `Created employee ${createDto.firstName} ${createDto.lastName}`);
          this.fetchEmployees();
        },
        error: () => this.saving = false
      });
    }
  }

  openSoftDeleteDialog(emp: EmployeeDTO): void {
    this.selectedEmployee = emp;
    this.confirmType = 'soft-delete';
    this.confirmTitle = 'Confirm Delete';
    this.confirmMessage = `Are you sure you want to delete ${emp.firstName} ${emp.lastName} (#${emp.id})?`;
    this.confirmBtnText = 'Delete';
    this.pendingAction = () => {
      this.employeeService.softDeleteEmployee(emp.id).subscribe({
        next: () => {
          this.confirming = false;
          this.isConfirmOpen = false;
          this.notificationService.showWarning('Deleted', `Employee #${emp.id} has been deleted.`);
          this.fetchEmployees();
        },
        error: () => this.confirming = false
      });
    };
    this.isConfirmOpen = true;
  }

  openRestoreDialog(emp: EmployeeDTO): void {
    this.selectedEmployee = emp;
    this.confirmType = 'restore';
    this.confirmTitle = 'Restore Record';
    this.confirmMessage = `Restore employee ${emp.firstName} ${emp.lastName} (#${emp.id}) back to active status?`;
    this.confirmBtnText = 'Restore Record';
    this.pendingAction = () => {
      this.employeeService.restoreEmployee(emp.id).subscribe({
        next: () => {
          this.confirming = false;
          this.isConfirmOpen = false;
          this.notificationService.showSuccess('Record Restored', `Employee #${emp.id} restored successfully.`);
          this.fetchEmployees();
        },
        error: () => this.confirming = false
      });
    };
    this.isConfirmOpen = true;
  }

  openHardDeleteDialog(emp: EmployeeDTO): void {
    this.selectedEmployee = emp;
    this.confirmType = 'hard-delete';
    this.confirmTitle = 'PERMANENT Hard Delete';
    this.confirmMessage = `WARNING: Are you sure you want to PERMANENTLY PURGE employee #${emp.id} from the database?`;
    this.confirmBtnText = 'Purge Permanently';
    this.pendingAction = () => {
      this.employeeService.hardDeleteEmployee(emp.id).subscribe({
        next: () => {
          this.confirming = false;
          this.isConfirmOpen = false;
          this.notificationService.showError('Permanently Purged', `Employee #${emp.id} purged from system.`);
          this.fetchEmployees();
        },
        error: () => this.confirming = false
      });
    };
    this.isConfirmOpen = true;
  }

  executeConfirmAction(): void {
    if (this.pendingAction) {
      this.confirming = true;
      this.pendingAction();
    }
  }
}
