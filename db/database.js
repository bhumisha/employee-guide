const mysql = require('mysql2');
require('dotenv').config(); 

// Create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'cmsDB'
  });
  
  module.exports = connection;