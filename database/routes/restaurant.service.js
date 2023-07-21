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
export async function createNewVoucher(data) {
    const query = `insert into Voucher(offeredBy, discount, startOffer, endOffer, count, code) values (?,?,?,?,?,?)`
    const values = [data.offeredBy, data.discount, data.startOffer, data.endOffer, data.count, data.code]
    const result = await poolPromise.execute(query, values)

    return {
        success: 1,
        results: result
    }
}

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
    const query = 'select * from restaurantInfo where name regexp ?'
    const values = [string];
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
    const query = 'select * from restaurantInfo where diet = ?'
    const values = [diet]
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
    const query = 'select * from restaurantInfo where cuisine = ?'
    const values = [cuisine]
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

export async function getAllEateryVouchers (Id) {
    const query = 'select * from Voucher where offeredBy = ?'
    const value = [Id]
    const [result] = await poolPromise.execute(query, value)
    return {
        success: 1,
        results: result
    }
}

export async function getAllCuisines () {
    const query = 'select * from Cuisines'
    const [result] = await poolPromise.execute(query)
    return {
        success: 1,
        results: result
    }
}

export async function getAllEateries () {
    const query = 'select * from restaurantInfo'
    const [result] = await poolPromise.execute(query)
    return {
        success: 1,
        results: result
    }
}


// create new eatery account
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
