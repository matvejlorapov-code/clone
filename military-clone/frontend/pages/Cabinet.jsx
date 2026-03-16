import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cabinet = () => {
  const [searchType, setSearchType] = useState('phone');
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Список всех типов поиска из документации
  const searchMethods = [
    { id: 'phone', label: 'Поиск по телефону', icon: '📞' },
    { id: 'name_standart', label: 'Поиск по ФИО', icon: '👤' },
    { id: 'passport', label: 'Поиск по паспорту', icon: '🪪' },
    { id: 'inn_fl', label: 'Поиск по ИНН', icon: '📄' },
    { id: 'snils', label: 'Поиск по СНИЛС', icon: '💳' },
    { id: 'email', label: 'Поиск по E-mail', icon: '📧' },
    { id: 'adres', label: 'Поиск по адресу', icon: '🏠' },
    { id: 'avto', label: 'Поиск по госномеру', icon: '🚗' },
    { id: 'vin', label: 'Поиск по VIN', icon: '🔢' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      // Отправляем запрос на наш Node.js бэкенд-прокси
      const res = await axios.post('http://localhost:5000/api/search', {
        type: searchType,
        queryData: formData,
        token: token
      });

      if (res.data.status === 'ok') {
        setResult(res.data.data);
      } else {
        setError(res.data.message || 'Данные не найдены');
      }
    } catch (err) {
      setError('Ошибка соединения с серве api');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased text-slate-900">
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <nav className="bg-[#002d56] text-white p-4 shadow-md flex justify-between items-center px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-700 flex items-center justify-center font-black text-xl">E</div>
          <span className="font-black uppercase tracking-widest text-lg">EFLS.GOV / Личный кабинет</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-xs font-bold opacity-70 uppercase tracking-widest">Оператор: ID-350971</span>
          <button onClick={logout} className="bg-red-700 px-4 py-2 text-xs font-bold uppercase hover:bg-red-800 transition-colors">Выход</button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
        
        {/* ЛЕВОЕ МЕНЮ (ТИПЫ ПОИСКА) */}
        <aside className="md:col-span-3 space-y-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Инструменты анализа</h3>
          {searchMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => { setSearchType(method.id); setFormData({}); setResult(null); }}
              className={`w-full flex items-center space-x-3 p-4 text-sm font-bold uppercase tracking-tight transition-all border-l-4 ${
                searchType === method.id 
                ? 'bg-white border-blue-600 text-blue-700 shadow-sm' 
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span>{method.icon}</span>
              <span>{method.label}</span>
            </button>
          ))}
        </aside>

        {/* ОСНОВНАЯ ЧАСТЬ */}
        <main className="md:col-span-9 space-y-6">
          
          {/* ФОРМА ЗАПРОСА */}
          <div className="bg-white p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-black uppercase text-[#002d56] mb-6 flex items-center">
              Параметры поискового запроса: {searchType.toUpperCase()}
            </h2>
            
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Динамические поля ввода в зависимости от типа */}
              {searchType === 'phone' && (
                <input name="phone" placeholder="79001234567" className="input-field" onChange={handleInputChange} required />
              )}
              
              {searchType === 'name_standart' && (
                <>
                  <input name="lastname" placeholder="Фамилия" className="input-field" onChange={handleInputChange} required />
                  <input name="firstname" placeholder="Имя" className="input-field" onChange={handleInputChange} required />
                  <input name="middlename" placeholder="Отчество" className="input-field" onChange={handleInputChange} />
                  <input name="day" placeholder="День (01)" className="input-field" onChange={handleInputChange} />
                  <input name="mounth" placeholder="Месяц (01)" className="input-field" onChange={handleInputChange} />
                  <input name="year" placeholder="Год (1990)" className="input-field" onChange={handleInputChange} />
                </>
              )}

              {searchType === 'passport' && (
                <input name="passport" placeholder="Серия и номер без пробелов" className="input-field" onChange={handleInputChange} required />
              )}

              {searchType === 'adres' && (
                <>
                  <input name="city" placeholder="Город" className="input-field" onChange={handleInputChange} required />
                  <input name="street" placeholder="Улица" className="input-field" onChange={handleInputChange} />
                  <input name="home" placeholder="Дом" className="input-field" onChange={handleInputChange} />
                </>
              )}

              <div className="md:col-span-3 pt-4 border-t mt-4 flex justify-between items-center">
                <p className="text-[10px] text-slate-400 max-w-md uppercase font-bold leading-tight">
                  Внимание: все запросы логируются. Несанкционированный поиск преследуется по закону.
                </p>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#002d56] text-white px-12 py-4 font-black uppercase text-xs tracking-widest hover:bg-blue-800 transition-all shadow-lg disabled:bg-slate-300"
                >
                  {loading ? 'Обработка данных...' : 'Выполнить запрос'}
                </button>
              </div>
            </form>
          </div>

          {/* ВЫВОД РЕЗУЛЬТАТА (ДОСЬЕ) */}
          {error && <div className="bg-red-50 text-red-700 p-4 border-l-4 border-red-700 font-bold uppercase text-xs">{error}</div>}

          {result && (
            <div className="bg-white shadow-2xl border border-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <span className="font-bold text-sm uppercase tracking-widest">Сформированный отчет №{Math.floor(Math.random()*100000)}</span>
                <button className="bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase">Печать / PDF</button>
              </div>

              {/* ВИД ОТЧЕТА КАК НА ФОТО */}
              <div className="p-8">
                {/* Шапка отчета */}
                <div className="flex border-b-2 border-slate-800 pb-6 mb-8">
                  <div className="w-40 h-52 bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-400 italic text-xs text-center p-4 mr-10 shadow-inner">
                    ФОТО ОТСУТСТВУЕТ В БАЗЕ
                  </div>
                  <div className="flex-grow space-y-2">
                    <h1 className="text-3xl font-black uppercase text-slate-900 leading-none mb-4">
                      {result[0]?.['ИМЯ'] || 'ФИО НЕ УКАЗАНО'}
                    </h1>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="font-bold text-slate-500 uppercase text-[10px]">Дата рождения:</div>
                      <div className="font-black">{result[0]?.['ДАТА РОЖДЕНИЯ'] || '—'}</div>
                      <div className="font-bold text-slate-500 uppercase text-[10px]">Место рождения:</div>
                      <div className="font-black">Г. ЛЮБЕРЦЫ, МОСКОВСКАЯ ОБЛ.</div>
                      <div className="font-bold text-slate-500 uppercase text-[10px]">Гражданство:</div>
                      <div className="font-black">РОССИЯ</div>
                      <div className="font-bold text-slate-500 uppercase text-[10px]">ИНН:</div>
                      <div className="font-black text-red-700">{result[0]?.['ИСТОЧНИК'] ? '502716054357' : '—'} !</div>
                    </div>
                  </div>
                </div>

                {/* Блоки данных */}
                <div className="space-y-6">
                  <div>
                    <div className="bg-slate-100 p-2 font-black uppercase text-[10px] tracking-widest border-l-4 border-slate-800 mb-3">
                      + + Свидетельство о рождении
                    </div>
                  </div>

                  <div>
                    <div className="bg-slate-100 p-2 font-black uppercase text-[10px] tracking-widest border-l-4 border-slate-800 mb-3">
                      — — Паспорт РФ (ДЕЙСТВИТЕЛЬНЫЙ)
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm pl-4">
                      <div><span className="text-slate-400 uppercase text-[10px] block font-bold">Дата выдачи:</span> 24.06.2020</div>
                      <div><span className="text-slate-400 uppercase text-[10px] block font-bold">Код подразделения:</span> 500-065</div>
                      <div className="col-span-2"><span className="text-slate-400 uppercase text-[10px] block font-bold">Орган выдачи:</span> ГУ МВД РОССИИ ПО МОСКОВСКОЙ ОБЛАСТИ</div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-slate-100 p-2 font-black uppercase text-[10px] tracking-widest border-l-4 border-slate-800 mb-3">
                      — — Адреса регистрации и проживания
                    </div>
                    <div className="pl-4 text-sm font-mono text-blue-800">
                       МОСКОВСКАЯ ОБЛ, Г ЛЮБЕРЦЫ, УЛ КОМСОМОЛЬСКАЯ, Д 15, КВ 44
                    </div>
                  </div>

                  {/* СЫРЫЕ ДАННЫЕ (Если нужно посмотреть всё) */}
                  <details className="mt-10">
                    <summary className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-slate-600">Показать исходный JSON лог</summary>
                    <pre className="bg-slate-900 text-green-400 p-4 text-[10px] mt-2 overflow-auto max-h-60">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          border: 1px solid #cbd5e1;
          padding: 12px;
          outline: none;
          font-family: monospace;
          font-size: 14px;
        }
        .input-field:focus {
          border-color: #002d56;
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default Cabinet;