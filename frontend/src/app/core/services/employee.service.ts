import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, throwError, delay, map } from 'rxjs';
import { EmployeeDTO, CreateEmployeeDTO, UpdateEmployeeDTO } from '../models/employee.model';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { EmployeeSearchParams } from '../models/query-params.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private get apiUrl(): string {
    return environment.api?.employees || '/api/v1/employees';
  }

  // Signals for local state management & mock data persistence
  private mockEmployees = signal<EmployeeDTO[]>(this.seedMockData());

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getEmployees(params: EmployeeSearchParams): Observable<ApiResponse<PageResponse<EmployeeDTO>>> {
    let httpParams = new HttpParams()
      .set('page', (params.page || 0).toString())
      .set('size', (params.size || 10).toString())
      .set('sortBy', params.sortBy || 'id')
      .set('direction', params.direction || 'asc');

    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }
    if (params.department) {
      httpParams = httpParams.set('department', params.department);
    }
    if (params.designation) {
      httpParams = httpParams.set('designation', params.designation);
    }
    if (params.active !== undefined && params.active !== null) {
      httpParams = httpParams.set('active', params.active.toString());
    }
    if (params.minSalary !== undefined && params.minSalary !== null) {
      httpParams = httpParams.set('minSalary', params.minSalary.toString());
    }
    if (params.maxSalary !== undefined && params.maxSalary !== null) {
      httpParams = httpParams.set('maxSalary', params.maxSalary.toString());
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(res => this.normalizePageResponse(res, params)),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          this.authService.isMockMode.set(true);
          return of(this.getMockPaginatedEmployees(params)).pipe(delay(300));
        }
        return throwError(() => err);
      })
    );
  }

  getEmployeeById(id: number): Observable<ApiResponse<EmployeeDTO>> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (res && res.success !== undefined && res.data) {
          return res as ApiResponse<EmployeeDTO>;
        }
        return {
          success: true,
          message: 'Employee retrieved successfully',
          data: res as EmployeeDTO,
          timestamp: new Date().toISOString()
        };
      }),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          const found = this.mockEmployees().find(e => e.id === Number(id));
          if (found) {
            return of({
              success: true,
              message: 'Employee retrieved successfully (Mock)',
              data: found,
              timestamp: new Date().toISOString()
            });
          }
        }
        return throwError(() => err);
      })
    );
  }

  createEmployee(dto: CreateEmployeeDTO): Observable<ApiResponse<EmployeeDTO>> {
    const formattedJoiningDate = dto.dateOfJoining
      ? (dto.dateOfJoining.includes('T') ? dto.dateOfJoining : `${dto.dateOfJoining}T00:00:00`)
      : new Date().toISOString();

    const payload = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      designation: dto.designation,
      salary: Number(dto.salary),
      department: dto.department,
      dateOfJoining: formattedJoiningDate
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(res => {
        if (res && res.success !== undefined) {
          return res as ApiResponse<EmployeeDTO>;
        }
        return {
          success: true,
          message: 'Employee created successfully',
          data: res as EmployeeDTO,
          timestamp: new Date().toISOString()
        };
      }),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          const currentUser = this.authService.currentUser()?.username || 'system_admin';
          const now = new Date().toISOString();
          const newEmp: EmployeeDTO = {
            id: Math.max(0, ...this.mockEmployees().map(e => e.id)) + 1,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            department: dto.department,
            designation: dto.designation,
            salary: Number(dto.salary),
            dateOfJoining: formattedJoiningDate,
            active: true,
            deleted: false,
            createdBy: currentUser,
            createdAt: now,
            updatedBy: currentUser,
            updatedAt: now
          };
          this.mockEmployees.update(list => [newEmp, ...list]);
          return of({
            success: true,
            message: 'Employee created successfully (Mock Mode)',
            data: newEmp,
            timestamp: now
          });
        }
        return throwError(() => err);
      })
    );
  }

  updateEmployee(id: number, dto: UpdateEmployeeDTO): Observable<ApiResponse<EmployeeDTO>> {
    const formattedJoiningDate = dto.dateOfJoining
      ? (dto.dateOfJoining.includes('T') ? dto.dateOfJoining : `${dto.dateOfJoining}T00:00:00`)
      : new Date().toISOString();

    const payload = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      designation: dto.designation,
      salary: Number(dto.salary),
      department: dto.department,
      active: dto.active ?? true,
      dateOfJoining: formattedJoiningDate
    };

    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      catchError(err => {
        console.log(err)
        if (err.status === 405) {
          return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
        }
        return throwError(() => err);
      }),
      map(res => {
        console.log(res)
        if (res && res.success !== undefined) {
          console.log(res)
          return res as ApiResponse<EmployeeDTO>;
        }
        console.log(res)
        return {
          success: true,
          message: 'Employee updated successfully',
          data: res as EmployeeDTO,
          timestamp: new Date().toISOString()
        };
      }),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          const currentUser = this.authService.currentUser()?.username || 'system_admin';
          const now = new Date().toISOString();
          let updated: EmployeeDTO = {
            id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            department: dto.department,
            designation: dto.designation,
            salary: Number(dto.salary),
            dateOfJoining: formattedJoiningDate,
            active: dto.active ?? true
          };

          this.mockEmployees.update(list => list.map(e => {
            if (e.id === id) {
              updated = {
                ...e,
                ...dto,
                salary: Number(dto.salary),
                dateOfJoining: formattedJoiningDate,
                active: dto.active ?? true,
                updatedBy: currentUser,
                updatedAt: now
              };
              return updated;
            }
            return e;
          }));

          return of({
            success: true,
            message: 'Employee updated successfully (Mock Mode)',
            data: updated,
            timestamp: now
          });
        }
        return throwError(() => err);
      })
    );
  }

  softDeleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (res && res.success !== undefined) return res;
        return {
          success: true,
          message: 'Employee deleted successfully',
          data: undefined as any,
          timestamp: new Date().toISOString()
        };
      }),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          const currentUser = this.authService.currentUser()?.username || 'system_admin';
          const now = new Date().toISOString();
          this.mockEmployees.update(list => list.map(e => {
            if (e.id === id) {
              return { ...e, deleted: true, updatedBy: currentUser, updatedAt: now };
            }
            return e;
          }));
          return of({
            success: true,
            message: 'Employee soft-deleted successfully (Mock Mode)',
            data: undefined as any,
            timestamp: now
          });
        }
        return throwError(() => err);
      })
    );
  }

  restoreEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/restore`, {}).pipe(
      map(res => {
        if (res && res.success !== undefined) return res;
        return {
          success: true,
          message: 'Employee restored successfully',
          data: undefined as any,
          timestamp: new Date().toISOString()
        };
      }),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          const currentUser = this.authService.currentUser()?.username || 'system_admin';
          const now = new Date().toISOString();
          this.mockEmployees.update(list => list.map(e => {
            if (e.id === id) {
              return { ...e, deleted: false, updatedBy: currentUser, updatedAt: now };
            }
            return e;
          }));
          return of({
            success: true,
            message: 'Employee restored successfully (Mock Mode)',
            data: undefined as any,
            timestamp: now
          });
        }
        return throwError(() => err);
      })
    );
  }

  hardDeleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/permanent`).pipe(
      map(res => {
        if (res && res.success !== undefined) return res;
        return {
          success: true,
          message: 'Employee permanently purged',
          data: undefined as any,
          timestamp: new Date().toISOString()
        };
      }),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          this.mockEmployees.update(list => list.filter(e => e.id !== id));
          return of({
            success: true,
            message: 'Employee permanently deleted (Mock Mode)',
            data: undefined as any,
            timestamp: new Date().toISOString()
          });
        }
        return throwError(() => err);
      })
    );
  }

  // Normalizer to handle ApiResponse<PageResponse<T>>, raw Spring Data Page<T>, or raw Array
  private normalizePageResponse(res: any, params: EmployeeSearchParams): ApiResponse<PageResponse<EmployeeDTO>> {
    const timestamp = new Date().toISOString();

    // 1. Wrapped ApiResponse format
    if (res && res.success !== undefined && res.data) {
      if (res.data.content && Array.isArray(res.data.content)) {
        return {
          ...res,
          data: {
            content: res.data.content,
            pageNumber: res.data.pageNumber ?? res.data.number ?? params.page,
            pageSize: res.data.pageSize ?? res.data.size ?? params.size,
            totalElements: res.data.totalElements ?? res.data.content.length,
            totalPages: res.data.totalPages ?? 1,
            first: res.data.first ?? (params.page === 0),
            last: res.data.last ?? true,
            numberOfElements: res.data.numberOfElements ?? res.data.content.length,
            empty: res.data.empty ?? (res.data.content.length === 0)
          }
        };
      }
    }

    // 2. Direct Spring Data Page<T> format (unwrapped)
    if (res && Array.isArray(res.content)) {
      const pageNum = res.number ?? res.pageNumber ?? params.page;
      const pSize = res.size ?? res.pageSize ?? params.size;
      const totalEl = res.totalElements ?? res.content.length;
      const totalP = (res.totalPages ?? Math.ceil(totalEl / pSize)) || 1;

      return {
        success: true,
        message: 'Employees retrieved successfully',
        timestamp,
        data: {
          content: res.content,
          pageNumber: pageNum,
          pageSize: pSize,
          totalElements: totalEl,
          totalPages: totalP,
          first: res.first ?? (pageNum === 0),
          last: res.last ?? (pageNum >= totalP - 1),
          numberOfElements: res.numberOfElements ?? res.content.length,
          empty: res.empty ?? (res.content.length === 0)
        }
      };
    }

    // 3. Direct Array response format
    if (Array.isArray(res)) {
      const pageNum = params.page || 0;
      const pSize = params.size || 10;
      const totalEl = res.length;
      const totalP = Math.ceil(totalEl / pSize) || 1;
      const paginated = res.slice(pageNum * pSize, (pageNum + 1) * pSize);

      return {
        success: true,
        message: 'Employees retrieved successfully',
        timestamp,
        data: {
          content: paginated,
          pageNumber: pageNum,
          pageSize: pSize,
          totalElements: totalEl,
          totalPages: totalP,
          first: pageNum === 0,
          last: pageNum >= totalP - 1,
          numberOfElements: paginated.length,
          empty: paginated.length === 0
        }
      };
    }

    // Fallback empty page response
    return {
      success: true,
      message: 'Employees retrieved successfully',
      timestamp,
      data: {
        content: [],
        pageNumber: 0,
        pageSize: params.size || 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
        empty: true
      }
    };
  }

  // Fallback JPQL specification search & page calculations in client side mock mode
  private getMockPaginatedEmployees(params: EmployeeSearchParams): ApiResponse<PageResponse<EmployeeDTO>> {
    let list = [...this.mockEmployees()];

    // Active filter logic
    if (params.active !== undefined && params.active !== null) {
      list = list.filter(e => params.active ? !e.deleted : e.deleted);
    }

    // Search filter
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(e =>
        e.firstName?.toLowerCase().includes(q) ||
        e.lastName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.designation?.toLowerCase().includes(q) ||
        e.department?.toLowerCase().includes(q) ||
        (e.phoneNumber && e.phoneNumber.includes(q))
      );
    }

    // Department filter
    if (params.department) {
      list = list.filter(e => e.department === params.department);
    }

    // Designation filter
    if (params.designation) {
      list = list.filter(e => e.designation?.toLowerCase().includes(params.designation!.toLowerCase()));
    }

    // Min Salary filter
    if (params.minSalary !== undefined && params.minSalary !== null && !isNaN(params.minSalary)) {
      list = list.filter(e => e.salary >= params.minSalary!);
    }

    // Max Salary filter
    if (params.maxSalary !== undefined && params.maxSalary !== null && !isNaN(params.maxSalary)) {
      list = list.filter(e => e.salary <= params.maxSalary!);
    }

    // Sorting logic
    const field = (params.sortBy || 'id') as keyof EmployeeDTO;
    const dir = params.direction === 'desc' ? -1 : 1;

    list.sort((a, b) => {
      let valA = a[field] ?? '';
      let valB = b[field] ?? '';
      if (typeof valA === 'string') valA = (valA as string).toLowerCase();
      if (typeof valB === 'string') valB = (valB as string).toLowerCase();

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    // Pagination logic
    const totalElements = list.length;
    const pageNumber = params.page;
    const pageSize = params.size;
    const totalPages = Math.ceil(totalElements / pageSize) || 1;
    const startIndex = pageNumber * pageSize;
    const paginatedContent = list.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      message: 'Employees fetched successfully (Mock Engine)',
      timestamp: new Date().toISOString(),
      data: {
        content: paginatedContent,
        pageNumber,
        pageSize,
        totalElements,
        totalPages,
        first: pageNumber === 0,
        last: pageNumber >= totalPages - 1,
        numberOfElements: paginatedContent.length,
        empty: paginatedContent.length === 0,
        sort: { sorted: true, unsorted: false, empty: false }
      }
    };
  }

  private seedMockData(): EmployeeDTO[] {
    const dates = [
      '2024-01-15T09:30:00.000Z',
      '2024-02-20T14:15:00.000Z',
      '2024-03-10T11:00:00.000Z'
    ];

    return [
      {
        id: 1,
        employeeId: 'EMP-1001',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 'sarah.jenkins@enterprise.com',
        phoneNumber: '9854589001',
        department: 'IT',
        designation: 'Senior Lead Architect',
        salary: 145000,
        status: 'ACTIVE',
        dateOfJoining: '2022-03-15T00:00:00',
        role: 'ADMIN',
        deleted: false,
        createdBy: 'system_admin',
        createdAt: dates[0],
        updatedBy: 'system_admin',
        updatedAt: dates[1]
      },
      {
        id: 2,
        employeeId: 'EMP-1002',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@enterprise.com',
        phoneNumber: '9854589002',
        department: 'IT',
        designation: 'Software Engineer',
        salary: 115000,
        status: 'ACTIVE',
        dateOfJoining: '2023-01-10T00:00:00',
        role: 'USER',
        deleted: false,
        createdBy: 'hr_manager',
        createdAt: dates[1],
        updatedBy: 'hr_manager',
        updatedAt: dates[2]
      }
    ];
  }
}
