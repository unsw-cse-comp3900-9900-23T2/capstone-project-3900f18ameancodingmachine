import { pool, poolPromise } from "../db-config/db_connection.js";

export async function createLogin(data) {
    //insert login details
    try {
        const query = `insert into LoginInfo (login, password) values (?, ?)`;
        const values = [data.login, data.password]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function createAddress(data) {
    //insert address details
    try {
        const query = `insert into Address (street, suburb, region, postcode) values (?, ?, ?, ?)`;
        const values = [
            data.street,
            data.suburb,
            data.region,
            data.postcode
        ]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function createUse(data) {
    //using both the insertIds of login and address, creates the User
    try {
        const query = `insert into UserAccount (first, last, login, address) values (?, ?, ?, ?)`;
        const values =  [
            data.first,
            data.last,
            data.loginId,
            data.addressId
        ]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function getUsers() {
    //gets all users
    try {
        const query = `select id, first, last, login, address from UserAccount`;
        const [results] = await poolPromise.execute(query, []);
        return res.status(200).json({
            success: 1,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function getUserByUserId(id) {
    //gets user by id
    try {
        const query = `select id, first, last, login, address from UserAccount where id = ?`;
        const values = [id]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

//change to email when that is implemented 
export async function getLoginByUsername(username) {
    try {
        const query = `select * from LoginInfo where login = ?`;
        const values = [username]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

// returns multiple row if more than one cuisine
export async function getEateryByRestaurantId(id) {
    try {
        const query = `select name, address, phone, email, login, url 
        from EateryAccount ea
        where id = ?`;
        const values = [id]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function getCuisineFromCuisineId(id) {
    try {
        const query = `select name from Cuisines where id = ?`;
        const values = [id]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function createNewPost(data) {
    try {
        const query =  `insert into Posts (postedBy, title, content) values (?, ?, ?)`;
        const values =  [data.postedBy, data.title, data.content];
        const [results] = await poolPromise.execute(query,values);
        return res.status(200).json({
            success: 1,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function getPostByPostId(id) {
    //gets post by id
    try {
        const query = `select id, postedBy, title, content from Posts where id = ?`;
        const value = [id]
        const [results] = await poolPromise.execute(query, value);
        return res.status(200).json({
            success: 1,
            data: results[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
}

export async function createReviews(data) {
    try {
        const query = `insert into Reviews (userId, restaurantId, rating, comment) values (?, ?, ?, ?)`;
        const values =  [
            data.userId,
            data.restaurantId,
            data.rating,
            data.comment
        ]
        const [results] = await poolPromise.execute(query, values);
        return res.status(200).json({
            success: 1,
            data: results
        });  
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Database connection error"
        });
    }
    
}

export async function createSubscribedTo(data) {
    try {
        const query = `insert into SubscribedTo (userId,restaurantId) values (?, ?)`;
        const value = [data.userId, data.restaurantId];
        const[results] = await poolPromise.execute(query, value);
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

export async function insertHourFromRestaurant(data) {
    try {
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

export async function createRestaurantCusine(req, res) {
    try {
        const data = req.data;
        const restaurant = data.restaurantId;
        const cuisine = data.cuisineId;
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

// create new cuisine
export async function createCuisine(data) {
    try {
        const name = data.name;
        const searchQuery = `select * from Cuisines where name = ?`;
        const [result1] = await poolPromise.execute(searchQuery,[name]);

        // cuisine exist
        if (result1.length != 0) {
            return res.status(200).json({
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

// create new eatery account
export async function createEateryAccount(data) {
    try {
        const name = data.name;
        const query = `insert into EateryAccount(name, address, phone, email, login, url) values (?, ?, ?, ?, ?, ?)`;
        const values = [data.name, data.address, data.phone, data.email, data.login, data.url];
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