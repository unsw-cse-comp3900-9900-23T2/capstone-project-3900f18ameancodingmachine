import { poolPromise } from '../db-config/db_connection.js'

/**
 * insert new voucher details into the database
 * @param {object} data
 * @param {string} data.offeredBy   restaurantId
 * @param {float} data.discount     discount for the coupon
 * @param {date} data.startOffer    coupon starting offer
 * @param {date} data.endOffer      coupon ending offer
 * @param {int} data.count          number of coupon generated
 * @param {string} data.code        code of coupon generated
 * @returns {object}    if successful object with success 1, otherwise 0
 */
export async function createNewVoucher(data) {
    const query = `insert into Voucher(offeredBy, discount, startOffer, endOffer, count, code) values (?,?,?,?,?,?)`
    const values = [data.offeredBy, data.discount, data.startOffer, data.endOffer, data.count, data.code]
    const result = await poolPromise.execute(query, values)

    return {
        success: 1,
        results: result
    }
}

/**
 * update the description associated with an eatery account
 * @param {object} data
 * @param {string} data.description   new description
 * @param {string} data.restaurantId  restaurantId
 * @returns {object}    if successful object with success 1, otherwise 0
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

//////////for search//////////////
export async function getEateriesBySearchString (string) {
    let query = 'select * from restaurantInfo where name regexp ?'
    let values = [string];
    if (!string) {
        query = 'select * from restaurantInfo';
        values = [];
    }
    const [result] = await poolPromise.execute(query, values)

    return {
        success: 1,
        results: result
    }
}

export async function getEateriesByDiet (diet) {
    let query = 'select * from restaurantInfo where diet = ?'
    let values = [diet]
    if (!diet) {
        query = 'select * from restaurantInfo';
        values = [];
    }
    const [result] = await poolPromise.execute(query, values)

    return {
        success: 1,
        results: result
    }
}

export async function getEateriesByCuisine (cuisine) {
    let query = 'select * from restaurantInfo where cuisine = ?'
    let values = [cuisine]
    if (!cuisine) {
        query = 'select * from restaurantInfo';
        values = [];
    }
    const [result] = await poolPromise.execute(query, values)

    return {
        success: 1,
        results: result
    }
}
//////////////////

/**
 * get all vouchers associated with an eatery
 * @param {string} id   eatery id
 * @returns {object}    if successful object with success 1, otherwise 0
 */
export async function getAllEateryVouchers (Id) {
    const query = 'select * from Voucher where offeredBy = ?'
    const value = [Id]
    const [result] = await poolPromise.execute(query, value)
    return {
        success: 1,
        results: result
    }
}

/**
 * gets information about each existing cuisine type
 * @returns {object}    if successful object with success 1, otherwise 0
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
 * gets infromation about each existing eatery 
 * @returns {object}    if successful object with success 1, otherwise 0
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
 * create new and unique eatery account
 * @param {object} data
 * @param {string} data.name        name of eatery
 * @param {string} data.addressId   address id of the 
 * @param {string} data.phone       phone number of the eatery 
 * @param {string} data.email       the eatery email
 * @param {string} data.url         website of the eatery
 * @param {string} data.loginId     login id for the eatery
 * @returns {object}                if successful object with success 1, otherwise 0
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
 * insert new dietary into the database
 * @param {object} data
 * @param {int} data.id - eatery id
 * @param {string} data.restriction - name of the dietrary restriction
 * @returns {object} - object contain success of 1 and result of insert query
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
    }
    
    const insertQuery = 'insert into provideDietary(restaurantId, dietId) values (?, ?)'
    const insertValues = [data.id, dietId]
    const [result] = await poolPromise.execute(insertQuery, insertValues)
    return {
        success: 1,
        results: result
    }
}

export async function storeEateryProfileImg (data) {

    const file = req.file;
    // insert path and restaurantId into query
    const query = `insert into restaurantProfileImages(restaurantId, image_path) values (?, ?)`
    const [result] = await poolPromise.execute(query, [data.restaurantId, data.path])
    return {
        success: 1,
        results: result
    }
}
