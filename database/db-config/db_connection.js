import 'dotenv/config';
import mysql from 'mysql2';

// note:
// if you want to test the route implementation and keeping the data from database
// use  DB_DATABASE_TEST in env which is eatery_test database

// initialize pool
const config = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE_TEST,
  port: process.env.DB_PORT
};

const pool = mysql.createPool(config)

const poolPromise = pool.promise();


export { pool, poolPromise };


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