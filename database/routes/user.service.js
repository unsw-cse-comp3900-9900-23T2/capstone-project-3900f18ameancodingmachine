import { poolPromise } from '../db-config/db_connection.js'

export async function createLogin (data) {
    // insert login details
    const [existing] = await poolPromise.execute('select * from LoginInfo where login = ?', [data.login])
    if (existing.length !== 0) {
        return {
            success: 0,
            message: 'Username already exists'
        }
    }
    const query = 'insert into LoginInfo (login, password) values (?, ?)'
    const values = [data.login, data.password]
    const [results] = await poolPromise.execute(query, values)
    return {
        success: 1,
        data: results
    }
}

export async function createAddress (data) {
    // insert address details
    const query = 'insert into Address (street, suburb, region, postcode) values (?, ?, ?, ?)'
    const values = [
        data.street,
        data.suburb,
        data.region,
        data.postcode
    ]
    const [results] = await poolPromise.execute(query, values)
    return {
        success: 1,
        data: results
    }
}

export async function createUse (data) {
    // using both the insertIds of login and address, creates the User
    const query = 'insert into UserAccount (first, last, login, address) values (?, ?, ?, ?)'
    const values = [
        data.first,
        data.last,
        data.loginId,
        data.addressId
    ]
    const [results] = await poolPromise.execute(query, values)
    return {
        success: 1,
        data: results
    }
}

export async function getUsers () {
    // gets all users
    const query = 'select id, first, last, login, address from UserAccount'
    const [results] = await poolPromise.execute(query, [])
    return {
        success: 1,
        data: results
    }
}

export async function getUserByLoginId (id) {
    // gets all users
    const query = 'select id, first, last, login, address from UserAccount where login = ?'
    const [results] = await poolPromise.execute(query, [id])
    return {
        success: 1,
        data: results
    }
}

export async function getUserByUserId (id) {
    // gets user by id
    const query = 'select id, first, last, login, address from UserAccount where id = ?'
    const values = [id]
    const [results] = await poolPromise.execute(query, values)

    if (results.length === 0) {
        return {
            success: 0,
            message: 'User not found'
        }
    }
    return {
        success: 1,
        data: results[0]
    }
}

// change to email when that is implemented
// update: adding loginid as a return
export async function getLoginByUsername (username) {
    const query = 'select * from LoginInfo where login = ?'
    const values = [username]
    const [results] = await poolPromise.execute(query, values)

    if (results.length === 0) {
        return {
            success: 0,
            data: 'Invalid username or password'
        }
    }
    return {
        success: 1,
        id: results[0].id,
        password: results[0].password
    }
}

// returns multiple row if more than one cuisine
export async function getEateryByRestaurantId (id) {
    const query = `select name, address, phone, email, login, url 
    from EateryAccount ea
    where id = ?`
    const values = [id]
    const [results] = await poolPromise.execute(query, values)
    if (results.length === 0) {
        return {
            success: 0,
            message: 'Eatery not found'
        }
    } else {
        return {
            success: 1,
            data: results[0]
        }
    }
}

export async function getEateryByLoginId (id) {
    const query = `select id, name, address, phone, email, url 
    from EateryAccount ea
    where login = ?`
    const values = [id]
    const [results] = await poolPromise.execute(query, values)
    if (results.length === 0) {
        return {
            success: 0,
            message: 'Eatery not found'
        }
    } else {
        return {
            success: 1,
            data: results[0]
        }
    }
}

export async function getCuisineFromCuisineId (id) {
    const query = 'select name from Cuisines where id = ?'
    const values = [id]
    const [results] = await poolPromise.execute(query, values)
    if (results.length === 0) {
        return {
            success: 0,
            message: 'Cuisine not found'
        }
    }
    return {
        success: 1,
        data: results[0]
    }
}

export async function createNewPost (data) {
    const query = 'insert into Posts (postedBy, title, content) values (?, ?, ?)'
    const values = [data.postedBy, data.title, data.content]
    const [results] = await poolPromise.execute(query, values)
    return {
        success: 1,
        data: results
    }
}

export async function getPostByPostId (id) {
    // gets post by id
    const query = 'select id, postedBy, title, content from Posts where id = ?'
    const value = [id]
    const [results] = await poolPromise.execute(query, value)

    if (results.length === 0) { // if no result
        return {
            success: 0,
            message: 'Post not found'
        }
    } else {
        return {
            success: 1,
            data: results[0]
        }
    }
}

export async function createReviews (data) {
    const query = 'insert into Reviews (userId, restaurantId, rating, comment) values (?, ?, ?, ?)'
    const values = [
        data.userId,
        data.restaurantId,
        data.rating,
        data.comment
    ]
    const [results] = await poolPromise.execute(query, values)
    return {
        success: 1,
        data: results
    }
}

export async function getReviewByReviewId (id) {
    // gets post by id
    const query = 'select id, userId, restaurantId, rating, comment from Reviews where id = ?'
    const value = [id]
    const [results] = await poolPromise.execute(query, value)
    if (results.length === 0) {
        return {
            success: 0,
            message: 'Review not found'
        }
    }
    return {
        success: 1,
        data: results[0]
    }
}

export async function insertSubscribedTo (data) {
    const query = 'insert into SubscribedTo (userId,restaurantId) values (?, ?)'
    const value = [data.userId, data.restaurantId]
    const [results] = await poolPromise.execute(query, value)
    return {
        success: 1,
        data: results
    }
}

export async function removeSubscribedTo (data) {
    const query = `delete from SubscribedTo where userId = ? and restaurantId = ?`
    const value = [data.userId, data.restaurantId]
    const [results] = await poolPromise.execute(query, value)
    return {
        success: 1,
        data: results
    }
}

// used for password recovery
export async function resetPassword (data) {
    const query = 'update LoginInfo set password = ? where login = ?'
    const value = [data.password, data.login]
    const [result] = await poolPromise.execute(query, value)
    return {
        success: 1,
        data: result
    }
}

export async function findSubscribedEateriesFromUserId (id) {
    const query = 'select \
    restaurantId, name, street, \
    suburb, region, postcode, phone, email, url, cuisine \
    from userSubscription where userId = ?'
    const value = [id]
    const [results] = await poolPromise.execute(query, value)
    return {
        success: 1,
        data: results
    }
}

// check if there is a business hour from a restaurant with the same day
// if there is then just update the hour (open and close), otherwise insert the new values
export async function insertHourFromRestaurant (data) {
    const findQuery = 'select * from BusinessHour where restaurantId = ? and day = ?'
    const findValues = [data.restaurantId, data.day]
    const [findResult] = await poolPromise.execute(findQuery, findValues)

    if (findResult.length !== 0) {
        const updateQuery = 'update BusinessHour set open = ?, close = ? where restaurantId = ? and day = ?'
        const updateValues = [data.open, data.close, data.restaurantId, data.day]
        const [updateResult] = await poolPromise.execute(updateQuery, updateValues)
        console.log(updateResult)
        return {
            success: 1,
            results: updateResult,
            message: 'business hours updated'
        }
    }

    const values = [data.restaurantId, data.day, data.open, data.close]
    const query = 'insert into BusinessHour (restaurantId, day, open, close) values (?, ?, ?, ?)'
    const [results] = await poolPromise.execute(query, values)
    return {
        success: 1,
        data: results
    }
}

export async function insertCuisineFromRestaurant (data) {
    const restaurant = data.restaurantId
    const cuisine = data.cuisineId
    const values = [restaurant, cuisine]
    const query = 'insert into CuisineOffer(restaurantId, cuisineId) values (?, ?)'
    const [results] = await poolPromise.execute(query, values)
    return {
        success: 1,
        data: results
    }
}

// create new cuisine
export async function insertNewCuisineName (data) {
    const name = data.name
    const searchQuery = 'select * from Cuisines where name = ?'
    const [result1] = await poolPromise.execute(searchQuery, [name])

    // cuisine exist
    if (result1.length !== 0) {
        return {
            success: 0,
            message: 'Cuisine name already exist'
        }
    }

    const insertQuery = 'insert into Cuisines(name) values (?)'
    const [result] = await poolPromise.execute(insertQuery, [name])
    return {
        success: 1,
        data: result
    }
}

export async function createNewUserDietary (data) {
    // find existing dietary
    const findQuery = 'select id from DietaryRestrictions where restriction = ?'
    const findValue = [data.restriction]
    const [findResult] = await poolPromise.execute(findQuery, findValue)
    let dietId

    if (findResult.length !== 0) {
        // get existing dietary
        console.log('found dietary')
        dietId = findResult[0].id
    } else {
        // insert new dietary
        const insertQuery1 = 'insert into DietaryRestrictions(restriction) values (?)'
        const values1 = [data.restriction]
        const result1 = await poolPromise.execute(insertQuery1, values1)
        console.log(result1)
        dietId = result1[0].insertId
        console.log('new dietary')
        console.log(dietId)
    }

    const insertQuery = 'insert into userDietary(userId, dietId) values (?, ?)'
    const insertValues = [data.id, dietId]
    const [result] = await poolPromise.execute(insertQuery, insertValues)
    return {
        success: 1,
        results: result
    }
}

export async function getAllDietaries () {
    const query = 'select * from DietaryRestrictions'
    const [result] = await poolPromise.execute(query)
    return {
        success: 1,
        results: result
    }
}

/**
 * find restaurant based on restaurant name, cuisine, location (suburb)
 * as well as dietary restrictions
*/
export async function getEateryByFilter (data) {
    console.log(data)
    let query = 'select * from restaurantInfo where'
    const values = []

    if (data.name) {
        query += ' name like ?'
        values.push('%' + data.name + '%')
    }

    if (data.cuisine) {
        if (values.length === 0) {
            query += ' cuisine = ?'
        } else {
            query += ' and cuisine = ?'
        }
        values.push(data.cuisine)
    }

    if (data.location) {
        if (values.length === 0) {
            query += ' suburb = ?'
        } else {
            query += ' and suburb = ?'
        }
        values.push(data.location)
    }

    if (data.restriction) {
        if (values.length === 0) {
            query += ' diet = ?'
        } else {
            query += ' and diet = ?'
        }
        values.push(data.restriction)
    }

    const [result] = await poolPromise.execute(query, values)
    if (result.length === 0) {
        return {
            success: 0,
            message: 'no such eateries exist'
        }
    } else {
        return {
            success: 1,
            results: result
        }
    }
}
