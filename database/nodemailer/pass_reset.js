import { poolPromise } from "../db-config/db_connection.js";

const resetCodes = [];
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

async function generateResetCode(data) {
    const [existing] = await poolPromise.execute(`select * from LoginInfo where login = ?`, [data.login]);
    if (existing.length === 0) {
        return {
            success: 0,
            message: 'No account with this email'
        };
    }
    const email = data.login;
    const code = generateResetCode(7);
    resetCodes.push({login: email, code: code})
    return {
        success: 1,
        message: "Code generated"
    };
}

export async function verfiyResetCode(data) {
    const result = resetCodes.find(element => element.login == data.login);
    if (result && result.code == data.code) {
        return {
            success: 1,
            message: "Code matches"
        };
    }
    return {
        success: 0,
        message: "Invalid code"
    };
} 

//generate the random reset code
function generateResetCode(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}