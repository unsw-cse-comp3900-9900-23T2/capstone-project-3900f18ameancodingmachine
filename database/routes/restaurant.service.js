import { poolPromise } from "../db-config/db_connection.js"

export async function createNewVoucher(data) {
    const query = `insert into Voucher(offeredBy, discount, startOffer, endOffer, count) values (?,?,?,?,?)`
    const values = [data.offeredBy, data.discount, data.startOffer, data.endOffer, data.count]
    const result = await poolPromise.execute(query, values)

    return {
        success: 1,
        result: result
    }
}

export async function updateExistingDescription(data) {
    console.log(data)
    const query =  `update EateryAccount set description = ? where id = ?`
    const values = [data.description, data.restaurantId]
    const [result] = await poolPromise.execute(query, values);

    console.log(result)
    
    return {
        success: 1,
        result: result
    }
}