import { pool } from "./db_connection.js";

function insertLogin(username, password) {
    const query_1 = `insert into LoginInfo(login, password) values ("${username}", "${password}");`;
    pool.getConnection(function(err, conn) {
        // Do something with the connection
        conn.query(query_1,
            function(err, results, fields) {
                conn.release()
                if (err) console.log("error: " + err);
                console.log("login inserted");
            }
        );
    });
};

// haven't include the address yet
function getLoginId(username) {
    // const pool = createPool(config);
    const query_2 = `select id from LoginInfo`;
    pool.getConnection(function(err, conn) {
        // Do something with the connection
        conn.query(query_2,
            function(err, results, fields) {
                conn.release()
                if (err) console.log("error: " + err);
                console.log(results);
                return results;
            }
        );
        // Don't forget to release the connection when finished!
        
    });
};

// haven't include the address yet
function insertUserAccount(first, last, loginId) {
    // const pool = createPool(config);
    pool.getConnection(function(err, conn) {
        // Do something with the connection
        const query_3 = `insert into UserAccount (first, last, login, address)
                        values ("${first}", "${last}", "${loginId}", null);`;
        conn.query(query_3,
            function(err, results, fields) {
                if (err) console.log("error: " + err);
            }
        );
        // Don't forget to release the connection when finished!
        pool.releaseConnection(conn);
    });
};

export { getLoginId, insertLogin };
// test

// insertUserAccount('allan', 'sugianto', loginId);