import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Строгие SVG Иконки
const SVG = {
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  Doc: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  History: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Chevron: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>,
  Theme: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
};

const Cabinet = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [searchType, setSearchType] = useState('phone');
  const [openHistory, setOpenHistory] = useState(null);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://api.24efslgov.ru/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (e) { console.error("History_Load_Failed"); }
  };

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
    const res = await axios.post('http://api.24efslgov.ru/api/search', {
      type: searchType, queryData: formData, token: token
    });
    
    if (res.data.status === 'ok') {
      // ПРОВЕРКА: если res.data.data уже массив, используем его
      const dataArray = Array.isArray(res.data.data) ? res.data.data : [];
      setResult({ ...res.data, data: dataArray }); 
      loadHistory();
      window.history.pushState({}, '', `/report/${res.data.reportID}`);
    } else {
      setError('OBJECT_NOT_FOUND_IN_DATABASE');
    }
  } catch (err) {
    setError('CONNECTION_ERROR');
  } finally {
    setLoading(false);
  }
};

  const loadReportFromHistory = async (reportId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://api.24efslgov.ru/api/report/${reportId}`);
      setResult(res.data);
      window.history.pushState({}, '', `/report/${reportId}`);
    } catch (e) { alert("REPORT_LOAD_ERROR"); }
    setLoading(false);
  };

  const findVal = (keyName) => {
  if (!result || !Array.isArray(result.data)) return '—';
  const found = result.data.find(item => item && typeof item === 'object' && !Array.isArray(item) && item[keyName]);
  return found ? String(found[keyName]).toUpperCase() : 'Н/Д';
};

  const menuItems = [
    { id: 'phone', label: 'Телефон', icon: <SVG.Phone /> },
    { id: 'name_standart', label: 'Ф.И.О.', icon: <SVG.User /> },
    { id: 'passport', label: 'Паспорт', icon: <SVG.Doc /> },
    { id: 'inn_fl', label: 'И.Н.Н.', icon: <SVG.Doc /> },
    { id: 'snils', label: 'СНИЛС', icon: <SVG.Doc /> },
    { id: 'email', label: 'E-mail', icon: <SVG.Doc /> },
    { id: 'adres', label: 'Адрес', icon: <SVG.Doc /> },
    { id: 'avto', label: 'Госномер', icon: <SVG.Doc /> },
    { id: 'vin', label: 'VIN-код', icon: <SVG.Doc /> },
  ];

  return (
    <div className={`min-h-screen font-mono transition-all duration-500 ${darkMode ? 'bg-[#1a1c1e] text-gray-400' : 'bg-[#f0f0f0] text-gray-800'}`}>
      
      {/* NAV BAR */}
      <nav className={`p-4 px-10 flex justify-between items-center border-b ${darkMode ? 'bg-[#121416] border-white/5' : 'bg-white border-gray-300 shadow-sm'}`}>
        <div className="flex items-center space-x-6">
          <div className={`border-2 px-3 py-0.5 font-black text-xl tracking-tighter ${darkMode ? 'border-white text-white' : 'border-black text-black'}`}>EFLS</div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`flex items-center space-x-2 text-[9px] font-black border px-3 py-1.5 transition-all cursor-pointer ${darkMode ? 'border-white/20 text-gray-400 hover:bg-white hover:text-black' : 'border-black/20 text-gray-600 hover:bg-black hover:text-white'}`}
          >
            <SVG.Theme />
            <span>{darkMode ? 'LIGHT_ACCESS' : 'DARK_ACCESS'}</span>
          </button>
        </div>
        <button onClick={() => {localStorage.clear(); window.location.reload();}} className="text-[10px] font-black opacity-50 hover:opacity-100 hover:underline cursor-pointer">TERMINATE_SESSION</button>
      </nav>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-3 space-y-2">
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] mb-6 opacity-30 px-2">Navigation_System</h3>
          {menuItems.map((item) => (
            <div key={item.id} className={`border transition-all ${darkMode ? 'border-white/5 bg-[#121416]' : 'border-gray-300 bg-white'}`}>
              <button 
                onClick={() => {
                  setSearchType(item.id);
                  setOpenHistory(openHistory === item.id ? null : item.id);
                }}
                className={`w-full flex items-center justify-between p-3 text-[10px] font-black uppercase cursor-pointer transition-colors ${searchType === item.id ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black') : (darkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-50')}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="opacity-40">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className={`transition-transform duration-300 ${openHistory === item.id ? 'rotate-180' : ''}`}><SVG.Chevron /></span>
              </button>

              {openHistory === item.id && (
                <div className={`p-2 space-y-1 border-t ${darkMode ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50'}`}>
                  {history.filter(h => h.type === item.id).length > 0 ? (
                    history.filter(h => h.type === item.id).map(h => (
                      <button 
                        key={h.report_id}
                        onClick={() => loadReportFromHistory(h.report_id)}
                        className={`w-full text-left p-2 text-[9px] flex items-center space-x-2 truncate cursor-pointer hover:underline ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                      >
                        <SVG.History />
                        <span>{h.query_val}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-[8px] p-2 opacity-20 italic text-center uppercase tracking-widest">No_records_found</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="lg:col-span-9 space-y-6">
          {/* SEARCH FORM */}
          <div className={`p-8 border shadow-2xl transition-colors ${darkMode ? 'bg-[#121416] border-white/5' : 'bg-white border-gray-300'}`}>
             <h2 className="text-[10px] font-black uppercase mb-8 flex items-center opacity-40">
                <span className="mr-4">[{searchType}_MODULE]</span>
                <span className="flex-grow h-[1px] bg-current opacity-10"></span>
             </h2>
             <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchType === 'phone' && <input name="phone" placeholder="PHONE: 7XXXXXXXXXX" className="arch-input" onChange={handleInputChange} required />}
                  {searchType === 'name_standart' && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input name="lastname" placeholder="LAST_NAME" className="arch-input" onChange={handleInputChange} required />
                      <input name="firstname" placeholder="FIRST_NAME" className="arch-input" onChange={handleInputChange} required />
                      <input name="middlename" placeholder="MIDDLE_NAME" className="arch-input" onChange={handleInputChange} />
                    </div>
                  )}
                  {['passport', 'inn_fl', 'snils', 'email', 'avto', 'vin'].includes(searchType) && (
                      <input name={searchType} placeholder={searchType.toUpperCase()} className="arch-input" onChange={handleInputChange} required />
                  )}
                  {searchType === 'adres' && (
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <input name="city" placeholder="CITY" className="arch-input" onChange={handleInputChange} required />
                      <input name="street" placeholder="STREET" className="arch-input" onChange={handleInputChange} />
                      <input name="home" placeholder="HOUSE" className="arch-input" onChange={handleInputChange} />
                    </div>
                  )}
                </div>
                <div className="mt-8 flex justify-end">
                   <button disabled={loading} className="bg-transparent border border-current px-10 py-2 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-current hover:text-zinc-900 cursor-pointer disabled:opacity-20 transition-all">
                      {loading ? 'BUSY...' : 'RUN_QUERY'}
                   </button>
                </div>
             </form>
          </div>

          {/* REPORT VIEW (Reusable Component Style) */}
          {error && <div className="bg-black text-red-900 border border-red-900/30 p-4 font-black uppercase text-[10px] text-center shadow-xl">{error}</div>}
          
          {result && (
            <div className={`border shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-5 ${darkMode ? 'bg-[#121416] border-white/10' : 'bg-white border-gray-400'}`}>
              {/* Header of Report */}
              <div className="bg-black/20 p-3 px-8 border-b border-white/5 flex justify-between items-center text-[8px] font-black opacity-50 uppercase tracking-[0.3em] print:hidden">
                 <span>Report_Status: Decrypted // Verified</span>
                 <button onClick={() => window.print()} className="hover:underline cursor-pointer">Print_Hardcopy</button>
              </div>

              <div className="p-10 md:p-20 relative">
                <div className="text-center mb-16 opacity-40">
                   <h1 className="text-sm font-black uppercase tracking-[0.6em] border-b border-current pb-2 inline-block">Dossier_Archive</h1>
                </div>

                <div className="flex flex-col md:flex-row border-b border-current border-opacity-10 pb-14 mb-14">
                  <div className="w-40 h-52 bg-black/20 border border-current border-opacity-20 flex-shrink-0 flex items-center justify-center p-2 mr-10 grayscale opacity-40">
                      <svg className="w-12 h-12 opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                  <div className="flex-grow">
                    <div className="text-[8px] font-black uppercase tracking-[0.5em] mb-6 opacity-30 italic">:: ID_LOG_DATA</div>
                    <h1 className="text-3xl font-black uppercase leading-none mb-10 tracking-tighter border-l-4 border-current pl-6">
                      {findVal('ИМЯ')}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-[10px] uppercase">
                       <div className="border-b border-current border-opacity-5 pb-1 flex justify-between">
                          <span className="opacity-30">Birth_Date:</span>
                          <span className="font-black">{findVal('ДАТА РОЖДЕНИЯ')}</span>
                       </div>
                       <div className="border-b border-current border-opacity-5 pb-1 flex justify-between">
                          <span className="opacity-30">Tax_ID:</span>
                          <span className="font-black">502716054357</span>
                       </div>
                       <div className="border-b border-current border-opacity-5 pb-1 flex justify-between">
                          <span className="opacity-30">Citizen:</span>
                          <span className="font-black tracking-widest">RUS_FED</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-16">
                  <div className={`border p-6 bg-black/5 ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
                    <div className="font-black uppercase text-[10px] mb-6 opacity-40 border-b border-current pb-1 inline-block">[ Passport_Module ]</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-[11px]">
                       <div><label className="text-[8px] opacity-20 block mb-1 uppercase font-black">Serial</label><span className="font-black text-xl tracking-widest">{findVal('ПАСПОРТ')}</span></div>
                       <div><label className="text-[8px] opacity-20 block mb-1 uppercase font-black">Issue_Date</label><span className="font-black">{findVal('Дата выдачи документа')}</span></div>
                       <div className="md:col-span-3 pt-4"><label className="text-[8px] opacity-20 block mb-1 uppercase font-black">Authority</label><span className="italic uppercase opacity-60">{findVal('Орган выдачи документа')}</span></div>
                    </div>
                  </div>

                  <div className="mt-20 overflow-x-auto">
                    <table className="w-full text-[8px] border-collapse border border-current border-opacity-10">
                      <tbody>
                        {result.data.filter(d => !Array.isArray(d)).map((d, i) => (
                          <tr key={i} className="border-b border-current border-opacity-5 hover:bg-current hover:bg-opacity-5 transition-all">
                            <td className="p-2 font-black opacity-40 uppercase border-r border-current border-opacity-5 w-1/4">{d['ИСТОЧНИК']}</td>
                            <td className="p-2 opacity-60 italic font-mono">
                               {Object.entries(d).filter(([k]) => k !== 'ИСТОЧНИК').map(([k, v]) => (
                                  <span key={k} className="mr-4 inline-block"><b className="not-italic opacity-100 uppercase text-[7px] mr-1">[{k}]</b>{String(v)}</span>
                               ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-32 pt-12 border-t border-current border-opacity-10 flex justify-between items-end opacity-5">
                   <div className="text-[8px] font-black uppercase tracking-[0.6em]">EFLS_STORAGE // DIV_09</div>
                   <div className="border-4 border-current p-2 font-black text-2xl tracking-widest uppercase">CLASSIFIED</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .arch-input {
          width: 100%;
          border: 1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'};
          padding: 12px;
          outline: none;
          font-family: monospace;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          background: ${darkMode ? 'rgba(0,0,0,0.3)' : '#ffffff'};
          color: inherit;
        }
        .arch-input:focus {
          border-color: ${darkMode ? '#fff' : '#000'};
        }
        @media print {
            nav, aside, form, .print\\:hidden { display: none !important; }
            body { background: white !important; color: black !important; }
            main { grid-column: span 12 / span 12 !important; margin: 0 !important; }
            #report-content { padding: 0 !important; border: none !important; color: black !important; }
            .bg-[#121416], .bg-[#1a1c1e] { background: white !important; }
            .text-gray-400 { color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default Cabinet;