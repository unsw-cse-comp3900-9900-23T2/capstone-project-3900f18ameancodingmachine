import { poolPromise } from '../db-config/db_connection.js'

/**
 * insert new voucher details into the database
 * @param {object} data
 * @param {string} data.offeredBy   restaurantId
 * @param {float} data.discount     discount for the coupon
 * @param {date} data.startOffer    coupon starting offer
 * @param {date} data.endOffer      coupon ending offer
 * @param {int} data.count          number of coupon generated
 */
export async function createNewVoucher (data) {
    const query = 'insert into Voucher(offeredBy, discount, startOffer, endOffer, count) values (?,?,?,?,?)'
    const values = [data.offeredBy, data.discount, data.startOffer, data.endOffer, data.count]
    const result = await poolPromise.execute(query, values)

    return {
        success: 1,
        results: result
    }
}

/**
 * update description of the restaurant stored in the database
 * @param {object} data
 * @param {text} data.description
 * @param {integer} data.restaurantId
 */
export async function updateExistingDescription (data) {
    console.log(data)
    const query = 'update EateryAccount set description = ? where id = ?'
    const values = [data.description, data.restaurantId]
    const [result] = await poolPromise.execute(query, values)

    return {
        success: 1,
        results: result
    }
}

/**
 * get all cuisine name
*/
export async function getAllCuisines () {
    const query = 'select * from Cuisines'
    const [result] = await poolPromise.execute(query)
    return {
        success: 1,
        results: result
    }
}

/**
 * get all eateries info/details which includes:
 * - name
 * - address
 * - phone
 * - email
 * - url
 * - cuisines offerred
 * - dietary preferences provided
*/
export async function getAllEateries () {
    const query = 'select * from restaurantInfo'
    const [result] = await poolPromise.execute(query)
    return {
        success: 1,
        results: result
    }
}

/**
 * create new eatery account and store it to database
 * just return object with message and success 0 if duplicate account exists
 * @param {object} data
 * @param {string} data.name
 * @param {integer} data.addressId
 * @param {string} data.phone
 * @param {string} data.email
 * @param {string} data.url
 */
export async function createEateryAccount (data) {
    const findQuery = 'select * from EateryAccount where name = ? and address = ? and phone = ? and email = ? and url = ?'
    const firstvalues = [data.name, data.addressId, data.phone, data.email, data.url]
    const [findResult] = await poolPromise.execute(findQuery, firstvalues)

    if (findResult.length !== 0) {
        return {
            success: 0,
            message: 'Eatery account exists'
        }
    }

    const query = 'insert into EateryAccount(name, address, phone, email, login, url) values (?, ?, ?, ?, ?, ?)'
    const values = [data.name, data.addressId, data.phone, data.email, data.loginId, data.url]
    const [result] = await poolPromise.execute(query, values)
    return {
        success: 1,
        results: result
    }
}

/**
 * insert restaurant dietary into the database
 * @param {object} data
 * @param {int} data.id - eatery id
 * @param {string} data.restriction - name of the dietrary restriction
 */
export async function createRestaurantDietary (data) {
    // find existing dietary
    const findQuery = 'select id from DietaryRestrictions where restriction = ?'
    const findValue = [data.restriction]
    const [findResult] = await poolPromise.execute(findQuery, findValue)
    let dietId

    if (findResult.length !== 0) {
        // get existing dietary
        dietId = findResult[0].id
    } else {
        // insert new dietary
        const insertQuery1 = 'insert into DietaryRestrictions(restriction) values (?)'
        const values1 = [data.restriction]
        const result1 = await poolPromise.execute(insertQuery1, values1)
        dietId = result1[0].insertId
        console.log('insert result')
        console.log(result1)
    }
    console.log(dietId)
    const insertQuery = 'insert into provideDietary(restaurantId, dietId) values (?, ?)'
    const insertValues = [data.id, dietId]
    const [result] = await poolPromise.execute(insertQuery, insertValues)
    return {
        success: 1,
        results: result
    }
}

/**
 * insert restaurants menu item into the database
 * @param {Object} data
 * @param {int} data.restaurantId
 * @param {string} data.category
 * @param {string} data.name - name of the menu
 * @param {float} data.price
 * @param {string} data.description
 */
export async function createNewMenu (data) {
    const findQuery = 'select id from RestaurantMenu where restaurantId = ? and name = ? and category = ?'
    const findValue = [data.restaurantId, data.name, data.category]
    const [findResult] = await poolPromise.execute(findQuery, findValue)

    if (findResult.length === 0) {
        return {
            success: 0,
            message: 'Duplicate record exist'
        }
    }

    const insertQuery = 'insert into RestaurantMenu(restaurantId, category, name, price, description) values (?,?,?,?,?)'
    const insertValues = [data.restaurantId, data.category, data.name, data.price, data.description]
    const [insertResult] = await poolPromise.execute(insertQuery, insertValues)

    return {
        success: 1,
        results: insertResult
    }
}

export async function getMenuByRestaurantId (id) {
    // gets user by id
    const query = 'select id, restaurantId, category, name, price, description from RestaurantMenu where restaurantId = ?'
    const values = [id]
    const [results] = await poolPromise.execute(query, values)

    if (results.length === 0) {
        return {
            success: 0,
            message: 'Restaurant not found'
        }
    }
    return {
        success: 1,
        data: results[0]
    }
}
