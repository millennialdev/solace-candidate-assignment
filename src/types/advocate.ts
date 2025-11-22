export interface Advocate {
  id?: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: "MD" | "PhD" | "MSW";
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: Date;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdvocatesResponse {
  data: Advocate[];
  pagination?: PaginationInfo;
}
