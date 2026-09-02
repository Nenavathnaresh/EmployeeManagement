import { JpaAuditMetadata } from './audit.model';

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'TERMINATED';

export interface EmployeeDTO extends Partial<JpaAuditMetadata> {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  salary: number;
  department: string;
  dateOfJoining: string;
  active?: boolean;
  deleted?: boolean;
  status?: EmployeeStatus;
  role?: string;
  employeeId?: string;
}

export interface CreateEmployeeDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  salary: number;
  department: string;
  dateOfJoining: string;
}

export interface UpdateEmployeeDTO {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  salary: number;
  department: string;
  active?: boolean;
  dateOfJoining: string;
}
