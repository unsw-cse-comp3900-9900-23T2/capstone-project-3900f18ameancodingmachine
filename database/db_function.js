import { poolPromise } from "./db_connection.js";

async function insertLogin(username, password) {
    const query_1 = `insert into LoginInfo(login, password) values (?, ?);`;
    await poolPromise.execute(query_1, [username, password]);
};

async function getLoginId(username, query) {
    const query_2 = `select id from LoginInfo where login = ?`;
    const [rows] = await poolPromise.execute(query, [username]);
    return rows[0].id;
};

// haven't include the address yet
async function insertUserAccount(first, last, username, address) {
    const query = `select id from LoginInfo where login = ?`;
    const query_2 = `insert into UserAccount (first, last, login, address)
                        values (?, ?, ?, ?);`;
    const loginId = await getLoginId(username, query);
    await poolPromise.execute(query_2, [first, last, loginId, address]);
};

async function insertEateryAccount(name, address, phone, email, username, url) {
    const query_1 = `select id from LoginInfo where login = ?`
    const query_2 = `insert into UserAccount (name, address, phone, email, login, url)
                        values (?, ?, ?, ?);`;
    const loginId = await getLoginId(username, query_1);
    await poolPromise.execute(query_2, [name, address, phone, email, loginId, url]);
};

export { insertLogin, insertUserAccount, insertEateryAccount };