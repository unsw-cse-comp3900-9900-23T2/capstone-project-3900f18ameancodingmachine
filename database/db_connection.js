const mysql = require('mysql2');

require('dotenv').config()

// initialize pool
const pool = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
});

pool.query()

module.exports = pool;




// testing connection
// var connection = mysql.createConnection({
//    host     : process.env.DB_HOST,
//    user     : process.env.DB_USER,
//    password : process.env.DB_PASSWORD,
//    database : process.env.DB_DATABASE
// });
 
// connection.connect(function(err) {
//   if (err) {
//     console.log("err: " + err.message);
//   }
//   console.log('connected to aws server')
// });
 
// connection.query('select first from UserAccount', function (error, results, fields) {
//   if (error){
//     throw error;
//   } 
//   console.log(results);
// });
 
// connection.end();