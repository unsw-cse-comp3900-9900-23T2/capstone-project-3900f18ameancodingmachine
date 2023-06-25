// this file is to test the pool export from db_connection.js
import { getLoginId, insertLogin } from "./db_function.js";

const new_username = 'allansugi';
const new_password = 'pass';
insertLogin(new_username, new_password);
getLoginId(new_username);


// let loginId = getLoginId(new_username, pool);

// pool.getConnection(function(err, conn) {
//     // Do something with the connection
//     conn.query('SELECT * from LoginInfo',
//         function(err, results, fields) {
//             if (err) console.log("error: " + err);
//             console.log(results);
//         }
//     );
//     // Don't forget to release the connection when finished!
//     pool.releaseConnection(conn);
//     pool.end()
// });