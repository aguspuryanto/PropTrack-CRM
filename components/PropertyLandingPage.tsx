
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
    // Check if user is logged in to show "Back to CRM" button
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
          console.error("Failed to generate AI copy:", error);
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
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse text-sm">Menyiapkan unit eksklusif untuk Anda...</p>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-gray-50 p-6 text-center">
      <div className="w-24 h-24 bg-white shadow-xl rounded-full flex items-center justify-center text-4xl text-gray-200">
        <i className="fas fa-search"></i>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unit Tidak Ditemukan</h2>
        <p className="text-gray-500 max-w-xs mx-auto">Mohon maaf, unit properti yang Anda cari tidak terdaftar atau telah dihapus.</p>
      </div>
      <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
        <i className="fas fa-home"></i> Kembali ke Beranda
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Dynamic Header */}
      <nav className="bg-white/80 backdrop-blur-xl py-4 px-6 border-b border-gray-100 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-all">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-100">
            <i className="fas fa-home-alt text-white text-xs"></i>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">PropTrack<span className="text-indigo-600 font-black">LP</span></span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-xs font-black text-gray-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Fasilitas</a>
            <a href="#gallery" className="text-xs font-black text-gray-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Galeri</a>
          </div>
          {user ? (
            <Link to="/" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-xs font-black hover:bg-slate-200 transition-all">
              KEMBALI KE CRM
            </Link>
          ) : (
            <a href="#booking" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              BOOKING UNIT
            </a>
          )}
        </div>
      </nav>

      {/* Immersive Hero Section */}
      <div className="relative h-[90vh] min-h-[600px] overflow-hidden group">
        <img 
          src={activeImage || property.image} 
          alt={property.title} 
          className="w-full h-full object-cover transition-all duration-1000 ease-out scale-100 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-indigo-600 px-4 py-2 rounded-xl text-white text-[10px] font-black mb-6 shadow-2xl uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
              Unit Terbatas • {property.status}
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white mb-6 leading-[0.9] tracking-tighter drop-shadow-2xl">
              {property.title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <p className="text-xl md:text-3xl text-white/90 font-bold flex items-center gap-3">
                <i className="fas fa-map-marker-alt text-indigo-400"></i> {property.location}
              </p>
              <div className="h-2 w-2 rounded-full bg-white/30 hidden md:block"></div>
              <p className="text-xl md:text-3xl text-indigo-400 font-black">
                Rp {property.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Content Column */}
        <div className="lg:col-span-8 space-y-24">
          
          {/* High-Impact Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="text-center md:border-r border-slate-200">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="fas fa-bed text-xl text-indigo-600"></i>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kamar Tidur</div>
              <div className="text-3xl font-black text-slate-900">{property.beds}</div>
            </div>
            <div className="text-center md:border-r border-slate-200">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="fas fa-bath text-xl text-indigo-600"></i>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kamar Mandi</div>
              <div className="text-3xl font-black text-slate-900">{property.baths}</div>
            </div>
            <div className="text-center md:border-r border-slate-200">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="fas fa-expand-arrows-alt text-xl text-indigo-600"></i>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Luas Unit</div>
              <div className="text-3xl font-black text-slate-900">{property.sqft} m²</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="fas fa-shield-alt text-xl text-indigo-600"></i>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Keamanan</div>
              <div className="text-3xl font-black text-slate-900">24/7</div>
            </div>
          </div>

          {/* AI-Enhanced Description */}
          <section id="features" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Lebih Dari Sekadar Hunian</h2>
            </div>
            <div className="space-y-8">
              {adCopy.split('\n').filter(p => p.trim()).map((para, i) => (
                <p key={i} className="text-lg md:text-2xl text-slate-600 leading-relaxed font-medium">
                  {para}
                </p>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
              {[
                { icon: 'fa-bolt', title: 'Modern Living', desc: 'Instalasi smart home terintegrasi untuk kenyamanan maksimal.' },
                { icon: 'fa-leaf', title: 'Sustainable', desc: 'Pencahayaan alami dan sirkulasi udara yang menyegarkan.' },
                { icon: 'fa-road', title: 'Lokasi Strategis', desc: 'Dekat dengan fasilitas publik, transportasi, dan bisnis.' },
                { icon: 'fa-wallet', title: 'Investasi Cerdas', desc: 'Nilai apresiasi properti yang terus meningkat setiap tahun.' }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all group">
                  <div className="w-14 h-14 bg-indigo-100 rounded-[1.25rem] flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <i className={`fas ${item.icon} text-lg`}></i>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery with Active View */}
          <section id="gallery" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Eksplorasi Detail</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[property.image, ...(property.gallery || [])].map((img, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer border-4 transition-all duration-500 relative group ${activeImage === img ? 'border-indigo-600 shadow-xl scale-[1.02] z-10' : 'border-transparent opacity-80 hover:opacity-100'}`}
                  onClick={() => {
                    setActiveImage(img);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Gallery ${idx}`} />
                  {activeImage === img && (
                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                      <i className="fas fa-check-circle text-white text-2xl drop-shadow-lg"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Architectural Floor Plan */}
          {property.floorPlan && (
            <section className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Denah Layout</h2>
              </div>
              <div className="bg-slate-900 p-10 md:p-20 rounded-[4rem] flex items-center justify-center overflow-hidden group shadow-2xl">
                <img 
                  src={property.floorPlan} 
                  className="max-w-full h-auto rounded-2xl shadow-2xl transition-transform group-hover:scale-[1.03]" 
                  alt="Floor Plan" 
                />
              </div>
            </section>
          )}
        </div>

        {/* Right Sticky Sidebar (Booking) */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <div id="booking" className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
            <div className="mb-10 text-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Investasi Impian</div>
              <div className="text-5xl font-black text-indigo-600 tracking-tighter">
                Rp {property.price.toLocaleString('id-ID')}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-[10px] font-black mt-6 uppercase tracking-wider">
                <i className="fas fa-check-circle"></i> Promo Cash Bertahap Tersedia
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-16 px-6 bg-indigo-50 rounded-[3rem] border border-indigo-100 animate-fadeIn">
                <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-white text-4xl mb-8 shadow-2xl shadow-indigo-200">
                  <i className="fas fa-paper-plane"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Terkirim!</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-10">Konsultan kami akan menghubungi Anda melalui WhatsApp dalam 1x24 jam.</p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-white px-6 py-3 rounded-full transition-all border border-transparent hover:border-indigo-100"
                >
                  Kirim Pesan Lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Nama Lengkap</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama Anda" className="w-full px-7 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">No. WhatsApp</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0812XXXXXXXX" className="w-full px-7 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Catatan Visit</label>
                    <textarea rows={4} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Kapan Anda ada waktu luang untuk melihat unit?" className="w-full px-7 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-bold resize-none"></textarea>
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-7 rounded-[1.5rem] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-base uppercase tracking-[0.2em]">
                  JADWALKAN VISIT <i className="fas fa-arrow-right text-xs"></i>
                </button>
                <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                  <i className="fas fa-shield-check text-xs"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Data Anda Aman & Terenkripsi</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Luxury Footer */}
      <footer className="bg-slate-950 text-white pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 border-b border-white/5 pb-24 items-end">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="bg-indigo-600 p-4 rounded-2xl">
                  <i className="fas fa-home-alt text-white text-2xl"></i>
                </div>
                <span className="text-4xl font-black tracking-tighter">PropTrack<span className="text-indigo-500">LP</span></span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black mb-12 leading-none tracking-tighter">Mulai Babak Baru Anda Disini.</h2>
              <div className="flex flex-wrap gap-6">
                <a href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan unit ${property.title}`} target="_blank" rel="noreferrer" className="bg-white text-slate-950 px-12 py-6 rounded-[2rem] font-black hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-4 shadow-2xl text-lg tracking-tight group">
                  <i className="fab fa-whatsapp text-3xl group-hover:rotate-12 transition-transform"></i> KONSULTASI VIA WHATSAPP
                </a>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-8 mb-12">
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-indigo-600/20">
                  <img src="https://i.pravatar.cc/150?u=consultant" className="w-full h-full object-cover" alt="Consultant" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Agen Penjualan Resmi</div>
                  <div className="text-3xl font-black">Rizky Pratama</div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex items-center gap-6 text-slate-400 font-bold text-lg hover:text-white transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><i className="fas fa-phone-alt text-indigo-500"></i></div>
                  +62 812-3456-7890
                </div>
                <div className="flex items-center gap-6 text-slate-400 font-bold text-lg hover:text-white transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><i className="fas fa-envelope text-indigo-500"></i></div>
                  rizky@proptrack.com
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20">
            <div className="text-[10px] font-black uppercase tracking-[0.5em]">© 2024 PROPTRACK CRM • PUBLIC LISTING ENGINE</div>
            <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.5em]">
              <a href="#" className="hover:text-indigo-400 transition-colors">PRIVACY</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">TERMS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyLandingPage;
