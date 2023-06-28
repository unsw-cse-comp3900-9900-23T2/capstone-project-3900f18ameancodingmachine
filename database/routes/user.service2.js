import { poolPromise } from "../db-config/db_connection.js";

// same function from user.service.js but using async/await for
// asynchrounous handling
export async function createBusinessHour2(req,res) {
    try {
        const data = req.body;
        const values = [data.restaurantId, data.day, data.open, data.close]
        const query = `insert into BusinessHour (restaurantId, day, open, close) values (?, ?, ?, ?)`;
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results
        });  
    } catch(err) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function createRestaurantCusine2(req, res) {
    try {
        const body = req.body;
        const restaurant = body.restaurantId;
        const cuisine = body.cuisineId;
        const values = [restaurant, cuisine]
        const query = `insert into CuisineOffer(restaurantId, cuisineId) values (?, ?)`
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results
        })  
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function createCuisine2(req, res) {
    try {
        const body = req.body;
        const name = body.name;
        const searchQuery = `select * from Cuisines where name = ?`;
        const [result1] = await poolPromise.execute(searchQuery,[name]);

        if (result1.length != 0) {
            return res.status(409).json({
                success: 0,
                message: "cuisine name already exist"
            });
        }

        const insertQuery = `insert into Cuisines(name) values (?)`;
        const [result] = await poolPromise.execute(insertQuery,[name]);
        return res.status(200).json({
            success: 1,
            results: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            results: 'Database Connection Error'
        });
    }
}

export async function createEatery2(req, res) {
    try {
        const body = req.body;
        const name = body.name;
        const query = `insert into EateryAccount(name, address, phone, email, login, url) values (?, ?, ?, ?, ?, ?)`;
        const values = [body.name, body.address, body.phone, body.email, body.login, body.url];
        const [result] = await poolPromise.execute(query,values);
        return res.status(200).json({
            success: 1,
            results: result
        });
    } catch (err) {
        return res.status(500).json({
            success: 0,
            results: 'Database Connection Error'
        })
    }
}