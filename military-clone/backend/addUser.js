const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createUser() {
    const connection = await mysql.createConnection({
        host: 'localhost', user: 'ch965163_pizd', password: 'uT_ePyTzNLdH99Qссссссс', database: 'ch965163_pizd'
    });

    const login = 'admin'; // Ваш логин
    const pass = '12345'; // Ваш желаемый пароль
    const hashedPass = await bcrypt.hash(pass, 10);

    await connection.execute('INSERT INTO users (login, password) VALUES (?, ?)', [login, hashedPass]);
    console.log("Пользователь создан!");
    await connection.end();
}
createUser();