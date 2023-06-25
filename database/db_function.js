import { pool, poolPromise } from "./db_connection.js";

async function insertLogin(username, password) {
    const query_1 = `insert into LoginInfo(login, password) values (?, ?);`;
    await poolPromise.execute(query_1, [username, password]);
};


async function getLoginId(username) {
    // const pool = createPool(config);
    const query_2 = `select id from LoginInfo where login = ?`;
    const [rows] = await poolPromise.execute(query_2, [username]);
    return rows[0].id;
};

// haven't include the address yet
async function insertUserAccount(first, last, loginId) {
    const query_3 = `insert into UserAccount (first, last, login, address)
                        values (?, ?, ?, null);`;
    await poolPromise.execute(query_3, [first, last, loginId]);
};

export { getLoginId, insertLogin, insertUserAccount };