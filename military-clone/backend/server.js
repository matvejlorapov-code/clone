const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const ADMIN_IP = 'ВАШ_IP'; // Узнайте на 2ip.ru
const JWT_SECRET = 'EFLS_SECURE_777_PROD';
const HIMERA_KEY = '31ed0db649d69d5091a2d70e41f9b0b8';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'cg350971_db', // Ваш логин БД
    password: 'uT_ePyTzNLdH99Q',
    database: 'cg350971_db'
});

const getClientIp = (req) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return ip.replace(/^.*:/, '');
};

// Проверка админа по IP
const checkAdminAuth = (req, res, next) => {
    if (getClientIp(req) === ADMIN_IP) return next();
    res.status(403).json({ message: "FORBIDDEN_HARDWARE" });
};

// Логин
app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE login = ?', [login]);
        if (rows.length === 0) return res.status(401).json({ message: "AUTH_FAILED" });
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) return res.status(401).json({ message: "AUTH_FAILED" });
        
        await pool.execute('UPDATE users SET last_ip = ? WHERE id = ?', [getClientIp(req), rows[0].id]);
        const token = jwt.sign({ id: rows[0].id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token, loginTime: Date.now() });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Поиск (Прокси)
app.post('/api/search', async (req, res) => {
    const { type, queryData, token } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [users] = await pool.execute('SELECT used_day, limit_day FROM users WHERE id = ?', [decoded.id]);
        if (users[0].used_day >= users[0].limit_day) return res.json({ status: "error", message: "LIMIT_REACHED" });

        const params = new URLSearchParams();
        params.append('key', HIMERA_KEY);
        Object.keys(queryData).forEach(k => params.append(k, queryData[k]));

        const response = await axios.post(`https://api.himera-search.info/2.0/${type}`, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.data.status === 'ok') {
            await pool.execute('UPDATE users SET used_day = used_day + 1 WHERE id = ?', [decoded.id]);
        }
        res.json(response.data);
    } catch (e) { res.status(401).json({ message: "INVALID_SESSION" }); }
});

// Админка
app.get('/api/admin/users', checkAdminAuth, async (req, res) => {
    const [rows] = await pool.execute('SELECT id, login, last_ip, limit_day, used_day FROM users');
    res.json(rows);
});

app.post('/api/admin/update-limits', checkAdminAuth, async (req, res) => {
    const { userId, limit_day } = req.body;
    await pool.execute('UPDATE users SET limit_day = ? WHERE id = ?', [limit_day, userId]);
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));