import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeDTO } from '../../core/models/employee.model';
import { AuthService } from '../../core/services/auth.service';

interface DepartmentStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface SalaryTierStat {
  range: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div class="dashboard-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Dashboard</h1>
          <p class="page-subtitle">Real-time workforce analytics & organization metrics</p>
        </div>

        <a routerLink="/employees" class="btn btn-primary manage-btn">
          👥 Employee Directory ➔
        </a>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card glass-card">
          <div class="kpi-icon icon-primary">👥</div>
          <div class="kpi-info">
            <div class="kpi-label">Active Employees</div>
            <div class="kpi-value">{{ stats.activeCount }}</div>
            <div class="kpi-trend">Active workforce headcount</div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon icon-success">💰</div>
          <div class="kpi-info">
            <div class="kpi-label">Annual Payroll</div>
            <div class="kpi-value">{{ stats.totalPayroll | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="kpi-trend">Total annualized compensation</div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon icon-info">📊</div>
          <div class="kpi-info">
            <div class="kpi-label">Average Salary</div>
            <div class="kpi-value">{{ stats.avgSalary | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="kpi-trend">Mean pay across staff</div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon icon-purple">🏢</div>
          <div class="kpi-info">
            <div class="kpi-label">Departments</div>
            <div class="kpi-value">{{ stats.departmentCount }}</div>
            <div class="kpi-trend">Active operational units</div>
          </div>
        </div>
      </div>

      <!-- Analytics Row: Department Distribution & Salary Breakdown -->
      <div class="analytics-grid">
        <!-- Department Staff Distribution -->
        <div class="chart-card glass-card">
          <div class="card-header">
            <h3 class="card-title">🏢 Department Staff Allocation</h3>
            <span class="card-badge">{{ departmentStats.length }} Active Divisions</span>
          </div>

          <div class="chart-body">
            @for (dept of departmentStats; track dept.name) {
              <div class="stat-bar-group">
                <div class="bar-label-row">
                  <span class="dept-name">{{ dept.name }}</span>
                  <span class="dept-val"><strong>{{ dept.count }}</strong> staff ({{ dept.percentage }}%)</span>
                </div>
                <div class="progress-track">
                  <div 
                    class="progress-fill" 
                    [style.width.%]="dept.percentage"
                    [style.background]="dept.color"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Salary Tier Distribution -->
        <div class="chart-card glass-card">
          <div class="card-header">
            <h3 class="card-title">💵 Salary Tier Distribution</h3>
            <span class="card-badge">Compensation Ranges</span>
          </div>

          <div class="chart-body">
            @for (tier of salaryTiers; track tier.range) {
              <div class="stat-bar-group">
                <div class="bar-label-row">
                  <span class="tier-range">{{ tier.range }}</span>
                  <span class="tier-val"><strong>{{ tier.count }}</strong> staff ({{ tier.percentage }}%)</span>
                </div>
                <div class="progress-track">
                  <div 
                    class="progress-fill tier-fill" 
                    [style.width.%]="tier.percentage"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Recent Employee Quick Table -->
      <div class="recent-card glass-card">
        <div class="card-header">
          <h3 class="card-title">📋 Staff Directory Preview</h3>
          <a routerLink="/employees" class="view-all-link">View All ➔</a>
        </div>

        <div class="table-responsive">
          <table class="preview-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th class="text-right">Salary</th>
              </tr>
            </thead>
            <tbody>
              @for (emp of recentEmployees; track emp.id) {
                <tr>
                  <td>
                    <div class="emp-user-cell">
                      <div class="emp-avatar">{{ emp.firstName.charAt(0).toUpperCase() }}</div>
                      <div>
                        <div class="emp-name">{{ emp.firstName }} {{ emp.lastName }}</div>
                        <div class="emp-email">{{ emp.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="dept-badge">{{ emp.department || 'N/A' }}</span></td>
                  <td class="text-muted">{{ emp.designation || 'N/A' }}</td>
                  <td class="text-right font-mono">
                    {{ emp.salary | currency:'USD':'symbol':'1.0-0' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .page-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }

    .manage-btn {
      font-size: 0.85rem;
      padding: 0.6rem 1.1rem;
    }
    .manage-btn:hover {
     color:#fff;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }

    .kpi-card {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }

    .icon-primary { background: var(--primary-light); color: var(--primary); }
    .icon-success { background: var(--success-light); color: var(--success); }
    .icon-info { background: var(--info-light); color: var(--info); }
    .icon-purple { background: rgba(168, 85, 247, 0.15); color: #a855f7; }

    .kpi-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0.15rem 0;
    }

    .kpi-trend {
      font-size: 0.725rem;
      color: var(--text-muted);
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.25rem;
    }

    .chart-card {
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .card-badge {
      font-size: 0.725rem;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      background: var(--bg-surface-hover);
      color: var(--primary);
      border: 1px solid var(--border-color);
      font-weight: 600;
    }

    .chart-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-bar-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .bar-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-main);
    }

    .dept-name, .tier-range {
      font-weight: 600;
    }

    .dept-val, .tier-val {
      font-size: 0.775rem;
      color: var(--text-muted);
    }

    .progress-track {
      height: 8px;
      width: 100%;
      background: var(--bg-surface-hover);
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .tier-fill {
      background: linear-gradient(90deg, var(--primary) 0%, #a855f7 100%);
    }

    .recent-card {
      padding: 1.25rem 1.5rem;
    }

    .view-all-link {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary);
      text-decoration: none;
    }

    .table-responsive {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .preview-table {
      width: 100%;
      min-width: 550px;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .preview-table th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      border-bottom: 1px solid var(--border-color);
      white-space: nowrap;
    }

    .preview-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-color);
      vertical-align: middle;
      white-space: nowrap;
    }

    .emp-user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .emp-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .emp-name {
      font-weight: 600;
      color: var(--text-main);
      font-size: 0.85rem;
    }

    .emp-email {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .dept-badge {
      color: var(--primary);
      font-weight: 500;
    }

    .text-right { text-align: right; }
    .text-muted { color: var(--text-muted); }
    .font-mono { font-family: monospace; font-weight: 600; }

    @media (max-width: 768px) {
      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .recent-card {
        padding: 1rem 0.85rem;
      }

      .preview-table th,
      .preview-table td {
        padding: 0.6rem 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .recent-card {
        padding: 0.75rem 0.6rem;
      }

      .card-title {
        font-size: 0.925rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  employeeService = inject(EmployeeService);
  authService = inject(AuthService);

  stats = {
    activeCount: 0,
    totalPayroll: 0,
    avgSalary: 0,
    departmentCount: 0
  };

  departmentStats: DepartmentStat[] = [];
  salaryTiers: SalaryTierStat[] = [];
  recentEmployees: EmployeeDTO[] = [];

  private colorPalette: string[] = [
    '#6366f1', '#a855f7', '#ec4899', '#10b981',
    '#f59e0b', '#3b82f6', '#14b8a6', '#64748b'
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.employeeService.getEmployees({
      page: 0,
      size: 100,
      sortBy: 'id',
      direction: 'asc'
    }).subscribe(res => {
      if (res.success && res.data) {
        const content = res.data.content || [];
        const active = content.filter(e => !e.deleted);
        const totalPayroll = active.reduce((acc, e) => acc + (e.salary || 0), 0);
        const avgSalary = active.length > 0 ? Math.round(totalPayroll / active.length) : 0;

        // Group by Department
        const deptMap = new Map<string, number>();
        active.forEach(e => {
          const d = e.department || 'Unassigned';
          deptMap.set(d, (deptMap.get(d) || 0) + 1);
        });

        const totalActive = active.length || 1;
        this.departmentStats = Array.from(deptMap.entries()).map(([name, count], index) => ({
          name,
          count,
          percentage: Math.round((count / totalActive) * 100),
          color: this.colorPalette[index % this.colorPalette.length]
        })).sort((a, b) => b.count - a.count);

        // Group by Salary Tiers
        let tier1 = 0; // < 50k
        let tier2 = 0; // 50k - 80k
        let tier3 = 0; // 80k - 120k
        let tier4 = 0; // > 120k

        active.forEach(e => {
          const s = e.salary || 0;
          if (s < 50000) tier1++;
          else if (s <= 80000) tier2++;
          else if (s <= 120000) tier3++;
          else tier4++;
        });

        this.salaryTiers = [
          { range: '< $50,000', count: tier1, percentage: Math.round((tier1 / totalActive) * 100) },
          { range: '$50,000 - $80,000', count: tier2, percentage: Math.round((tier2 / totalActive) * 100) },
          { range: '$80,000 - $120,000', count: tier3, percentage: Math.round((tier3 / totalActive) * 100) },
          { range: '> $120,000', count: tier4, percentage: Math.round((tier4 / totalActive) * 100) }
        ];

        this.stats = {
          activeCount: active.length,
          totalPayroll: totalPayroll,
          avgSalary: avgSalary,
          departmentCount: deptMap.size
        };

        this.recentEmployees = active.slice(0, 5);
      }
    });
  }
}
