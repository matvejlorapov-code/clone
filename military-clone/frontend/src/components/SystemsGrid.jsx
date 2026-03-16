import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemsGrid = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // Проверка сессии при загрузке
  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    const token = localStorage.getItem('token');
    if (loginTime && token) {
      const now = Date.now();
      if (now - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
        localStorage.clear();
      }
    }
  }, []);

  const handleSystemClick = (name) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSelectedSystem(name);
      setIsModalOpen(true);
    } else {
      // Если уже залогинен, просто обновляем страницу, чтобы попасть в Cabinet
      window.location.reload();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Ссылка на твой бэкенд (измени на http, если без SSL)
      const res = await axios.post('http://api.24efslgov.ru/api/login', { login, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('loginTime', res.data.loginTime);
        setIsModalOpen(false);
        window.location.reload(); // Переход в кабинет
      }
    } catch (err) {
      alert("ОШИБКА: ДОСТУП ЗАПРЕЩЕН");
    }
  };

  const systems = ["ПРОБИВ", "ГИСМУ", "ИФР", "ФСО", "ПАРСИВ", "СОРМ-3"];

  return (
    <section className="max-w-7xl mx-auto px-4">
      <h3 className="text-[10px] font-black text-gray-600 uppercase mb-8 tracking-[0.4em] italic">
        ДОСТУПНЫЕ СИСТЕМЫ АНАЛИЗА
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {systems.map((sys) => (
          <button 
            key={sys} 
            onClick={() => handleSystemClick(sys)}
            className="border border-white/10 bg-[#0a0a0a] py-8 text-gray-400 font-black text-[11px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg active:translate-y-1"
          >
            {sys}
          </button>
        ))}
      </div>

      {/* МОДАЛЬНОЕ ОКНО (ТЕПЕРЬ ТЕМНОЕ И С ВИДИМЫМ ТЕКСТОМ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#121416] border border-white/10 p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)] max-w-sm w-full font-mono">
            <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tighter">
              [ ВХОД_В_СИСТЕМУ ]
            </h4>
            <p className="text-[9px] text-gray-500 mb-8 uppercase font-bold tracking-widest border-b border-white/5 pb-4">
              Модуль: {selectedSystem}
            </p>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-[8px] text-gray-500 uppercase font-black mb-2 block">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-white/10 p-3 outline-none focus:border-white/40 text-white font-bold text-sm uppercase transition-all"
                  onChange={e => setLogin(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[8px] text-gray-500 uppercase font-black mb-2 block">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-black border border-white/10 p-3 outline-none focus:border-white/40 text-white font-bold text-sm transition-all"
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="pt-4 flex flex-col space-y-3">
                <button 
                  type="submit" 
                  className="w-full bg-white text-black py-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-200 transition-all cursor-pointer shadow-xl"
                >
                  АВТОРИЗОВАТЬСЯ
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full text-gray-600 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                >
                  ОТМЕНА
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default SystemsGrid;