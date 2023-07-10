import nodemailer from "nodemailer";

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
async function send(data) {
    const email = {
        from : "savourymessenger@gmail.com",
        to : data.recipientEmail,
        subject: data.subject,
        text: data.text
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

export async function sendEmail(req, res) {
    try {
        const data = req.body;
        const result = await send(data);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: 0,
            message: "Email Error"
        });
    }
}