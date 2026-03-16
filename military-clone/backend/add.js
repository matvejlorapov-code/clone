const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
    host: 'localhost',
    user: 'cg350971_user',      // ТВОЙ ЛОГИН БД
    password: 'SDCARDbig888', // ТВОЙ ПАРОЛЬ БД
    database: 'cg350971_user'   // ТВОЕ ИМЯ БД
};

async function init() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log(">>> [1/3] Подключение к БД установлено.");

        // 1. Создаем таблицу с нуля со всеми нужными полями
        const createTableSQL = `
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                login VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                last_ip VARCHAR(45) DEFAULT '0.0.0.0',
                limit_day INT DEFAULT 100,
                used_day INT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await connection.execute(createTableSQL);
        console.log(">>> [2/3] Таблица 'users' создана успешно.");

        // 2. Генерируем хеш для пароля '12345'
        const rawPassword = '12345';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 3. Вставляем админа
        const insertUserSQL = `
            INSERT INTO users (login, password, limit_day) 
            VALUES (?, ?, ?);
        `;
        await connection.execute(insertUserSQL, ['admin', hashedPassword, 999]);
        
        console.log(">>> [3/3] Пользователь 'admin' создан.");
        console.log("---------------------------------------");
        console.log("ДАННЫЕ ДЛЯ ВХОДА:");
        console.log("ЛОГИН: admin");
        console.log("ПАРОЛЬ: 12345");
        console.log("---------------------------------------");

    } catch (err) {
        console.error("!!! ПРОИЗОШЛА ОШИБКА:", err.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

init();