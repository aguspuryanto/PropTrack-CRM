
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lead, LeadStatus, Property, Appointment, AppointmentStatus } from '../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
  leads: Lead[];
  properties: Property[];
  appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ leads, properties, appointments = [] }) => {
  const stats = [
    { label: 'Prospek Saya', value: leads.length, icon: 'fa-users', color: 'bg-blue-500' },
    { label: 'Unit Saya', value: properties.filter(p => p.status === 'Tersedia').length, icon: 'fa-home', color: 'bg-green-500' },
    { label: 'Hot Leads', value: leads.filter(l => l.status === LeadStatus.NEW).length, icon: 'fa-star', color: 'bg-yellow-500' },
    { label: 'Visit Terdekat', value: appointments.filter(a => a.status === AppointmentStatus.SCHEDULED).length, icon: 'fa-calendar-check', color: 'bg-indigo-500' },
  ];

  const chartData = Object.values(LeadStatus).map(status => ({
    name: status,
    value: leads.filter(l => l.status === status).length
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6', '#EF4444'];

  const upcomingVisits = [...appointments]
    .filter(a => a.status === AppointmentStatus.SCHEDULED && new Date(a.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ringkasan Performa</h1>
          <p className="text-gray-500 text-sm">Data yang ditampilkan disesuaikan dengan otoritas akun Anda.</p>
        </div>
        <Link to="/calendar" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1 mb-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
          Jadwal Hari Ini <i className="fas fa-arrow-right text-[10px]"></i>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl text-white shadow-lg shadow-gray-200`}>
                <i className={`fas ${stat.icon} text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Status Penjualan</h3>
              <div className="text-xs text-gray-400">Distribusi status prospek aktif</div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <i className="fas fa-clock text-indigo-500 text-sm"></i> Agenda Anda
            </h3>
            {upcomingVisits.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <i className="fas fa-calendar-alt text-3xl mb-3 block opacity-10"></i>
                <p className="text-xs font-medium">Tidak ada kunjungan dalam waktu dekat.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingVisits.map((apt) => {
                  const lead = leads.find(l => l.id === apt.leadId);
                  const date = new Date(apt.dateTime);
                  return (
                    <div key={apt.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{lead?.name}</p>
                      <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-1">
                        <i className="fas fa-map-marker-alt text-[8px]"></i>
                        {properties.find(p => p.id === apt.propertyId)?.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <Link to="/calendar" className="mt-6 w-full py-3 text-center border border-gray-100 text-xs font-bold text-gray-500 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
              Kelola Semua Jadwal
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-2">Asisten Follow-Up AI</h2>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Tingkatkan closing rate Anda dengan pesan personal yang dibuat khusus oleh AI berdasarkan karakteristik setiap prospek.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/leads" className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2 text-sm">
              <i className="fab fa-whatsapp"></i>
              Buka Manajemen Prospek
            </Link>
            <div className="flex items-center gap-2 text-xs text-indigo-200 font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              AI Model: Gemini 3 Flash
            </div>
          </div>
        </div>
        <i className="fas fa-robot absolute -right-4 -bottom-4 text-[12rem] text-white/5 rotate-12"></i>
      </div>
    </div>
  );
};

export default Dashboard;
