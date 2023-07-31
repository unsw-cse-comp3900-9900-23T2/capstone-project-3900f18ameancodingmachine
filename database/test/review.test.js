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

describe("/reviews", () => {

    test("user review a restaurant, when search for the review, return statuscode 200 and success 1", async () => {
        // register user
        let response = await request(app).post("/api/user/account").send(userLoginData)
        const userLoginId = response.body.data.insertId

        // register eatery
        response = await request(app).post("/api/user/account").send(eateryLoginData)
        const eateryLoginId = response.body.data.insertId
       
        // create address   
        response = await request(app).post('/api/user/address').send(data)
        console.log(response.body.data.insertId)
        const addressId = response.body.data.insertId

        // create user account, leaves address
        const userAccount = {
           first: "first",
           last: "last",
           loginId: userLoginId,
           addressId: addressId //fake
        }

        // create eatery account
        const eateryAccount = {
            name: "another restaurant",
            addressId: addressId, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            loginId: eateryLoginId, 
            url: "www.anotherrestaurant.com",
        }

        response = await request(app).post("/api/user/eatery").send(eateryAccount)
        const eateryAccountId = response.body.results.insertId

        response = await request(app).post("/api/user/user").send(userAccount)
        const userAccountId = response.body.data.insertId

        const review = {
            userId: userAccountId,
            restaurantId: eateryAccountId,
            rating: 5,
            comment: "nice"
        }

        response = await request(app).post("/api/user/reviews").send(review)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

        // find the review
        const reviewId = response.body.data.insertId
        response = await request(app).get(`/api/user/review/${reviewId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })

    test("not finding the review will return statuscode 404", async () => {
        const reviewId = 1 //any number because of empty database
        const response = await request(app).get(`/api/user/review/${reviewId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.success).toBe(0)
    })

})