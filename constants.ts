
import { Property, Lead, LeadStatus, Appointment, AppointmentStatus, User, UserRole } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u-admin', name: 'Bapak CEO', email: 'admin@proptrack.com', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: 'u-agent-1', name: 'Rizky Pratama', email: 'rizky@proptrack.com', role: UserRole.AGENT, avatar: 'https://i.pravatar.cc/150?u=rizky' },
  { id: 'u-agent-2', name: 'Santi Wijaya', email: 'santi@proptrack.com', role: UserRole.AGENT, avatar: 'https://i.pravatar.cc/150?u=santi' },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    agentId: 'u-agent-1',
    title: 'Modern Cluster Green Valley',
    price: 1250000000,
    location: 'BSD City, Tangerang',
    description: 'Hunian modern dengan konsep green living. Dekat dengan akses tol dan pusat perbelanjaan.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    beds: 3,
    baths: 2,
    sqft: 90,
    status: 'Tersedia',
    floorPlan: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prop-2',
    agentId: 'u-agent-2',
    title: 'Penthouse Sudirman Suites',
    price: 4500000000,
    location: 'Jakarta Pusat',
    description: 'Luxury penthouse di jantung kota Jakarta dengan pemandangan skyline yang memukau.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    beds: 4,
    baths: 4,
    sqft: 210,
    status: 'Booking'
  },
  {
    id: 'prop-3',
    agentId: 'u-agent-1',
    title: 'Villa Cantik Canggu',
    price: 3200000000,
    location: 'Canggu, Bali',
    description: 'Investasi properti terbaik di Bali. Villa dengan kolam renang pribadi dan desain tropis modern.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    beds: 2,
    baths: 2,
    sqft: 150,
    status: 'Tersedia'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    agentId: 'u-agent-1',
    name: 'Andi Wijaya',
    phone: '6281234567890',
    email: 'andi@example.com',
    propertyId: 'prop-1',
    status: LeadStatus.NEW,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Tertarik dengan cicilan bertahap.'
  },
  {
    id: 'lead-2',
    agentId: 'u-agent-2',
    name: 'Siska Putri',
    phone: '6281122334455',
    email: 'siska@example.com',
    propertyId: 'prop-2',
    status: LeadStatus.FOLLOW_UP,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    notes: 'Sudah kirim brosur via email.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    agentId: 'u-agent-2',
    leadId: 'lead-2',
    propertyId: 'prop-2',
    dateTime: new Date(Date.now() + 86400000).toISOString(),
    status: AppointmentStatus.SCHEDULED,
    notes: 'Kunjungan pertama Siska untuk Penthouse'
  }
];
