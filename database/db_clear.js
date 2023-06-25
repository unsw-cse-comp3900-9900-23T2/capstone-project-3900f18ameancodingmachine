// temporary file to delete data from tables
import { pool } from "./db_connection.js"

function deleteAllUserAccount() {
    pool.getConnection(function(err, conn) {
        // Do something with the connection
        conn.query('delete from UserAccount',
            function(err, results, fields) {
                if (err) console.log("error: " + err);
                console.log(results);
            }
        );
    
        conn.query('delete from LoginInfo',
            function(err, results, fields) {
                if (err) console.log("error: " + err);
                console.log(results);
            }
        );
        // Don't forget to release the connection when finished!
        pool.releaseConnection(conn);
        pool.end()
    });
}

deleteAllUserAccount;