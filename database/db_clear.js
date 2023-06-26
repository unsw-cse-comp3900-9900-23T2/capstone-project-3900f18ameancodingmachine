// use this if you want to test database and want it to be empty
// ignore this file, it is not used anymore
import { poolPromise } from "./db_connection.js"

export async function clearDatabase() {
    const userQuery = 'truncate UserAccount;';
    const loginQuery = 'truncate LoginInfo;';
    await poolPromise.execute(userQuery);
    await poolPromise.execute(loginQuery);
}