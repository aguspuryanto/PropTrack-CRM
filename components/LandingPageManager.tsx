
import React, { useState } from 'react';
import { Property } from '../types';
import { Link } from 'react-router-dom';

interface LandingPageManagerProps {
  properties: Property[];
  onUpdateProperty: (prop: Property) => void;
  onDeleteProperty: (id: string) => void;
  onAddProperty: (prop: Omit<Property, 'id'>) => void;
}

const LandingPageManager: React.FC<LandingPageManagerProps> = ({ properties, onUpdateProperty, onDeleteProperty, onAddProperty }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);

  const getBaseUrl = () => {
    return window.location.href.split('#')[0];
  };

  const handleCopyLink = (id: string) => {
    const url = `${getBaseUrl()}#/listing/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link Landing Page disalin ke clipboard!');
  };

  const handleEdit = (prop: Property) => {
    setEditingProp(prop);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProp) {
      onUpdateProperty(editingProp);
      setIsModalOpen(false);
      setEditingProp(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pusat Landing Page</h1>
          <p className="text-sm text-gray-500">Kelola konten publikasi dan link pemasaran untuk setiap unit.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
            <i className="fas fa-cog mr-2"></i> Settings
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Informasi Unit</th>
                <th className="px-6 py-4">Status Harga</th>
                <th className="px-6 py-4">Konten Publik</th>
                <th className="px-6 py-4">Views (Simulated)</th>
                <th className="px-6 py-4 text-right">Aksi Pemasaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Belum ada landing page yang dibuat.
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={prop.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{prop.title}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-medium">{prop.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-indigo-600">Rp {(prop.price / 1000000).toFixed(1)} jt</div>
                      <div className="text-[10px] text-gray-400 font-medium">Market Price</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${prop.status === 'Tersedia' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                        <span className="text-xs font-semibold text-gray-700">{prop.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <i className="fas fa-eye text-gray-400"></i> {Math.floor(Math.random() * 500) + 50}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleCopyLink(prop.id)}
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                          title="Salin Link Publik"
                        >
                          <i className="fas fa-link text-xs"></i>
                        </button>
                        <Link 
                          to={`/listing/${prop.id}`}
                          target="_blank"
                          className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                          title="Buka Landing Page"
                        >
                          <i className="fas fa-external-link-alt text-xs"></i>
                        </Link>
                        <button 
                          onClick={() => handleEdit(prop)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                          title="Edit Konten"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button 
                          onClick={() => onDeleteProperty(prop.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                          title="Hapus Unit"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingProp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="text-xl font-bold text-gray-900">Edit Konten Landing Page</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul Pemasaran</label>
                <input 
                  type="text" 
                  value={editingProp.title} 
                  onChange={e => setEditingProp({...editingProp, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status Ketersediaan</label>
                <select 
                  value={editingProp.status} 
                  onChange={e => setEditingProp({...editingProp, status: e.target.value as any})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Tersedia">Tersedia (Public)</option>
                  <option value="Booking">Booking (Caution)</option>
                  <option value="Terjual">Terjual (Not Publicly Available)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi Utama</label>
                <textarea 
                  rows={4}
                  value={editingProp.description} 
                  onChange={e => setEditingProp({...editingProp, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageManager;
