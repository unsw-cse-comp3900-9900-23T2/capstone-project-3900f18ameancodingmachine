const mysql = require('mysql2');

// initialize pool
const pool = mysql.createPool({
  host     : 'database-1.cmx82qjaikhh.ap-southeast-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'TbLYVKJdYlhgXSYhxkp2',
  port     : '3306'
});

module.exports = pool;





// var connection = mysql.createConnection({
//   host     : 'database-1.cmx82qjaikhh.ap-southeast-2.rds.amazonaws.com',
//   user     : 'admin',
//   password : 'TbLYVKJdYlhgXSYhxkp2',
//   port     : '3306'
// });
 
// connection.connect(function(err) {
//   if (err) {
//     console.log("err: " + err.message);
//   }
//   console.log('connected to aws server')
// });
 
// connection.query('show databases', function (error, results, fields) {
//   if (error){
//     throw error;
//   } 
//   console.log(results);
// });
 
// connection.end();