import nodemailer from "nodemailer";
import {generateResetcode} from "./pass_reset.js";

export const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "savourymessenger@gmail.com",
        pass: "garnmfzabynfuzst"
    }
};


//use this to send an email
async function sendCode(data) {
    const email = {
        from : "savourymessenger@gmail.com",
        to : data.login,
        subject: "Password Recovery - Do not share",
        text: `Your code is ${data.code}`
    };
    const transporter = nodemailer.createTransport(config);
    const info = await transporter.sendMail(email);
    if (info) {
        return {
            success: 1,
            data: info
        };
    } else {
        return {
            success: 0,
            message: "Email failed"
        }
    }
}

export async function passwordRecovery(req, res) {
    try {
        const data = req.body;
        const resetCode = await generateResetcode(data);
        if (resetCode.success === 0) {
            return res.status(200).json({
                success: 0,
                message: "Invalid email"
            });
        }
        const result = await sendCode(resetCode.data);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: 0,
            message: "Database Error"
        });
    }
}