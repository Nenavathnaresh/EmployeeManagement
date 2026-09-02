import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSearchParams } from '../../../core/models/query-params.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-filter-card glass-card">
      <div class="filter-row">
        <!-- Keyword Search Input -->
        <div class="search-input-wrapper flex-search">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="form-control search-field" 
            placeholder="Search (Name, Email, Designation)..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
          />
          @if (searchQuery) {
            <button class="clear-btn" (click)="clearSearch()">✕</button>
          }
        </div>

        <!-- Department Filter -->
        <div class="filter-wrapper">
          <select 
            class="form-select" 
            [(ngModel)]="selectedDepartment"
            (change)="onFilterChange()"
          >
            <option value="">All Departments</option>
            @for (dept of departments; track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>
        </div>

        <!-- Designation Filter -->
        <div class="filter-wrapper">
          <input 
            type="text"
            class="form-control"
            placeholder="Designation..."
            [(ngModel)]="selectedDesignation"
            (input)="onSearchChange()"
          />
        </div>

        <!-- Active Status Filter -->
        <div class="filter-wrapper">
          <select 
            class="form-select" 
            [(ngModel)]="selectedActive"
            (change)="onFilterChange()"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        <!-- Salary Range Filter -->
        <div class="filter-wrapper salary-group">
          <input 
            type="number"
            class="form-control salary-input"
            placeholder="Min $"
            [(ngModel)]="minSalary"
            (input)="onSearchChange()"
          />
          <span class="salary-dash">-</span>
          <input 
            type="number"
            class="form-control salary-input"
            placeholder="Max $"
            [(ngModel)]="maxSalary"
            (input)="onSearchChange()"
          />
        </div>

        <!-- Reset Button -->
        <button class="btn btn-outline btn-sm reset-btn" (click)="resetFilters()" title="Reset all filters">
          🔄 Reset
        </button>
      </div>
    </div>
  `,
  styles: [`
    .search-filter-card {
      padding: 1rem 1.25rem;
      margin-bottom: 1.25rem;
    }

    .filter-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .flex-search {
      flex: 1 1 240px;
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9rem;
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-field {
      padding-left: 2.3rem;
      padding-right: 2.2rem;
      width: 100%;
    }

    .clear-btn {
      position: absolute;
      right: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0.2rem;
    }

    .filter-wrapper {
      flex: 0 1 160px;
    }

    .filter-wrapper select,
    .filter-wrapper input {
      width: 100%;
    }

    .salary-group {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      flex: 0 1 200px;
    }

    .salary-input {
      padding: 0.4rem 0.5rem;
      font-size: 0.8rem;
    }

    .salary-dash {
      color: var(--text-muted);
      font-weight: bold;
    }

    .reset-btn {
      white-space: nowrap;
      margin-left: auto;
    }

    @media (max-width: 768px) {
      .search-filter-card {
        padding: 0.85rem 1rem;
      }

      .filter-row {
        gap: 0.65rem;
      }

      .flex-search {
        flex: 1 1 100%;
      }

      .filter-wrapper {
        flex: 1 1 calc(50% - 0.35rem);
      }

      .salary-group {
        flex: 1 1 100%;
      }

      .reset-btn {
        margin-left: 0;
        width: 100%;
        justify-content: center;
        padding: 0.6rem;
      }
    }

    @media (max-width: 480px) {
      .filter-wrapper {
        flex: 1 1 100%;
      }
    }
  `]
})
export class SearchBarComponent {
  @Input() initialParams!: EmployeeSearchParams;
  @Output() filterChange = new EventEmitter<Partial<EmployeeSearchParams>>();

  searchQuery = '';
  selectedDepartment = '';
  selectedDesignation = '';
  selectedActive = '';
  minSalary?: number;
  maxSalary?: number;

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

  private debounceTimer: any;

  onSearchChange(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.emitChange();
    }, 300);
  }

  onFilterChange(): void {
    this.emitChange();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.emitChange();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedDepartment = '';
    this.selectedDesignation = '';
    this.selectedActive = '';
    this.minSalary = undefined;
    this.maxSalary = undefined;
    this.emitChange();
  }

  private emitChange(): void {
    let activeVal: boolean | undefined = undefined;
    if (this.selectedActive === 'true') activeVal = true;
    if (this.selectedActive === 'false') activeVal = false;

    this.filterChange.emit({
      search: this.searchQuery || undefined,
      department: this.selectedDepartment || undefined,
      designation: this.selectedDesignation || undefined,
      active: activeVal,
      minSalary: this.minSalary !== null && this.minSalary !== undefined && !isNaN(this.minSalary) ? Number(this.minSalary) : undefined,
      maxSalary: this.maxSalary !== null && this.maxSalary !== undefined && !isNaN(this.maxSalary) ? Number(this.maxSalary) : undefined,
      page: 0
    });
  }
}
