import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('READY');
  const [newUser, setNewUser] = useState({ login: '', password: '', role: 'user', limit: 10 });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://api.24efslgov.ru/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { setStatus('SECURITY_ERROR: IP_REJECTED'); }
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://api.24efslgov.ru/api/admin/create-user', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus('USER_CREATED');
      setNewUser({ login: '', password: '', role: 'user', limit: 10 });
      fetchUsers();
    } catch (err) { setStatus('CREATE_FAILED'); }
  };

  const handleUpdate = async (u) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://api.24efslgov.ru/api/admin/update-user', 
        { userId: u.id, limit_day: u.limit_day, role: u.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(`SAVED: ${u.login}`);
    } catch (err) { setStatus('SAVE_ERROR'); }
  };

  const editUser = (id, field, val) => {
    setUsers(users.map(u => u.id === id ? {...u, [field]: val} : u));
  };

  if (loading) return <div className="bg-black text-white h-screen flex items-center justify-center font-mono">LOADING_ADMIN_CORE...</div>;

  return (
    <div className="min-h-screen bg-[#0a0c0e] font-mono text-gray-400 p-8">
      <header className="max-w-7xl mx-auto mb-12 border-b border-white/5 pb-6 flex justify-between items-end">
        <div>
           <h1 className="text-white text-2xl font-black uppercase tracking-tighter">EFLS_Control_Center</h1>
           <p className="text-red-500 text-[9px] font-black uppercase tracking-[0.3em]">Hardware_IP_Validation: Active</p>
        </div>
        <div className="text-right text-[10px] font-bold text-green-500 uppercase">{status}</div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ФОРМА СОЗДАНИЯ */}
        <aside className="bg-[#121416] p-6 border border-white/5 shadow-2xl h-fit">
          <h2 className="text-white text-xs font-black uppercase mb-6 border-b border-white/10 pb-2">Register_New_Agent</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <input placeholder="LOGIN" className="admin-input" value={newUser.login} onChange={e => setNewUser({...newUser, login: e.target.value})} required />
            <input placeholder="PASSWORD" type="password" className="admin-input" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
            <input placeholder="LIMIT" type="number" className="admin-input" value={newUser.limit} onChange={e => setNewUser({...newUser, limit: e.target.value})} required />
            <select className="admin-input" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
               <option value="user">ROLE: USER</option>
               <option value="admin">ROLE: ADMIN</option>
            </select>
            <button type="submit" className="w-full bg-white text-black py-3 font-black uppercase text-[10px] hover:bg-green-500 transition-colors">Generate_Access</button>
          </form>
        </aside>

        {/* ТАБЛИЦА */}
        <main className="lg:col-span-3 bg-[#121416] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-white/5 text-gray-500 font-black uppercase border-b border-white/10">
                <th className="p-4">Agent</th>
                <th className="p-4">Network_Address</th>
                <th className="p-4">Daily_Usage</th>
                <th className="p-4">Current_Limit</th>
                <th className="p-4">System_Role</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-black">{u.login.toUpperCase()}</td>
                  <td className="p-4 font-mono text-blue-900">{u.last_ip}</td>
                  <td className="p-4 font-black text-orange-500 text-center">{u.used_day}</td>
                  <td className="p-4">
                    <input type="number" className="bg-black border border-white/10 text-white w-16 p-1 text-center" value={u.limit_day} onChange={e => editUser(u.id, 'limit_day', e.target.value)} />
                  </td>
                  <td className="p-4">
                    <select className="bg-black border border-white/10 text-white p-1" value={u.role} onChange={e => editUser(u.id, 'role', e.target.value)}>
                       <option value="user">USER</option>
                       <option value="admin">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleUpdate(u)} className="border border-white/20 px-3 py-1 text-[9px] font-black uppercase hover:bg-white hover:text-black">Commit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      <style>{`.admin-input { width: 100%; background: black; border: 1px solid rgba(255,255,255,0.1); padding: 10px; color: white; outline: none; font-size: 11px; } .admin-input:focus { border-color: white; }`}</style>
    </div>
  );
};

export default AdminPanel;