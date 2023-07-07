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

// get all user account
describe("/userall", () => {
    test('status code should be 200', async() => {
        const response = await request(app).get("/api/user/userall");
        expect(response.statusCode).toBe(200)
    })

    test('success should be 1', async() => {
        const response = await request(app).get("/api/user/userall");
        expect(response.body.success).toBe(1)
    })
})

// registering account
describe("/account", () => {

    const login = "uniquename@gmail.com"
    const password = "test"

    afterEach(async () => {
        const query = "delete from LoginInfo where login = ?"
        const res = await poolPromise.execute(query, [login])
    })

    test('successful registration should return status code 200 and success', async () => {
        const response = await request(app).post("/api/user/account").send({
            login: login,
            password: password
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })

    test('register twice with same info would return success 0', async () => {
        const response = await request(app).post("/api/user/account").send({
            login: "uniquename@gmail.com",
            password: "test"
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

        const anotherResponse = await request(app).post("/api/user/account").send({
            login: login,
            password: password
        })
        expect(anotherResponse.statusCode).toBe(400)
        expect(anotherResponse.body.success).toBe(0)
    })
})

describe("/address", () => {
    
    const data = {
        street: "unicorn street",
        suburb: "dirtland",
        region: "NSW",
        postcode: "2025"
    }

    afterEach(async () => {
        const query = `delete from Address where street = ? and suburb = ? and region = ? and postcode = ?`
        const res = await poolPromise.execute(query, ["unicorn street", "dirtland", "NSW", "2025"])
    })

    test("address should return status code 200", async () => {
        const response = await request(app).post('/api/user/address').send(data)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })
})

describe("/reviews", () => {
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

    afterEach(async () => {
        let query = `delete from LoginInfo`
        let res = await poolPromise.execute(query)
        query = `delete from UserAccount`;
        res = await poolPromise.execute(query)
        query = `delete from EateryAccount`;
        res = await poolPromise.execute(query)
        query = `delete from Reviews`;
        res = await poolPromise.execute(query)
    })

    // assume the user is logged in (bit lazy)
    test("user review a restaurant, when search for the review, return statuscode 200 and success 1", async () => {
        // register user
        let response = await request(app).post("/api/user/account").send(userLoginData)
        const userLoginId = response.body.data.insertId

       // register eatery
       response = await request(app).post("/api/user/account").send(eateryLoginData)
       const eateryLoginId = response.body.data.insertId

       // create user account, leaves address
        const userAccount = {
           first: "first",
           last: "last",
           loginId: userLoginId,
           addressId: 1 //fake
        }

       // create eatery account, leaves address
        const eateryAccount = {
            name: "another restaurant",
            address: 0, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            login: eateryLoginId, 
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


