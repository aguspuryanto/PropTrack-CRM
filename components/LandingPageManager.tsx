
import React from 'react';
import { Property } from '../types';
import { Link } from 'react-router-dom';

interface LandingPageManagerProps {
  properties: Property[];
  onUpdateProperty: (prop: Property) => void;
  onDeleteProperty: (id: string) => void;
  onAddProperty: (prop: Omit<Property, 'id' | 'agentId'>) => void;
}

const LandingPageManager: React.FC<LandingPageManagerProps> = ({ properties, onDeleteProperty }) => {
  const getBaseUrl = () => {
    return window.location.href.split('#')[0];
  };

  const handleCopyLink = (id: string) => {
    const url = `${getBaseUrl()}#/listing/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link Landing Page disalin ke clipboard!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pusat Landing Page</h1>
          <p className="text-sm text-gray-500">Kustomisasi konten visual dan deskripsi publikasi unit Anda.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-indigo-100">
            <i className="fas fa-info-circle text-indigo-600 text-xs"></i>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">AI Pemasaran Aktif</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">Visual & Unit</th>
                <th className="px-6 py-5">Value</th>
                <th className="px-6 py-5">Visibility</th>
                <th className="px-6 py-5 text-right">Manajemen Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                    <i className="fas fa-pager text-4xl mb-4 block opacity-10"></i>
                    <p className="font-medium text-sm">Belum ada unit yang siap untuk landing page.</p>
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-indigo-50/30 transition-all duration-300">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <img src={prop.image} className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                          <div className="absolute -top-2 -right-2 bg-white w-5 h-5 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                            <i className="fas fa-image text-[8px] text-gray-400"></i>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm leading-tight">{prop.title}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">
                            <i className="fas fa-map-marker-alt mr-1"></i> {prop.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-black text-indigo-600">Rp {(prop.price / 1000000).toFixed(1)} jt</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Base Price</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${prop.status === 'Tersedia' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{prop.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleCopyLink(prop.id)}
                          className="w-9 h-9 flex items-center justify-center text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          title="Salin Link"
                        >
                          <i className="fas fa-link text-xs"></i>
                        </button>
                        <Link 
                          to={`/listing/${prop.id}`}
                          target="_self"
                          className="w-9 h-9 flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Buka Landing Page"
                        >
                          <i className="fas fa-external-link-alt text-xs"></i>
                        </Link>
                        <Link 
                          to={`/landing-pages/edit/${prop.id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-100 ml-2"
                        >
                          EDIT KONTEN
                        </Link>
                        <button 
                          onClick={() => onDeleteProperty(prop.id)}
                          className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm ml-1"
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
    </div>
  );
};

export default LandingPageManager;
