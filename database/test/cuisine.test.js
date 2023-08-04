import request from 'supertest';
import { app, server } from '../server';
import { poolPromise } from '../db-config/db_connection';
import { db_clear } from '../db-config/db_clear';

// after all test done, it will stop pool connection
// otherwise jest won't exit
afterAll((done) => {
    server.close(() => {
        poolPromise.end()
        done();
    });
});

afterEach(async () => {
    await db_clear();
})

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

const eateryLoginData2 = {
    login: userLogin,
    password: userPassword
}

//////////////////////////////////////////////////////////////////////////////////////

describe("/cuisine", () => {

    let eateryLoginId;
    let eateryLoginId1;
    let addressId;
    let restaurantId;
    let eateryAccount;
    let anotherEateryAccount;
    let restaurantId1;

    beforeEach(async () => {
        let response = await request(app).post("/api/user/account").send(eateryLoginData)
        eateryLoginId = response.body.data.insertId

        response = await request(app).post("/api/user/account").send(eateryLoginData2)
        eateryLoginId1 = response.body.data.insertId
       
        // create address   
        response = await request(app).post('/api/user/address').send(data)
        addressId = response.body.data.insertId

        // create eatery account
        eateryAccount = {
            name: "another restaurant",
            addressId: addressId, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            loginId: eateryLoginId, 
            url: "www.anotherrestaurant.com",
        }

        response = await request(app).post("/api/user/eatery").send(eateryAccount);
        restaurantId = response.body.results.insertId

        anotherEateryAccount = {
            name: "another restaurant 1",
            addressId: addressId, //fake
            phone: "0493186824",
            email: "anotherrestaurant1@gmail.com",
            loginId: eateryLoginId1, 
            url: "www.anotherrestaurant1.com",
        }

        response = await request(app).post("/api/user/eatery").send(anotherEateryAccount);
        restaurantId1 = response.body.results.insertId
    })

    test("restaurant with a new cuisine would have statuscode 200 and success of 1", async () => {

        const cuisineData = {
            cuisineName: "japanese",
            restaurantId: restaurantId
        }

        let response = await request(app).post('/api/user/cuisine').send(cuisineData)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

        // restaurant offer a cuisine
        let query = `select * from CuisineOffer`
        let [result] = await poolPromise.execute(query)
        expect(result.length).toBe(1)

        // new cuisine created
        query = `select * from Cuisines`
        let [result1] = await poolPromise.execute(query)
        expect(result1.length).toBe(1)
        expect(result1[0].name).toBe("japanese")
    })

    test("two restaurant with a new cuisine would have 1 cuisine on Cuisine table", async () => {

        const cuisineData = {
            cuisineName: "japanese",
            restaurantId: restaurantId
        }

        let response = await request(app).post('/api/user/cuisine').send(cuisineData)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

        const cuisineData1 = {
            cuisineName: "japanese",
            restaurantId: restaurantId1
        }

        response = await request(app).post('/api/user/cuisine').send(cuisineData1)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

        // restaurant offer a cuisine
        let query = `select * from CuisineOffer`
        let [result] = await poolPromise.execute(query)
        expect(result.length).toBe(2)

        // new cuisine created
        query = `select * from Cuisines`
        let [result1] = await poolPromise.execute(query)
        expect(result1.length).toBe(1)
        expect(result1[0].name).toBe("japanese")
    })

})