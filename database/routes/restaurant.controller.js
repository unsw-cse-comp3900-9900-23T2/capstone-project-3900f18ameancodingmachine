import {
    createNewVoucher,
    getAllCuisines,
    getAllEateries,
    updateExistingDescription,
    createEateryAccount,
    createRestaurantDietary,
    createNewMenu
} from './restaurant.service.js'

export async function createVoucher (req, res) {
    try {
        const body = req.body
        console.log(body)
        const result = await createNewVoucher(body)
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function updateDescription (req, res) {
    try {
        const body = req.body
        const result = await updateExistingDescription(body)
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function getCuisines (req, res) {
    try {
        const results = await getAllCuisines()
        console.log(results)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: 'Database conenction error'
        })
    }
}

export async function getEateries (req, res) {
    try {
        const results = await getAllEateries()
        console.log(results)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function createEatery (req, res) {
    try {
        const body = req.body
        const result = await createEateryAccount(body)
        if (result.success === 0) {
            return res.status(400).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: 0,
            message: 'Database conenction error'
        })
    }
}

export async function createEateryDietary (req, res) {
    try {
        const body = req.body
        const result = await createRestaurantDietary(body)
        return res.status(200).json(result)
    } catch (err) {
        if (err.errno === 1062) {
            return res.status(409).json({
                success: 0,
                message: 'Entered duplicate record'
            })
        }
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function createMenu (req, res) {
    try {
        const body = req.body
        const result = await createNewMenu(body)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}
