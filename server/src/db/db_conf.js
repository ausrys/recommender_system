import { createConnection } from 'mysql';
import 'dotenv/config'
const mysql_connection = createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TABLE
    });
    mysql_connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
    export default (mysql_connection);