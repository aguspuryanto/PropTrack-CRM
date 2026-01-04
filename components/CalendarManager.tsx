
import React, { useState } from 'react';
import { Appointment, Lead, Property, AppointmentStatus } from '../types';
import { generateAppointmentInvitation } from '../services/geminiService';

interface CalendarManagerProps {
  appointments: Appointment[];
  leads: Lead[];
  properties: Property[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
}

const CalendarManager: React.FC<CalendarManagerProps> = ({ appointments, leads, properties, onUpdateAppointmentStatus }) => {
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [sendingInvite, setSendingInvite] = useState<string | null>(null);

  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  const filteredAppointments = filterStatus === 'ALL' 
    ? sortedAppointments 
    : sortedAppointments.filter(a => a.status === filterStatus);

  const handleSendInvite = async (apt: Appointment) => {
    setSendingInvite(apt.id);
    const lead = leads.find(l => l.id === apt.leadId);
    const prop = properties.find(p => p.id === apt.propertyId);
    
    if (lead && prop) {
      const message = await generateAppointmentInvitation(lead, prop, apt);
      const phone = lead.phone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
    setSendingInvite(null);
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return 'bg-indigo-100 text-indigo-700';
      case AppointmentStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda Kunjungan</h1>
          <p className="text-gray-500 text-sm">Kelola jadwal visit properti dengan calon pembeli.</p>
        </div>
        <div className="flex gap-2">
          {['ALL', ...Object.values(AppointmentStatus)].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'ALL' ? 'Semua' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
            <i className="fas fa-calendar-day text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Tidak ada jadwal ditemukan untuk filter ini.</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const lead = leads.find(l => l.id === apt.leadId);
            const prop = properties.find(p => p.id === apt.propertyId);
            const date = new Date(apt.dateTime);
            
            return (
              <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl text-center min-w-[70px]">
                    <div className="text-xs font-bold uppercase">{date.toLocaleDateString('id-ID', { month: 'short' })}</div>
                    <div className="text-2xl font-bold">{date.getDate()}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(apt.status)}`}>
                        {apt.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{lead?.name || 'Unknown Lead'}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <i className="fas fa-home text-xs"></i> {prop?.title || 'Unknown Property'}
                    </p>
                    {apt.notes && <p className="text-xs text-gray-400 mt-2 italic">"{apt.notes}"</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                  <button 
                    onClick={() => handleSendInvite(apt)}
                    disabled={sendingInvite === apt.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors"
                  >
                    {sendingInvite === apt.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fab fa-whatsapp"></i>
                    )}
                    Undangan WA
                  </button>
                  
                  <div className="flex-1 md:flex-none relative group">
                    <select
                      value={apt.status}
                      onChange={(e) => onUpdateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                      className="w-full bg-gray-50 border-transparent text-gray-600 rounded-xl text-sm font-semibold focus:ring-indigo-500"
                    >
                      {Object.values(AppointmentStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CalendarManager;
