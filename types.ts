
export enum LeadStatus {
  NEW = 'Baru',
  CONTACTED = 'Dihubungi',
  FOLLOW_UP = 'Follow Up',
  VISIT = 'Visit Lokasi',
  CLOSED = 'Closed/Deal',
  LOST = 'Batal'
}

export enum AppointmentStatus {
  SCHEDULED = 'Terjadwal',
  COMPLETED = 'Selesai',
  CANCELLED = 'Dibalitalkan'
}

export enum UserRole {
  ADMIN = 'Administrator',
  AGENT = 'Agen'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Property {
  id: string;
  agentId: string; // ID of the agent managing this property
  title: string;
  price: number;
  location: string;
  description: string;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'Tersedia' | 'Terjual' | 'Booking';
  floorPlan?: string;
  gallery?: string[];
}

export interface Lead {
  id: string;
  agentId: string; // ID of the agent who owns this lead
  name: string;
  phone: string;
  email: string;
  propertyId: string;
  status: LeadStatus;
  lastFollowUp?: string;
  createdAt: string;
  notes: string;
}

export interface Appointment {
  id: string;
  agentId: string;
  leadId: string;
  propertyId: string;
  dateTime: string;
  status: AppointmentStatus;
  notes: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
