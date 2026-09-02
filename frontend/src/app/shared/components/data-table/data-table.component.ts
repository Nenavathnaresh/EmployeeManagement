import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { EmployeeDTO } from '../../../core/models/employee.model';
import { PageResponse } from '../../../core/models/api-response.model';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, HasRoleDirective],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() pageData!: PageResponse<EmployeeDTO> | null;
  @Input() loading = false;
  @Input() sortBy = 'id';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() direction: 'asc' | 'desc' = 'asc';

  @Output() sortChange = new EventEmitter<{ sortBy: string; direction: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() edit = new EventEmitter<EmployeeDTO>();
  @Output() softDelete = new EventEmitter<EmployeeDTO>();
  @Output() restore = new EventEmitter<EmployeeDTO>();
  @Output() hardDelete = new EventEmitter<EmployeeDTO>();
  @Output() viewAudit = new EventEmitter<EmployeeDTO>();

  get activeDirection(): 'asc' | 'desc' {
    return this.direction || this.sortDirection || 'asc';
  }

  ngOnInit() {
    console.log(this.pageData)
  }

  sort(field: string): void {
    let dir: 'asc' | 'desc' = 'asc';
    if (this.sortBy === field) {
      dir = this.activeDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortChange.emit({ sortBy: field, direction: dir });
  }

  changePage(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(event: Event): void {
    const size = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSizeChange.emit(size);
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
