import React from 'react';
import SystemsGrid from '../components/SystemsGrid';

const Home = () => {
  return (
    <div className="min-h-screen bg-black font-mono text-white animate-in fade-in duration-1000">
      
      {/* ВЕРХНЯЯ ДЕКОРАТИВНАЯ ЛИНИЯ */}
      <div className="w-full border-b border-white/10 p-4 flex justify-end items-center opacity-50">
        <div className="text-[10px] tracking-[0.5em] uppercase text-gray-500">EFLS.GOV // Archive_Access</div>
      </div>

      {/* ОСНОВНОЙ БЛОК С КНОПКАМИ */}
      <main className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
           <div className="w-16 h-1 bg-red-800 mb-6 shadow-[0_0_10px_rgba(153,27,27,0.5)]"></div>
           <h1 className="text-2xl md:text-4xl font-black uppercase tracking-[0.3em] mb-4">
             System_Authentication
           </h1>
           {/* Описание удалено по вашему запросу */}
        </div>

        {/* СЕТКА СИСТЕМ */}
        <div className="border-y border-white/5 bg-[#080808] py-16">
          <SystemsGrid />
        </div>
      </main>

      {/* НИЖНИЙ БЛОК: ТЕХПОДДЕРЖКА */}
      <footer className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t border-white/10 pt-16">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-4 opacity-70">Support_Gateway</h3>
            <p className="text-gray-600 text-[10px] uppercase font-bold mb-8">
              Для восстановления доступа используйте официальный прокси-бот.
            </p>
            
            {/* КАРТОЧКА TELEGRAM */}
            <a 
              href="https://t.me/govtp_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-6 border border-white/5 bg-zinc-950 p-4 hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <div className="bg-white p-2 text-black group-hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.133l4.288 1.429 1.43 4.288a2.25 2.25 0 0 0 4.132.126l7.5-16.5a2.25 2.25 0 0 0-1.954-3.191Z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-tighter">@govtp_bot</span>
            </a>
          </div>

          <div className="hidden md:block opacity-10 font-bold text-[9px] text-gray-500 space-y-1 text-right">
            <p>[OK] SESSION_START: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;