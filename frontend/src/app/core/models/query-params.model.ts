export interface EmployeeSearchParams {
  page: number;
  size: number;
  sortBy: string;
  direction: 'asc' | 'desc';
  search?: string;
  department?: string;
  designation?: string;
  active?: boolean;
  minSalary?: number;
  maxSalary?: number;
}
