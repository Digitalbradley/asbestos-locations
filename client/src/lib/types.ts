export interface SearchResult {
  id: number;
  name: string;
  type: 'facility' | 'city' | 'state' | 'company';
  description?: string;
  url: string;
}

export interface ContactFormData {
  facilityId?: number;
  name: string;
  phone: string;
  email: string;
  message?: string;
}

export interface FilterOptions {
  facilityType?: string;
  operationalYears?: string;
  sortBy?: 'name' | 'city' | 'type';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}
