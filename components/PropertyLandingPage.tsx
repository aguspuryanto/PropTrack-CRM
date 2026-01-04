
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property, User } from '../types';
import { generatePropertyAdCopy } from '../services/geminiService';

interface PropertyLandingPageProps {
  properties: Property[];
  onAddLead: (lead: any) => void;
}

const PropertyLandingPage: React.FC<PropertyLandingPageProps> = ({ properties, onAddLead }) => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [adCopy, setAdCopy] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('proptrack_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const found = properties.find(p => p.id === id);
    if (found) {
      setProperty(found);
      setActiveImage(found.image);
      const fetchAdCopy = async () => {
        try {
          const copy = await generatePropertyAdCopy(found);
          setAdCopy(copy || found.description);
        } catch (error) {
          setAdCopy(found.description);
        } finally {
          setLoading(false);
        }
      };
      fetchAdCopy();
    } else {
      setLoading(false);
    }
    window.scrollTo(0, 0);
  }, [id, properties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    onAddLead({
      ...form,
      propertyId: property.id,
      agentId: property.agentId,
      status: 'Baru',
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse tracking-widest text-xs">LOADING EXCLUSIVE UNIT</p>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-gray-50 p-6 text-center">
      <div className="w-24 h-24 bg-white shadow-2xl rounded-3xl flex items-center justify-center text-4xl text-indigo-200">
        <i className="fas fa-house-crack"></i>
      </div>
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Unit Tidak Ditemukan</h2>
        <p className="text-gray-500 max-w-xs mx-auto">Mungkin unit ini sudah terjual atau dipindahkan oleh agen kami.</p>
      </div>
      <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
        <i className="fas fa-arrow-left"></i> KEMBALI KE BERANDA
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      {/* Dynamic Header */}
      <nav className="bg-white/70 backdrop-blur-2xl py-5 px-6 border-b border-gray-100 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center">
            <i className="fas fa-house text-white text-sm"></i>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">PropTrack<span className="text-indigo-600">LP</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-8 mr-8">
            <a href="#features" className="text-[10px] font-black text-gray-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">Fasilitas</a>
            <a href="#gallery" className="text-[10px] font-black text-gray-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">Galeri</a>
            <a href="#location" className="text-[10px] font-black text-gray-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">Lokasi</a>
          </div>
          {user && (
            <Link to="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
              DASHBOARD CRM
            </Link>
          )}
          <a href="#booking" className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
            AMANKAN UNIT
          </a>
        </div>
      </nav>

      {/* Floating WhatsApp CTA */}
      <a 
        href={`https://wa.me/6281234567890?text=Halo, saya sangat tertarik dengan unit ${property.title}. Bisa bantu infokan detail cicilannya?`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-[60] bg-green-500 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 hover:bg-green-600 active:scale-95 transition-all animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Hero Section */}
      <div className="relative h-[85vh] overflow-hidden">
        <img 
          src={activeImage || property.image} 
          alt={property.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-white text-[10px] font-black mb-6 uppercase tracking-widest animate-slideUp">
              <i className="fas fa-star text-[8px]"></i> Unit Pilihan Minggu Ini
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter animate-slideUp">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <p className="text-lg md:text-2xl text-white font-bold flex items-center gap-2">
                <i className="fas fa-location-dot text-indigo-500"></i> {property.location}
              </p>
              <div className="h-1.5 w-1.5 rounded-full bg-white/50 hidden md:block"></div>
              <p className="text-lg md:text-2xl text-indigo-400 font-black">
                Rp {property.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-24">
          
          {/* Visual Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Kamar Tidur', value: property.beds, icon: 'fa-bed' },
              { label: 'Kamar Mandi', value: property.baths, icon: 'fa-bath' },
              { label: 'Luas Bangunan', value: `${property.sqft}m²`, icon: 'fa-expand' },
              { label: 'Status Unit', value: property.status, icon: 'fa-tag' },
            ].map((spec, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <i className={`fas ${spec.icon} text-lg`}></i>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</div>
                <div className="text-xl font-black text-slate-900">{spec.value}</div>
              </div>
            ))}
          </div>

          {/* AI Content Section */}
          <section id="features" className="scroll-mt-32">
            <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Kenapa Harus Unit Ini?</h2>
            <div className="space-y-10">
              {adCopy.split('\n').filter(p => p.trim()).map((para, i) => (
                <p key={i} className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium">
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Gallery with Smooth Selection */}
          <section id="gallery" className="scroll-mt-32">
            <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Galeri Visual</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[property.image, ...(property.gallery || [])].map((img, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer border-4 transition-all relative group ${activeImage === img ? 'border-indigo-600' : 'border-transparent'}`}
                  onClick={() => {
                    setActiveImage(img);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`View ${idx}`} />
                  {activeImage !== img && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <i className="fas fa-maximize text-white text-2xl"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Floor Plan */}
          {property.floorPlan && (
            <section className="scroll-mt-32">
              <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Denah Lantai</h2>
              <div className="bg-slate-100 p-8 md:p-16 rounded-[3rem] border border-slate-200">
                <img src={property.floorPlan} className="w-full h-auto rounded-2xl shadow-2xl" alt="Floor Plan" />
              </div>
            </section>
          )}
        </div>

        {/* Lead Form Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <div id="booking" className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">Dapatkan Brosur & Price List</h3>
              <p className="text-slate-400 text-sm mb-8">Tinggalkan kontak Anda, konsultan kami akan mengirimkan detail lengkap via WhatsApp.</p>

              {submitted ? (
                <div className="text-center py-12 px-4 bg-white/5 rounded-3xl border border-white/10 animate-fadeIn">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl mb-6">
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2">Terima Kasih!</h4>
                  <p className="text-slate-400 text-sm">Tim kami akan segera menghubungi Anda.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Kirim Data Lagi</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama Lengkap" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-indigo-500 outline-none text-white text-sm font-bold transition-all" />
                  </div>
                  <div>
                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="No. WhatsApp (Contoh: 0812...)" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-indigo-500 outline-none text-white text-sm font-bold transition-all" />
                  </div>
                  <div>
                    <textarea rows={4} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Ada pertanyaan atau jadwal kunjungan?" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-indigo-500 outline-none text-white text-sm font-bold transition-all resize-none"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest">
                    KIRIM PERMINTAAN
                  </button>
                  <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-black">Data Anda 100% Aman Bersama Kami</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div>
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs">
                <i className="fas fa-house"></i>
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">PropTrack<span className="text-indigo-600">LP</span></span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">&copy; 2024 Solusi Properti Digital Terbaik</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Support</span>
              <a href="#" className="text-xs text-slate-400 font-bold hover:text-indigo-600 transition-colors">Pusat Bantuan</a>
              <a href="#" className="text-xs text-slate-400 font-bold hover:text-indigo-600 transition-colors">Kebijakan Privasi</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Kontak Agen</span>
              <a href="#" className="text-xs text-slate-400 font-bold hover:text-indigo-600 transition-colors">+62 812-3456-7890</a>
              <a href="#" className="text-xs text-slate-400 font-bold hover:text-indigo-600 transition-colors">rizky@proptrack.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyLandingPage;
