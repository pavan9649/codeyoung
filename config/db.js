const mysql = require('mysql');
const path = require('path');
const { promisify } = require('util');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const con = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT)
});


// connect to your database
con.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ERR_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION IS REFUSED');
        }
    }

    if (connection) {
        connection.release();
        console.log('MySQL DB is Connected');
        return;
    }

});

con.query = promisify(con.query);

module.exports =con