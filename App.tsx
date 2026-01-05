
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import LeadsManager from './components/LeadsManager';
import PropertyInventory from './components/PropertyInventory';
import PropertyLandingPage from './components/PropertyLandingPage';
import CalendarManager from './components/CalendarManager';
import LandingPageManager from './components/LandingPageManager';
import EditLandingPage from './components/EditLandingPage';
import Auth from './components/Auth';
import { Lead, LeadStatus, Property, Appointment, AppointmentStatus, User, UserRole } from './types';
import { INITIAL_PROPERTIES, INITIAL_LEADS, INITIAL_APPOINTMENTS } from './constants';

const ProtectedRoute: React.FC<{ user: User | null; children: React.ReactNode }> = ({ user, children }) => {
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('proptrack_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });
  
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('proptrack_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('proptrack_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [scheduleModalLead, setScheduleModalLead] = useState<Lead | null>(null);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', notes: '' });

  useEffect(() => {
    localStorage.setItem('proptrack_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('proptrack_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('proptrack_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    const savedUser = localStorage.getItem('proptrack_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'proptrack_leads' && e.newValue) setLeads(JSON.parse(e.newValue));
      if (e.key === 'proptrack_properties' && e.newValue) setProperties(JSON.parse(e.newValue));
      if (e.key === 'proptrack_appointments' && e.newValue) setAppointments(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('proptrack_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('proptrack_user');
  };

  const getFilteredLeads = () => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return leads;
    return leads.filter(l => l.agentId === currentUser.id);
  };

  const getFilteredProperties = () => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return properties;
    return properties.filter(p => p.agentId === currentUser.id);
  };

  const getFilteredAppointments = () => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return appointments;
    return appointments.filter(a => a.agentId === currentUser.id);
  };

  const handleUpdateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status, lastFollowUp: new Date().toISOString() } : lead
    ));
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
    if (status === AppointmentStatus.COMPLETED) {
      const apt = appointments.find(a => a.id === id);
      if (apt) handleUpdateLeadStatus(apt.leadId, LeadStatus.VISIT);
    }
  };

  const handleAddLead = (newLeadData: any) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      agentId: newLeadData.agentId || currentUser?.id || 'system',
      ...newLeadData,
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleAddProperty = (newPropData: Omit<Property, 'id' | 'agentId'>) => {
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      agentId: currentUser?.id || 'system',
      ...newPropData,
    };
    setProperties(prev => [newProp, ...prev]);
  };

  const handleUpdateProperty = (updatedProp: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Hapus unit properti ini?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalLead) return;
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      agentId: currentUser?.id || 'system',
      leadId: scheduleModalLead.id,
      propertyId: scheduleModalLead.propertyId,
      dateTime: `${scheduleData.date}T${scheduleData.time}`,
      status: AppointmentStatus.SCHEDULED,
      notes: scheduleData.notes
    };
    setAppointments(prev => [...prev, newApt]);
    handleUpdateLeadStatus(scheduleModalLead.id, LeadStatus.VISIT);
    setScheduleModalLead(null);
    setScheduleData({ date: '', time: '', notes: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation user={currentUser} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          {/* PUBLIC LANDING PAGE ROUTE */}
          <Route path="/listing/:id" element={
            <PropertyLandingPage properties={properties} onAddLead={handleAddLead} />
          } />
          
          <Route path="/auth" element={!currentUser ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} />

          {/* CRM DASHBOARD ROUTES */}
          <Route path="/" element={
            <ProtectedRoute user={currentUser}>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <Dashboard leads={getFilteredLeads()} properties={getFilteredProperties()} appointments={getFilteredAppointments()} />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/leads" element={
            <ProtectedRoute user={currentUser}>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <LeadsManager leads={getFilteredLeads()} properties={getFilteredProperties()} onUpdateStatus={handleUpdateLeadStatus} onOpenScheduleModal={setScheduleModalLead} onAddLead={handleAddLead} />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/properties" element={
            <ProtectedRoute user={currentUser}>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <PropertyInventory properties={getFilteredProperties()} onAddProperty={handleAddProperty} onUpdateProperty={handleUpdateProperty} onDeleteProperty={handleDeleteProperty} />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/landing-pages" element={
            <ProtectedRoute user={currentUser}>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <LandingPageManager properties={getFilteredProperties()} onUpdateProperty={handleUpdateProperty} onDeleteProperty={handleDeleteProperty} onAddProperty={handleAddProperty} />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/landing-pages/edit/:id" element={
            <ProtectedRoute user={currentUser}>
              <EditLandingPage properties={getFilteredProperties()} onUpdateProperty={handleUpdateProperty} />
            </ProtectedRoute>
          } />

          <Route path="/calendar" element={
            <ProtectedRoute user={currentUser}>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <CalendarManager appointments={getFilteredAppointments()} leads={getFilteredLeads()} properties={getFilteredProperties()} onUpdateAppointmentStatus={handleUpdateAppointmentStatus} />
              </div>
            </ProtectedRoute>
          } />

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Schedule Modal Overlay */}
      {scheduleModalLead && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
              <h3 className="text-xl font-bold text-gray-900">Jadwalkan Kunjungan</h3>
              <button onClick={() => setScheduleModalLead(null)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white transition-all"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-1">Calon Pembeli</p>
                <p className="font-bold text-gray-900">{scheduleModalLead.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Tanggal</label>
                  <input required type="date" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Waktu</label>
                  <input required type="time" value={scheduleData.time} onChange={e => setScheduleData({...scheduleData, time: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Instruksi Khusus</label>
                <textarea rows={2} value={scheduleData.notes} onChange={e => setScheduleData({...scheduleData, notes: e.target.value})} placeholder="Titik temu, parkir, dll..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setScheduleModalLead(null)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 text-sm hover:bg-gray-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-100 text-sm active:scale-95 transition-all">Konfirmasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRM Global Footer */}
      {currentUser && !location.pathname.startsWith('/listing/') && (
        <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-medium">&copy; {new Date().getFullYear()} PropTrack CRM. Professional Property Management Solution.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
