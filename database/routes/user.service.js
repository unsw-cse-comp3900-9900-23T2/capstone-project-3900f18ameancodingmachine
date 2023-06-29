import { poolPromise } from "../db-config/db_connection.js";

export async function createLogin(data) {
    //insert login details
    const query = `insert into LoginInfo (login, password) values (?, ?)`;
    const values = [data.login, data.password]
    const [results] = await poolPromise.execute(query, values);
    return {
        success: 1,
        data: results
    };
}

export async function createAddress(data) {
    //insert address details
    const query = `insert into Address (street, suburb, region, postcode) values (?, ?, ?, ?)`;
    const values = [
        data.street,
        data.suburb,
        data.region,
        data.postcode
    ]
    const [results] = await poolPromise.execute(query, values);
    return {
        success: 1,
        data: results
    };
}

export async function createUse(data) {
    //using both the insertIds of login and address, creates the User
    const query = `insert into UserAccount (first, last, login, address) values (?, ?, ?, ?)`;
    const values =  [
        data.first,
        data.last,
        data.loginId,
        data.addressId
    ]
    const [results] = await poolPromise.execute(query, values);
    return {
        success: 1,
        data: results
    };
}

export async function getUsers() {
    //gets all users
    const query = `select id, first, last, login, address from UserAccount`;
    const [results] = await poolPromise.execute(query, []);
    return {
        success: 1,
        data: results
    };
}

export async function getUserByUserId(id) {
    //gets user by id
    const query = `select id, first, last, login, address from UserAccount where id = ?`;
    const values = [id]
    const [results] = await poolPromise.execute(query, values);

    if (results.length == 0) {
        return {
            success: 0,
            message: "User not found"
        }
    }
    return {
        success: 1,
        data: results[0]
    };
}

//change to email when that is implemented 
export async function getLoginByUsername(username) {
    const query = `select * from LoginInfo where login = ?`;
    const values = [username]
    const [results] = await poolPromise.execute(query, values);

    if (results.length == 0) {
        return {
            success: 0,
            data: "Invalid username or password"
        };
    }
    return {
        success: 1,
        data: "Login successful"
    };
}

// returns multiple row if more than one cuisine
export async function getEateryByRestaurantId(id) {
    const query = `select name, address, phone, email, login, url 
    from EateryAccount ea
    where id = ?`;
    const values = [id]
    const [results] = await poolPromise.execute(query, values);
    if (results.length == 0) {
        return {
            success: 0,
            message: "Eatery not found"
        }
    } else {
        return {
            success: 1,
            data: results[0]
        };
    }
}

export async function getCuisineFromCuisineId(id) {
    const query = `select name from Cuisines where id = ?`;
    const values = [id]
    const [results] = await poolPromise.execute(query, values);
    if (results.length == 0) {
        return {
            success: 0,
            message: "Cuisine not found"
        }
    }
    return {
        success: 1,
        data: results[0]
    };
}

export async function createNewPost(data) {
    const query =  `insert into Posts (postedBy, title, content) values (?, ?, ?)`;
    const values =  [data.postedBy, data.title, data.content];
    const [results] = await poolPromise.execute(query,values);
    return {
        success: 1,
        data: results
    };
}

export async function getPostByPostId(id) {
    //gets post by id
    const query = `select id, postedBy, title, content from Posts where id = ?`;
    const value = [id]
    const [results] = await poolPromise.execute(query, value);

    if (results.length == 0) { // if no result
        return {
            success: 0,
            message: "Post not found"
        }
    } else {
        return {
            success: 1,
            data: results[0]
        };
    }
}

export async function createReviews(data) {
    const query = `insert into Reviews (userId, restaurantId, rating, comment) values (?, ?, ?, ?)`;
    const values =  [
        data.userId,
        data.restaurantId,
        data.rating,
        data.comment
    ]
    const [results] = await poolPromise.execute(query, values);
    return {
        success: 1,
        data: results
    };  
}

export async function getReviewByReviewId(id) {
    //gets post by id
    const query = `select id, userId, restaurantId, rating, comment from Reviews where id = ?`;
    const value = [id]
    const [results] = await poolPromise.execute(query, value);
    if (results.length == 0) {
        return {
            success: 0,
            message: "Review not found"
        }; 
    }
    return {
        success: 1,
        data: results[0]
    };
}

export async function insertSubscribedTo(data) {
    const query = `insert into SubscribedTo (userId,restaurantId) values (?, ?)`;
    const value = [data.userId, data.restaurantId];
    const[results] = await poolPromise.execute(query, value);
    return {
        success: 1,
        data: results
    };  
}

export async function insertHourFromRestaurant(data) {
    const values = [data.restaurantId, data.day, data.open, data.close]
    const query = `insert into BusinessHour (restaurantId, day, open, close) values (?, ?, ?, ?)`;
    const [results] = await poolPromise.execute(query, values);
    return {
        success: 1,
        data: results
    };  
}

export async function insertCuisineFromRestaurant(data) {
    const restaurant = data.restaurantId;
    const cuisine = data.cuisineId;
    const values = [restaurant, cuisine]
    const query = `insert into CuisineOffer(restaurantId, cuisineId) values (?, ?)`
    const [results] = await poolPromise.execute(query, values);
    return {
        success: 1,
        data: results
    } 
}

// create new cuisine
export async function insertNewCuisineName(data) {
    const name = data.name;
    const searchQuery = `select * from Cuisines where name = ?`;
    const [result1] = await poolPromise.execute(searchQuery,[name]);

    // cuisine exist
    if (result1.length != 0) {
        return {
            success: 0,
            message: "Cuisine name already exist"
        };
    }

    const insertQuery = `insert into Cuisines(name) values (?)`;
    const [result] = await poolPromise.execute(insertQuery,[name]);
    return {
        success: 1,
        results: result
    };
}

// create new eatery account
export async function createEateryAccount(data) {
    const name = data.name;
    const query = `insert into EateryAccount(name, address, phone, email, login, url) values (?, ?, ?, ?, ?, ?)`;
    const values = [data.name, data.address, data.phone, data.email, data.login, data.url];
    const [result] = await poolPromise.execute(query,values);
    return {
        success: 1,
        results: result
    };
}