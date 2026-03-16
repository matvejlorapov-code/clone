import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://api.24efslgov.ru/api/report/${id}`);
        
        // ВАЖНАЯ ПРОВЕРКА СТРУКТУРЫ
        let finalData = [];
        if (res.data && Array.isArray(res.data.data)) {
            finalData = res.data.data; // Если пришел объект { status, data: [] }
        } else if (Array.isArray(res.data)) {
            finalData = res.data; // Если пришел чистый массив []
        }

        setResult({ data: finalData, date_create: 'ARCHIVE_LOADED' });
      } catch (e) {
        setError('REPORT_NOT_FOUND');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const findVal = (keyName) => {
    if (!result || !Array.isArray(result.data)) return '—';
    // Ищем в массиве объект, у которого есть нужный ключ
    const found = result.data.find(item => item && typeof item === 'object' && !Array.isArray(item) && item[keyName]);
    return found ? String(found[keyName]).toUpperCase() : 'Н/Д';
  };

  if (loading) return <div className="min-h-screen bg-[#1a1c1e] flex items-center justify-center text-white font-mono text-[10px] tracking-[0.5em]">ACCESSING_DATABASE...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-mono p-10 flex justify-center">
      <div className="max-w-5xl w-full border-4 border-black p-12 relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 text-[100px] font-black opacity-[0.03] pointer-events-none uppercase">Confidential</div>
        
        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-10 print:hidden">
            <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase hover:underline">← RETURN_TO_TERMINAL</button>
            <button onClick={() => window.print()} className="bg-black text-white px-6 py-2 text-[9px] font-black uppercase">PRINT_HARDCOPY</button>
        </div>

        <div className="text-center mb-16">
           <h1 className="text-2xl font-black uppercase tracking-[0.3em] underline decoration-4 underline-offset-8">АРХИВНОЕ ДОСЬЕ ОБЪЕКТА</h1>
           <p className="text-[9px] mt-4 font-bold opacity-40">EFLS_CENTRAL_ARCHIVE // ID: {id}</p>
        </div>

        <div className="flex flex-col md:flex-row border-b-4 border-black pb-12 mb-12">
            <div className="w-40 h-52 bg-gray-100 border-2 border-black flex-shrink-0 flex items-center justify-center p-2 mr-10 grayscale opacity-40">
                <svg className="w-12 h-12 opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div className="flex-grow mt-8 md:mt-0">
                <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-black pl-6 mb-8">{findVal('ИМЯ')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-[11px] uppercase">
                    <div className="border-b border-black/10 pb-1 flex justify-between"><span>Birth:</span><span className="font-black">{findVal('ДАТА РОЖДЕНИЯ')}</span></div>
                    <div className="border-b border-black/10 pb-1 flex justify-between"><span>Tax_ID:</span><span className="font-black">502716054357</span></div>
                    <div className="border-b border-black/10 pb-1 flex justify-between"><span>Citizen:</span><span className="font-black">RUS_FED</span></div>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[9px] border-collapse border-2 border-black">
            <thead>
              <tr className="bg-black text-white font-black uppercase text-left">
                <th className="p-3 border-2 border-black">Source</th>
                <th className="p-3 border-2 border-black">Data_Payload</th>
              </tr>
            </thead>
            <tbody>
              {result.data.filter(d => d && typeof d === 'object' && !Array.isArray(d)).map((d, i) => (
                <tr key={i} className="border-b border-black">
                  <td className="p-2 font-black uppercase border-r-2 border-black bg-gray-50 w-1/4">{d['ИСТОЧНИК']}</td>
                  <td className="p-2 opacity-70 italic font-mono leading-relaxed">
                    {Object.entries(d).filter(([k]) => k !== 'ИСТОЧНИК').map(([k, v]) => (
                        <span key={k} className="mr-4 inline-block"><b className="not-italic font-black text-black">[{k}]</b> {String(v)}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;