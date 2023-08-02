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

//////////////////////////////////////////////////////////////////////////////////////

describe("/cuisine", () => {

    const cuisineData = {
        name: "new cuisine" //fake
    }

    test("adding new cuisine should return statuscode 200 and success of 1", async () => {
        const response = await request(app).post('/api/user/cuisine').send(cuisineData)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })
})

describe("/cuisine-offer", () => {
    const cuisineData = {
        name: "new cuisine" //fake
    }

    let eateryLoginId;
    let addressId;
    let restaurantId;
    let eateryAccount;

    beforeEach(async () => {
        let response = await request(app).post("/api/user/account").send(eateryLoginData)
        eateryLoginId = response.body.data.insertId
       
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
    })

    test("restaurant linking to a cuisine would have statuscode 200 and success of 1", async () => {

        let response = await request(app).post('/api/user/cuisine').send(cuisineData)
        const cuisineId = response.body.data.insertId

        const offerData = {
            restaurantId: restaurantId,
            cuisineId: cuisineId
        }

        // make cuisine offer from restaurant
        response = await request(app).post('/api/user/cuisine-offer').send(offerData)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })

})