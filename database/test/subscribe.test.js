import request from 'supertest';
import { app, server } from '../server';
import { poolPromise } from '../db-config/db_connection';

// after all test done, it will stop pool connection
// otherwise jest won't exit
afterAll((done) => {
    server.close(() => {
        poolPromise.end()
        done();
    });
});

///////////////////////////////////////Sample Data//////////////////////////////////

// for basic test like login, address, and account router
const login = "uniquename@gmail.com"
const password = "test"

// address
const data = {
    street: "unicorn street",
    suburb: "dirtland",
    region: "NSW",
    postcode: "2025"
}

// for router where userId and restaurantId are required
const userLogin = "anotheraccount"
const userPassword = "anotherpassword"
const restaurantLogin = "uniquename@gmail.com"
const restaurantPassword = "test"

const userLoginData = {
    login: userLogin,
    password: userPassword
}

const eateryLoginData = {
    login: restaurantLogin,
    password: restaurantPassword
}

//////////////////////////////////////////////////////////////////////////////////////

describe('/subscribe', () => {

    let userLoginId;
    let eateryLoginId;
    let addressId;
    let eateryAccountId;
    let userAccountId;

    beforeEach(async () => {
        let response = await request(app).post("/api/user/account").send(userLoginData)
        userLoginId = response.body.data.insertId

        // register eatery
        response = await request(app).post("/api/user/account").send(eateryLoginData)
        eateryLoginId = response.body.data.insertId

        response = await request(app).post('/api/user/address').send(data)
        addressId = response.body.data.insertId

        // create user account, leaves address
        const userAccount = {
            first: "first",
            last: "last",
            loginId: userLoginId,
            addressId: addressId //fake
         }
 
        // create eatery account, leaves address
        const eateryAccount = {
            name: "another restaurant",
            addressId: addressId, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            loginId: eateryLoginId, 
            url: "www.anotherrestaurant.com",
        }
       
        response = await request(app).post("/api/user/eatery").send(eateryAccount)
        eateryAccountId = response.body.results.insertId

        response = await request(app).post("/api/user/user").send(userAccount)
        userAccountId = response.body.data.insertId
    })

    afterEach(async () => {
        let query = `delete from LoginInfo`
        let res = await poolPromise.execute(query)
        query = `delete from UserAccount`;
        res = await poolPromise.execute(query);
        query = `delete from EateryAccount`;
        res = await poolPromise.execute(query);
        query = `delete from Address`;
        res = await poolPromise.execute(query);
    })

    test("user subscribe to registered restaurant", async () => {
        const subscribeData = {
            userId: userAccountId,
            restaurantId: eateryAccountId
        }

        let response = await request(app).put("/api/user/subscribe").send(subscribeData)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test("finding what eateries the user is subscribed to", async () => {

        const subscribeData = {
            userId: userAccountId,
            restaurantId: eateryAccountId
        }

        let response = await request(app).put("/api/user/subscribe").send(subscribeData)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        let [res] = await poolPromise.execute(`select * from userSubscription where userId = ?`, [userAccountId])
        expect(res.length).toBe(1)

        response = await request(app).get(`/api/user/subscribe/${userAccountId}`)
        // console.log(response)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })
})