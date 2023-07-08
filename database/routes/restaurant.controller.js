import { createNewVoucher, updateExistingDescription } from "./restaurant.service.js"

export async function createVoucher(req, res) {
    try {
        const body = req.body
        console.log(body)
        const result = await createNewVoucher(body)
        return res.status(200).json(result)
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        })
    }
}

export async function updateDescription(req, res) {
    try {
        const body = req.body
        const result = await updateExistingDescription(body);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        })
    }
}