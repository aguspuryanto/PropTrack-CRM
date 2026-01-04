
import React, { useState } from 'react';
import { Lead, LeadStatus, Property } from '../types';
import { generateFollowUpMessage } from '../services/geminiService';

interface LeadsManagerProps {
  leads: Lead[];
  properties: Property[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onOpenScheduleModal: (lead: Lead) => void;
  onAddLead: (lead: any) => void;
}

const LeadsManager: React.FC<LeadsManagerProps> = ({ leads, properties, onUpdateStatus, onOpenScheduleModal, onAddLead }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    propertyId: properties[0]?.id || '',
    notes: ''
  });

  const handleWhatsApp = async (lead: Lead) => {
    setLoading(lead.id);
    const property = properties.find(p => p.id === lead.propertyId);
    if (!property) return;

    const message = await generateFollowUpMessage(lead, property);
    setLoading(null);
    
    // Create WhatsApp link
    const phone = lead.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Update status to Contacted if it's currently NEW
    if (lead.status === LeadStatus.NEW) {
      onUpdateStatus(lead.id, LeadStatus.CONTACTED);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead({
      ...newLead,
      status: LeadStatus.NEW,
      createdAt: new Date().toISOString()
    });
    setNewLead({
      name: '',
      phone: '',
      email: '',
      propertyId: properties[0]?.id || '',
      notes: ''
    });
    setIsAddModalOpen(false);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700';
      case LeadStatus.CONTACTED: return 'bg-yellow-100 text-yellow-700';
      case LeadStatus.FOLLOW_UP: return 'bg-purple-100 text-purple-700';
      case LeadStatus.VISIT: return 'bg-orange-100 text-orange-700';
      case LeadStatus.CLOSED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Prospek</h2>
          <p className="text-sm text-gray-500">Kelola dan pantau prospek penjualan Anda.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
            <i className="fas fa-file-export mr-2"></i> Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95"
          >
            <i className="fas fa-plus mr-2"></i> Tambah Lead
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Nama Prospek</th>
              <th className="px-6 py-4">Properti Minat</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Dibuat</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <i className="fas fa-users-slash text-4xl mb-3 block opacity-20"></i>
                  <p>Belum ada data prospek.</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const prop = properties.find(p => p.id === lead.propertyId);
                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <i className="fab fa-whatsapp text-green-500"></i> {lead.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-800">{prop?.title || 'Unknown'}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{prop?.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleWhatsApp(lead)}
                          disabled={loading === lead.id}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                          title="Follow-up WA"
                        >
                          {loading === lead.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fab fa-whatsapp"></i>
                          )}
                          <span className="text-[10px] font-bold uppercase hidden sm:inline">WhatsApp</span>
                        </button>
                        <button 
                          onClick={() => onOpenScheduleModal(lead)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
                          title="Jadwalkan Visit"
                        >
                          <i className="fas fa-calendar-plus"></i>
                          <span className="text-[10px] font-bold uppercase hidden sm:inline">Jadwal</span>
                        </button>
                        <div className="relative">
                          <select 
                            value={lead.status}
                            onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                            className="appearance-none text-[10px] font-bold uppercase bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 px-3 py-2 pr-8 cursor-pointer hover:border-indigo-300 transition-all"
                          >
                            {Object.values(LeadStatus).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-gray-400 pointer-events-none"></i>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tambah Prospek Baru</h3>
                <p className="text-xs text-gray-500 mt-1">Lengkapi data calon pembeli properti.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white transition-all">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Lengkap</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Contoh: Budi Santoso"
                    value={newLead.name}
                    onChange={e => setNewLead({...newLead, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nomor WhatsApp</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">+62</span>
                    <input 
                      required 
                      type="tel" 
                      placeholder="812345678"
                      value={newLead.phone.startsWith('62') ? newLead.phone.substring(2) : newLead.phone}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setNewLead({...newLead, phone: '62' + val});
                      }}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Alamat Email</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="budi@email.com"
                    value={newLead.email}
                    onChange={e => setNewLead({...newLead, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Properti yang Diminati</label>
                <div className="relative">
                  <select 
                    required
                    value={newLead.propertyId}
                    onChange={e => setNewLead({...newLead, propertyId: e.target.value})}
                    className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title} - {p.location}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea 
                  rows={3}
                  placeholder="Kebutuhan khusus atau preferensi pembeli..."
                  value={newLead.notes}
                  onChange={e => setNewLead({...newLead, notes: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm"
                >
                  Simpan Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
