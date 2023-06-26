import { poolPromise, poolPromiseLocal } from "./db_connection.js";

const pool = poolPromiseLocal;

async function insertLogin(username, password) {
    const query_1 = `insert into LoginInfo(login, password) values (?, ?);`;
    await pool.execute(query_1, [username, password]);
};

async function getLoginId(username) {
    const query = `select id from LoginInfo where login = ?`;
    const [rows] = await pool.execute(query, [username]);
    return rows[0].id;
};

// haven't include the address yet
async function insertUserAccount(first, last, username, address) {
    const query = `insert into UserAccount (first, last, login, address)
                        values (?, ?, ?, ?);`;
    const loginId = await getLoginId(username);
    await pool.execute(query, [first, last, loginId, address]);
};

async function insertAddress(username, street, suburb, region, postcode) {
    const query = `insert into Adress (street, suburb, region, postcode)
                    values (?, ?, ?, ?)`;
    const loginId = getLoginId(username);
    await pool.execute(query, [street, suburb, region, postcode]);
}

async function insertEateryAccount(name, address, phone, email, username, url) {
    const query_1 = `select id from LoginInfo where login = ?`
    const query_2 = `insert into UserAccount (name, address, phone, email, login, url)
                        values (?, ?, ?, ?);`;
    const loginId = await getLoginId(username, query_1);
    await pool.execute(query_2, [name, address, phone, email, loginId, url]);
};

export { insertLogin, insertUserAccount, insertEateryAccount };