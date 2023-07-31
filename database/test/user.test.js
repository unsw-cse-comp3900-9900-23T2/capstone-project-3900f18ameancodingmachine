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

    test('successful registration should return status code 200 and success', async () => {
        const response = await request(app).post("/api/user/account").send({
            login: login,
            password: password
        })
        console.log(response)
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

describe("/login", () => {

    test("register then login should return statuscode 200 and success 1", async () => {
        // register the user first
        let response = await request(app).post("/api/user/account").send({
            login: login,
            password: password
        })

        // then user login
        response = await request(app).post("/api/user/login").send({
            login: login,
            password: password
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })

    test("login without register should return statuscode 404 and success 0", async () => {
        const response = await request(app).post("/api/user/login").send({
            login: login,
            password: password
        })
        expect(response.statusCode).toBe(404)
        expect(response.body.success).toBe(0)
    })
})



describe("/address", () => {

    test("address should return status code 200", async () => {
        const response = await request(app).post('/api/user/address').send(data)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })
})


