const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function seed() {
    const conn = await mysql.createConnection({
        host: 'localhost', user: 'cg350971_user', password: 'SDCARDbig888', database: 'cg350971_user'
    });
    
    const login = 'test';
    const pass = '12345'; // Твой пароль для теста
    const hash = await bcrypt.hash(pass, 10);

    await conn.execute('INSERT INTO users (login, password) VALUES (?, ?)', [login, hash]);
    console.log("Тестовый пользователь создан: admin / 12345");
    process.exit();
}
seed();