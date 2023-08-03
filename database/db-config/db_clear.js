import { poolPromise } from "./db_connection";

/**
 * for unit test, it deletes all data from the database
 * delete tables where there is no foreign key constraint
 */
export async function db_clear () {
    await poolPromise.execute("delete from Bookings")
    await poolPromise.execute("delete from LoginInfo")
    await poolPromise.execute("delete from DietaryRestrictions")
    await poolPromise.execute("delete from Cuisines")
    await poolPromise.execute("delete from Address")
}