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
    
    return {
        success: 1,
        result: result
    }
}

export async function getAllCuisines() {
    const query =  `select * from Cuisines`
    const [result] = await poolPromise.execute(query)
    return {
        success: 1,
        result: result
    }
}

export async function getAllEateries() {
    const query =  `select * from restaurantInfo`
    const [result] = await poolPromise.execute(query)
    return {
        success: 1,
        result: result
    }
}

// create new eatery account
export async function createEateryAccount(data) {
    const findQuery = `select * from EateryAccount where name = ? and address = ? and phone = ? and email = ? and url = ?`
    const firstvalues = [data.name, data.address, data.phone, data.email, data.url];
    const [findResult] = await poolPromise.execute(findQuery, firstvalues);
    
    if (findResult.length !== 0) {
        return {
            success: 0,
            message: "Eatery account exists"
        }
    }

    const query = `insert into EateryAccount(name, address, phone, email, login, url) values (?, ?, ?, ?, ?, ?)`;
    const values = [data.name, data.address, data.phone, data.email, data.login, data.url];
    const [result] = await poolPromise.execute(query,values);
    return {
        success: 1,
        results: result
    };
}