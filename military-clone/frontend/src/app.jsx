import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cabinet from './pages/Cabinet';
import Home from './pages/Home';
import ReportPage from './pages/ReportPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/" element={token ? <Cabinet /> : <Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;