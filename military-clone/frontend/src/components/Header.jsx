import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#002d56] text-white shadow-lg border-b-4 border-blue-600">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        
{/* Логотип слева */}
        <div className="flex items-center space-x-4">
          <div className="border-l-4 border-white pl-3">
            <h1 className="text-xl font-bold leading-tight tracking-widest uppercase">
              efls.gov<br/>
              <span className="text-[10px] font-light tracking-[0.3em] opacity-70">
                Информационный портал
              </span>
            </h1>
          </div>
        </div>

        {/* Навигация (Новости и Поиск удалены) */}
        <nav className="hidden md:flex space-x-8 text-sm font-bold uppercase tracking-tighter">
          <a href="#" className="hover:text-blue-300 border-b-2 border-transparent hover:border-blue-300 transition-all duration-300">
            Главная
          </a>
          <a href="#" className="hover:text-blue-300 border-b-2 border-transparent hover:border-blue-300 transition-all duration-300">
            Документы
          </a>
          <a href="#" className="hover:text-blue-300 border-b-2 border-transparent hover:border-blue-300 transition-all duration-300">
            Контакты
          </a>
        </nav>

      </div>
    </header>
  );
};

export default Header;