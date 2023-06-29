import pkg from "jsonwebtoken";
import 'dotenv/config';
import { tokenBlackList } from "../routes/user.controller.js";
const { verify } = pkg;



//ensure that token provided is valid
export function checkToken(req, res, next) {
    //get authorization field from the header
    let token = req.cookies.token;
    //check token is present and not blacklisted
    if (token && !tokenBlackList.includes(token)) {
        verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    success: 0,
                    message: "Access denied: Invalid token"
                });
            } else {
                next();
            }
        });
    } else {
        res.json({
            success:0,
            message: "Access denied: unauthorized user"
        });
    }
}