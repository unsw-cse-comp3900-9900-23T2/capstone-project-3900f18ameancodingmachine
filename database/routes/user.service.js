import { pool, poolPromise } from "../db-config/db_connection.js";

export function createLogin(data, callBack) {
    //insert login details
    pool.execute(
        `insert into LoginInfo (login, password) values (?, ?)`,
        [
            data.login,
            data.password
        ],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
}

export function createAddress(data, callBack) {
    //insert address details
    pool.execute(
        `insert into Address (street, suburb, region, postcode) values (?, ?, ?, ?)`,
        [
            data.street,
            data.suburb,
            data.region,
            data.postcode
        ],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
}

export function createUse(data, callBack) {
    //using both the insertIds of login and address, creates the User
    pool.execute(
        `insert into UserAccount (first, last, login, address) values (?, ?, ?, ?)`,
        [
            data.first,
            data.last,
            data.loginId,
            data.addressId
        ],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
}

export function getUsers(callBack) {
    //gets all users
    pool.execute(
        `select id, first, last, login, address from UserAccount`,
        [],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    )
}

export function getUserByUserId(id, callBack) {
    //gets user by id
    pool.execute(
        `select id, first, last, login, address from UserAccount where id = ?`,
        [id],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    );
}

//change to email when that is implemented 
export function getLoginByUsername(username, callBack) {
    pool.execute(
        `select * from LoginInfo where login = ?`,
        [username],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    )
}

export function createEateryAccount(data, callBack) {
    pool.execute(
        `insert into EateryAccount(name, address, phone, email, login, url) values (?, ?, ?, ?, ?, ?)`,
        [data.name, data.address, data.phone, data.email, data.login, data.url],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    )
}

// returns multiple row if more than one cuisine
export function getEateryByRestaurantId(id, callBack) {
    const query = `select name, address, phone, email, login, url 
                    from EateryAccount ea
                    where id = ?`;
    pool.execute(
        query,
        [id],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    )
}

export function getCuisineFromCuisineId(id, callBack) {
    const query = `select name 
                    from Cuisines
                    where id = ?`;
    pool.execute(
        query,
        [id],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    )
}

export async function insertNewCuisineName2(body) {
    try {
        const name = body.name;
        const query = `insert into Cuisine(name) values (?)`;
        const [result] = await poolPromise.execute(query,[name]);
        return res.status(200).json({
            success: 1,
            results: result
        });
    } catch (err) {
        return res.status(500).json({
            success: 0,
            results: 'Database Connection Error'
        });
    }
}

export function insertNewCuisineName(data, callBack) {
    const query = `insert into Cuisines(name) values (?)`;
    pool.execute(
        query,
        [data.name],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    )
}

// given restaurantId and name of the cuisine
export function insertCuisineFromRestaurant(data, callBack) {
    // assume that cuisine name exist in cuisine offer
    const query = `insert into CuisineOffer(restaurantId, cuisineId)
                    value(?, (select id from Cusines where name=?))`;
    pool.execute(
        query,
        [data.restaurantId, data.cusineName],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    )
}

export function createPosts(data, callBack) {
    pool.execute(
        `insert into Posts (postedBy, title, content) values (?, ?, ?)`,
        [
            data.postedBy,
            data.title,
            data.content
        ],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
}

export function getPostByPostId(id, callBack) {
    //gets post by id
    pool.execute(
        `select id, postedBy, title, content from Posts where id = ?`,
        [id],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    );
}

export function createReviews(data, callBack) {
    pool.execute(
        `insert into Reviews (userId, restaurantId, rating, comment) values (?, ?, ?, ?)`,
        [
            data.userId,
            data.restaurantId,
            data.rating,
            data.comment
        ],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
}

export function getAllReviewsByRestaurantId(id, callBack) {
    pool.execute(
        `select e.id, u.first, u.last
        from UserAccount u
        join Reviews r
        on u.userId = r.userId
        where id = ?`,
        [id],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    );
}

export function createSubscription(data, callBack) {
    pool.execute(
        `insert into SubscribedTo (userId, restaurantId) values (?, ?)`,
        [
            data.userId,
            data.restaurantId
        ],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
}

export function getUserNameBySubscription(id, callBack) {
    // checks which restaurants the user subscribed
    pool.execute(
        `select u.userId, u.first, u.last, e.name
        from UserAccount u
        join SubscribedTo st
        on u.userId = st.userId
        join EateryAccount e
        on e.id = st.restaurantId
        where id = ?`,
        [id],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    );
}

export function insertHourFromRestaurant(data, callback) {
    const query = `insert into BusinessHour (restaurantId, day, open, close) values (?, ?, ?, ?)`;
    const values = [data.restaurantId, data.day, data.open, data.close]
    pool.execute(
        query,
        values,
        (error, results, fields) => {
            if (error) return callback(error);
            return callback(null, results);
        }
    )
}