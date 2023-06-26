import 'dotenv/config';
import mysql from 'mysql2';

// project config
const config = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
};

// for local mysql testing
// make sure to donwload mysql first
const local_config = {
  host: process.env.LOCAL_HOST,
  user: process.env.LOCAL_USER,
  password: process.env.LOCAL_PASSWORD,
  database: process.env.LOCAL_DATABASE
};

const pool = mysql.createPool(config);
const localpool = mysql.createPool(local_config);

const poolPromise = pool.promise();
const poolPromiseLocal = localpool.promise();

export { pool, poolPromise, poolPromiseLocal };


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