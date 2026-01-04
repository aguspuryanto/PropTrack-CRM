
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property } from '../types';
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

  useEffect(() => {
    const found = properties.find(p => p.id === id);
    if (found) {
      setProperty(found);
      setActiveImage(found.image);
      const fetchAdCopy = async () => {
        const copy = await generatePropertyAdCopy(found);
        setAdCopy(copy);
        setLoading(false);
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
        <p className="text-gray-500 font-medium animate-pulse">Menyiapkan unit eksklusif untuk Anda...</p>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-gray-50 p-6 text-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400">
        <i className="fas fa-search"></i>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unit Tidak Tersedia</h2>
        <p className="text-gray-500 max-w-xs mx-auto">Mohon maaf, unit properti yang Anda cari mungkin sudah terjual atau tautan telah kadaluarsa.</p>
      </div>
      <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
        <i className="fas fa-home"></i> Kembali Beranda
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl py-4 px-6 border-b border-gray-100 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-100">
            <i className="fas fa-home-alt text-white text-xs"></i>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">PropTrack<span className="text-indigo-600 font-black">LP</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Fasilitas</a>
          <a href="#gallery" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Galeri</a>
          <a href="#booking" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Booking Unit Sekarang</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <img 
          src={activeImage || property.image} 
          alt={property.title} 
          className="w-full h-full object-cover transition-all duration-1000 ease-out scale-100 hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-indigo-600 px-4 py-2 rounded-xl text-white text-xs font-black mb-8 shadow-xl uppercase tracking-widest animate-bounce">
              <i className="fas fa-fire"></i>
              Unit Terbatas - {property.status}
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[1] tracking-tighter drop-shadow-2xl">
              {property.title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <p className="text-xl md:text-3xl text-white/90 font-medium flex items-center gap-3">
                <i className="fas fa-map-marker-alt text-indigo-400"></i> {property.location}
              </p>
              <div className="h-2 w-2 rounded-full bg-white/30 hidden md:block"></div>
              <p className="text-xl md:text-3xl text-indigo-400 font-black">
                Mulai Rp {property.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-24">
          
          {/* Key Specs Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
            <div className="text-center md:border-r border-slate-200">
              <i className="fas fa-bed text-2xl text-indigo-600 mb-4"></i>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kamar Tidur</div>
              <div className="text-3xl font-black text-slate-900">{property.beds}</div>
            </div>
            <div className="text-center md:border-r border-slate-200">
              <i className="fas fa-bath text-2xl text-indigo-600 mb-4"></i>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kamar Mandi</div>
              <div className="text-3xl font-black text-slate-900">{property.baths}</div>
            </div>
            <div className="text-center md:border-r border-slate-200">
              <i className="fas fa-expand-arrows-alt text-2xl text-indigo-600 mb-4"></i>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Luas Bangunan</div>
              <div className="text-3xl font-black text-slate-900">{property.sqft} m²</div>
            </div>
            <div className="text-center">
              <i className="fas fa-shield-alt text-2xl text-indigo-600 mb-4"></i>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Keamanan</div>
              <div className="text-3xl font-black text-slate-900">24/7</div>
            </div>
          </div>

          {/* Description Section */}
          <section id="features" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Kenyamanan Tanpa Batas</h2>
            </div>
            <div className="prose prose-xl prose-slate max-w-none">
              {adCopy.split('\n').map((para, i) => para.trim() ? (
                <p key={i} className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-8">
                  {para}
                </p>
              ) : null)}
            </div>
            
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              {[
                { icon: 'fa-bolt', title: 'Smart Home System', desc: 'Kontrol pencahayaan dan keamanan dari smartphone.' },
                { icon: 'fa-leaf', title: 'Eco-Friendly Design', desc: 'Ventilasi udara alami dan pencahayaan maksimal.' },
                { icon: 'fa-road', title: 'Akses Strategis', desc: 'Hanya 5 menit dari pintu Tol dan stasiun utama.' },
                { icon: 'fa-parking', title: 'Double Carport', desc: 'Area parkir luas untuk dua kendaraan kesayangan.' }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery Grid */}
          <section id="gallery" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Eksplorasi Visual</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[property.image, ...(property.gallery || [])].map((img, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 ${activeImage === img ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-transparent opacity-80 hover:opacity-100 shadow-sm'}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} className="w-full h-full object-cover transition-transform hover:scale-110" alt={`Gallery ${idx}`} />
                </div>
              ))}
            </div>
          </section>

          {/* Floor Plan */}
          {property.floorPlan && (
            <section className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Denah Arsitektur</h2>
              </div>
              <div className="bg-slate-900 p-8 md:p-16 rounded-[4rem] flex items-center justify-center overflow-hidden group">
                <img 
                  src={property.floorPlan} 
                  className="max-w-full h-auto rounded-3xl shadow-2xl transition-transform group-hover:scale-[1.02]" 
                  alt="Floor Plan" 
                />
              </div>
            </section>
          )}
        </div>

        {/* Sticky Booking Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <div id="booking" className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]">
            <div className="mb-10 text-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Investasi Terunggul</div>
              <div className="text-4xl font-black text-indigo-600">
                Rp {property.price.toLocaleString('id-ID')}
              </div>
              <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold mt-4">
                <i className="fas fa-check-circle mr-1"></i> Penawaran Spesial Bulan Ini
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-12 px-6 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 animate-fadeIn">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl mb-6 shadow-xl shadow-indigo-100">
                  <i className="fas fa-paper-plane"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Terima Kasih!</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">Data Anda telah dikirim ke konsultan kami. Kami akan segera menghubungi Anda melalui WhatsApp.</p>
                <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">Kirim Pesan Lain</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Nama Lengkap</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Masukkan nama Anda" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">No. WhatsApp</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0812XXXXXXXX" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pesan Kustom</label>
                  <textarea rows={4} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Kapan waktu terbaik untuk visit unit?" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-bold resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-base uppercase tracking-widest">
                  KONFIRMASI VISIT <i className="fas fa-chevron-right text-xs"></i>
                </button>
                <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                  <i className="fas fa-lock text-xs"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Enkripsi Data Aman</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modern Footer Section */}
      <footer className="bg-slate-950 text-white pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 border-b border-white/10 pb-24 items-end">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl">
                  <i className="fas fa-home-alt text-white text-xl"></i>
                </div>
                <span className="text-3xl font-black tracking-tighter">PropTrack<span className="text-indigo-500">LP</span></span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-10 leading-none">Siap Menjadi Pemilik Unit Ini?</h2>
              <p className="text-xl text-slate-400 font-medium max-w-xl mb-12">Konsultasi gratis mengenai opsi pembiayaan, promo bulan ini, dan jadwal kunjungan lokasi.</p>
              <div className="flex flex-wrap gap-6">
                <a href={`https://wa.me/628123456789?text=Halo, saya tertarik dengan unit ${property.title}`} target="_blank" className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-4 shadow-2xl">
                  <i className="fab fa-whatsapp text-2xl"></i> HUBUNGI SALES ONLINE
                </a>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] overflow-hidden shadow-2xl">
                  <img src="https://i.pravatar.cc/150?u=consultant" className="w-full h-full object-cover" alt="Consultant" />
                </div>
                <div>
                  <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Eksklusif Konsultan</div>
                  <div className="text-2xl font-black">Rizky Pratama</div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-400 font-medium hover:text-white transition-colors">
                  <i className="fas fa-phone-alt text-indigo-500"></i> +62 812-3456-7890
                </div>
                <div className="flex items-center gap-4 text-slate-400 font-medium hover:text-white transition-colors">
                  <i className="fas fa-envelope text-indigo-500"></i> rizky@proptrack.com
                </div>
                <div className="flex items-center gap-4 text-slate-400 font-medium hover:text-white transition-colors">
                  <i className="fas fa-award text-indigo-500"></i> Top Agent Platinum 2024
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8 opacity-30">
            <div className="text-[10px] font-black uppercase tracking-[0.3em]">© 2024 PROPTRACK CRM • PUBLIC LANDING PAGE ENGINE</div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-indigo-400">Kebijakan Privasi</a>
              <a href="#" className="hover:text-indigo-400">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyLandingPage;
