
import React, { useState } from 'react';
import { Property } from '../types';
import { Link } from 'react-router-dom';

interface PropertyInventoryProps {
  properties: Property[];
  onAddProperty: (prop: Omit<Property, 'id' | 'agentId'>) => void;
  onUpdateProperty: (prop: Property) => void;
  onDeleteProperty: (id: string) => void;
}

const PropertyInventory: React.FC<PropertyInventoryProps> = ({ properties, onAddProperty, onUpdateProperty, onDeleteProperty }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    image: '',
    beds: '1',
    baths: '1',
    sqft: '',
    status: 'Tersedia' as Property['status'],
    floorPlan: '',
    galleryRaw: ''
  });

  const getBaseUrl = () => {
    return window.location.href.split('#')[0];
  };

  const openEdit = (prop: Property) => {
    setEditingId(prop.id);
    setFormData({
      title: prop.title,
      price: prop.price.toString(),
      location: prop.location,
      description: prop.description,
      image: prop.image,
      beds: prop.beds.toString(),
      baths: prop.baths.toString(),
      sqft: prop.sqft.toString(),
      status: prop.status,
      floorPlan: prop.floorPlan || '',
      galleryRaw: prop.gallery ? prop.gallery.join('\n') : ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setFormData({
      title: '', price: '', location: '', description: '', image: '',
      beds: '1', baths: '1', sqft: '', status: 'Tersedia',
      floorPlan: '', galleryRaw: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const gallery = formData.galleryRaw
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');

    const propData = {
      title: formData.title,
      price: Number(formData.price),
      location: formData.location,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      beds: Number(formData.beds),
      baths: Number(formData.baths),
      sqft: Number(formData.sqft),
      status: formData.status,
      floorPlan: formData.floorPlan || undefined,
      gallery: gallery.length > 0 ? gallery : undefined
    };

    if (editingId) {
      const existingProp = properties.find(p => p.id === editingId);
      if (existingProp) {
        onUpdateProperty({ ...existingProp, ...propData });
      }
    } else {
      onAddProperty(propData);
    }

    resetForm();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventaris Properti</h1>
          <p className="text-sm text-gray-500">Kelola daftar unit properti yang Anda pasarkan.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Tambah Unit Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 shadow-sm uppercase tracking-widest">
                {prop.status}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => openEdit(prop)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
                >
                  <i className="fas fa-edit text-xs"></i>
                </button>
                <button 
                  onClick={() => onDeleteProperty(prop.id)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-white transition-all shadow-sm"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{prop.title}</h3>
              <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                <i className="fas fa-map-marker-alt text-[10px]"></i> {prop.location}
              </p>
              
              <div className="flex justify-between items-center mb-6 py-3 border-y border-gray-50">
                <div className="text-center">
                  <div className="text-[10px] uppercase text-gray-400 font-bold">KT</div>
                  <div className="text-sm font-bold text-gray-700">{prop.beds}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase text-gray-400 font-bold">KM</div>
                  <div className="text-sm font-bold text-gray-700">{prop.baths}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase text-gray-400 font-bold">Luas</div>
                  <div className="text-sm font-bold text-gray-700">{prop.sqft}m²</div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Jual</span>
                  <span className="text-lg font-bold text-indigo-600">Rp {(prop.price / 1000000).toFixed(1)} jt</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to={`/listing/${prop.id}`}
                    target="_blank"
                    className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold text-center hover:bg-slate-200 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-external-link-alt text-[10px]"></i> Preview LP
                  </Link>
                  <button 
                    onClick={() => {
                      const url = `${getBaseUrl()}#/listing/${prop.id}`;
                      navigator.clipboard.writeText(url);
                      alert('Link landing page disalin ke clipboard!');
                    }}
                    className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-share-alt text-[10px]"></i> Salin Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Unit Properti' : 'Unit Properti Baru'}</h3>
                <p className="text-xs text-gray-500 mt-1">Lengkapi spesifikasi untuk dipublikasi ke landing page.</p>
              </div>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white transition-all">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Nama / Judul Unit</label>
                  <input required type="text" placeholder="Contoh: Cluster Cemara Modern Blok A" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Harga (Rupiah)</label>
                  <input required type="number" placeholder="Contoh: 850000000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Lokasi / Wilayah</label>
                  <input required type="text" placeholder="Contoh: Gading Serpong, Tangerang" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">KT</label>
                    <input required type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">KM</label>
                    <input required type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Luas (m²)</label>
                    <input required type="number" placeholder="90" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white">
                    <option value="Tersedia">Tersedia</option>
                    <option value="Booking">Booking</option>
                    <option value="Terjual">Terjual</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">URL Gambar Utama</label>
                  <input type="url" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Deskripsi Properti</label>
                  <textarea rows={3} placeholder="Jelaskan detail properti..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">URL Denah Lantai</label>
                  <input type="url" value={formData.floorPlan} onChange={e => setFormData({...formData, floorPlan: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Galeri Foto</label>
                  <textarea rows={2} value={formData.galleryRaw} onChange={e => setFormData({...formData, galleryRaw: e.target.value})} placeholder="Satu URL per baris..." className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-xs resize-none"></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2 border-t border-slate-50 mt-4">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm">
                  {editingId ? 'Simpan Perubahan' : 'Simpan Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyInventory;
