import pkg from "jsonwebtoken";
import 'dotenv/config';
const { verify } = pkg;


//ensure that token provided is valid
export function checkToken(req, res, next) {
    //get authorization field from the header
    let token = req.get("authorization");
    //check if token present
    if (token) {
        //skip 'Bearer' and get the actual token
        token = token.slice(7);
        verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    success: 0,
                    message: "Invalid token"
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