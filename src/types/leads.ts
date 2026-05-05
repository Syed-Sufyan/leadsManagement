export type LeadStatus = 'Hot' | 'Cold' | 'Moderate' | 'Dead' | 'Closed';

export interface Ilead {
  id: string;
  name: string;
  status: LeadStatus;
  phone: number;
  date: number;
  description: string;
  Lead: string;
  companyName?: string;
  projectName?: string;
}
