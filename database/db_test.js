// this file is to test queries
import { insertLogin, insertUserAccount } from "./db_function.js";

const new_username = 'firstuser';
const new_password = 'pass';
const first = 'first';
const last = 'last';
const address = 1;

await insertLogin(new_username, new_password);
await insertUserAccount(first, last, new_username, address);
console.log("success");