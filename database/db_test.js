// this file is to test queries
import { getLoginId, insertLogin, insertUserAccount } from "./db_function.js";

const new_username = 'allansugi';
const new_password = 'pass';
await insertLogin(new_username, new_password);
const loginId  = await getLoginId(new_username);
console.log(loginId)
await insertUserAccount('Allan', 'Sugianto', loginId);
console.log("success");