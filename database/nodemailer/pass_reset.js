import { poolPromise } from "../db-config/db_connection.js";

const resetCodes = [];
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export async function generateResetcode(data) {
    const [existing] = await poolPromise.execute(`select * from LoginInfo where login = ?`, [data.login]);
    if (existing.length === 0) {
        return {
            success: 0,
            message: 'No account with this email'
        };
    }
    //TODO: fix confusion between login and email.
    const email = data.login;
    const code = generateCode(7);
    const resetReq = {login: email, code: code};
    resetCodes.push(resetReq);
    return {
        success: 1,
        data: resetReq
    };
}

export function verfiyResetCode(req, res) {
    const data = req.params;
    console.log(data.code)
    const result = resetCodes.find(element => element.login === data.login);
    if (result && result.code === data.code) {
        //remove all reset codes for user
        resetCodes = resetCodes.filter(element => element.login != data.login);
        return res.status(200).json({
            success: 1,
            message: "Code matches"
        });
    }
    return res.json({
        success: 0,
        message: "Invalid code"
    });
} 

//generate the random reset code
function generateCode(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}