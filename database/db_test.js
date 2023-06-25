// this file is to test the pool export from db_connection.js
import { pool } from "./db_connection.js"

pool.getConnection(function(err, conn) {
    // Do something with the connection
    conn.query('SELECT * from UserAccount',
        function(err, results, fields) {
            if (err) console.log("error: " + err);
            console.log(results);
        }
    );
    // Don't forget to release the connection when finished!
    pool.releaseConnection(conn);
    pool.end()
});