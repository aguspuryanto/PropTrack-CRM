
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.AGENT);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Mock Login Logic
      const user = INITIAL_USERS.find(u => u.email === email);
      if (user) {
        onLogin(user);
      } else {
        setError('Email tidak terdaftar atau password salah (Gunakan email dari daftar user)');
      }
    } else {
      // Mock Registration
      const newUser: User = {
        id: `u-${Date.now()}`,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 mb-4">
            <i className="fas fa-home-alt text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">PropTrack<span className="text-indigo-600">CRM</span></h1>
          <p className="text-gray-500 mt-2">{isLogin ? 'Masuk ke sistem manajemen properti Anda' : 'Daftar sebagai agen baru'}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-gray-200 border border-white">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
                    placeholder="Contoh: Rizky Pratama"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Daftar Sebagai</label>
                  <select 
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
                  >
                    <option value={UserRole.AGENT}>Agen Properti</option>
                    <option value={UserRole.ADMIN}>Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Alamat Email</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
                placeholder="email@perusahaan.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kata Sandi</label>
              <input 
                required 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              {isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang'}
              <i className="fas fa-arrow-right text-xs"></i>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Belum punya akun?' : 'Sudah memiliki akun?'} 
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="ml-2 font-bold text-indigo-600 hover:underline"
              >
                {isLogin ? 'Daftar Agen' : 'Masuk Disini'}
              </button>
            </p>
          </div>
        </div>

        {isLogin && (
          <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2 text-center">Demo Account Emails</p>
            <div className="flex flex-wrap justify-center gap-2">
              {INITIAL_USERS.map(u => (
                <span key={u.id} className="text-[10px] bg-white px-2 py-1 rounded-full text-gray-600 font-medium">
                  {u.email}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
