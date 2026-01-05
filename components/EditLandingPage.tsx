
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Property } from '../types';

interface EditLandingPageProps {
  properties: Property[];
  onUpdateProperty: (prop: Property) => void;
}

const EditLandingPage: React.FC<EditLandingPageProps> = ({ properties, onUpdateProperty }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [uploadLoading, setUploadLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<'main' | number | null>(null);

  useEffect(() => {
    const prop = properties.find(p => p.id === id);
    if (prop) {
      setEditingProp({ ...prop, gallery: prop.gallery ? [...prop.gallery] : [] });
    }
  }, [id, properties]);

  if (!editingProp) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center animate-fadeIn">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4 text-indigo-200">
          <i className="fas fa-search text-2xl"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Unit Tidak Ditemukan</h2>
        <Link to="/landing-pages" className="text-indigo-600 text-sm font-bold mt-4 inline-block hover:underline">Kembali ke Daftar</Link>
      </div>
    </div>
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProp) {
      onUpdateProperty(editingProp);
      navigate('/landing-pages');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProp || activeSlot === null) return;

    setUploadLoading(activeSlot === 'main' ? 'main' : activeSlot.toString());

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (activeSlot === 'main') {
        setEditingProp({ ...editingProp, image: base64String });
      } else {
        const newGallery = [...(editingProp.gallery || [])];
        newGallery[activeSlot] = base64String;
        setEditingProp({ ...editingProp, gallery: newGallery });
      }
      setUploadLoading(null);
      setActiveSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = (slot: 'main' | number) => {
    setActiveSlot(slot);
    fileInputRef.current?.click();
  };

  const removeGalleryImage = (index: number) => {
    if (!editingProp) return;
    const newGallery = [...(editingProp.gallery || [])];
    newGallery.splice(index, 1);
    setEditingProp({ ...editingProp, gallery: newGallery });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/landing-pages')} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center border border-slate-100">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight">Editor Landing Page</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{editingProp.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/listing/${editingProp.id}`} target="_blank" className="px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              <i className="fas fa-eye mr-2"></i> Preview
            </Link>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all">
              Simpan & Publish
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Konten Pemasaran</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Judul Unit</label>
                <input 
                  type="text" 
                  value={editingProp.title} 
                  onChange={e => setEditingProp({...editingProp, title: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Deskripsi Utama</label>
                <textarea 
                  rows={8}
                  value={editingProp.description} 
                  onChange={e => setEditingProp({...editingProp, description: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold transition-all resize-none no-scrollbar"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Harga Jual (Rp)</label>
                  <input 
                    type="number" 
                    value={editingProp.price} 
                    onChange={e => setEditingProp({...editingProp, price: Number(e.target.value)})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Visibilitas</label>
                  <select 
                    value={editingProp.status} 
                    onChange={e => setEditingProp({...editingProp, status: e.target.value as any})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold appearance-none bg-white"
                  >
                    <option value="Tersedia">Tersedia (Aktif)</option>
                    <option value="Booking">Booking (Waspada)</option>
                    <option value="Terjual">Terjual (Selesai)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
             <div className="relative z-10">
               <h4 className="text-lg font-black mb-2">Tips Optimasi AI</h4>
               <p className="text-indigo-200 text-xs leading-relaxed font-medium">
                 Gunakan deskripsi yang detail. AI kami akan secara otomatis mengubah teks Anda menjadi naskah pemasaran yang persuasif di landing page pengunjung.
               </p>
             </div>
             <i className="fas fa-magic absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12"></i>
          </section>
        </div>

        {/* Right Column: Image Management */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Aset Visual</h3>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Banner Utama (16:9)</span>
            </div>
            
            <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 group mb-10">
              <img src={editingProp.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="Banner" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  type="button" 
                  onClick={() => triggerUpload('main')}
                  className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl flex items-center gap-2"
                >
                  {uploadLoading === 'main' ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
                  Ganti Foto Utama
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Galeri Properti (Maks 4 Foto)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((idx) => {
                  const img = editingProp.gallery?.[idx];
                  return (
                    <div key={idx} className="relative aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 group overflow-hidden transition-all hover:border-indigo-400">
                      {img ? (
                        <>
                          <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button 
                              type="button" 
                              onClick={() => triggerUpload(idx)}
                              className="w-10 h-10 bg-white rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-xl flex items-center justify-center"
                            >
                              <i className="fas fa-sync-alt text-xs"></i>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => removeGalleryImage(idx)}
                              className="w-10 h-10 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl flex items-center justify-center"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => triggerUpload(idx)}
                          className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300 group-hover:text-indigo-500 transition-all"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all">
                            {uploadLoading === idx.toString() ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus"></i>}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest">Upload</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default EditLandingPage;
