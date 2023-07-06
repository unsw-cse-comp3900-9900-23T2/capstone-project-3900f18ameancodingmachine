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

describe("/eatery", () => {
    const data = {
        name: "another restaurant",
        address: 0, //fake
        phone: "0493186858",
        email: "anotherrestaurant@gmail.com",
        login: 0, //fake
        url: "www.anotherrestaurant.com",
    }

    afterEach(async () => {
        const query = `delete from EateryAccount where name = ? and email = ? and url = ?`
        const res = await poolPromise.execute(query, ["another restaurant", "anotherrestaurant@gmail.com", "www.anotherrestaurant.com"])
    })

    test("eatery registration should return statuscode 200 and success of 1", async () => {
        const response = await request(app).post('/api/user/eatery').send(data);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test("register the same eatery with the same info twice should not return success 1", async () => {
        const response = await request(app).post('/api/user/eatery').send(data);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        const response2 = await request(app).post('/api/user/eatery').send(data);
        expect(response2.statusCode).toBe(400);
        expect(response2.body.success).toBe(0);
    })

})

describe("/cuisine", () => {
    const data = {
        name: "new cuisine" //fake
    }

    afterEach(async () => {
        const query = `delete from Cuisines where name = ?`
        const res = await poolPromise.execute(query, ["new cuisine"])
    })

    test("adding new cuisine should return statuscode 200 and success of 1", async () => {
        const response = await request(app).post('/api/user/cuisine').send(data)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })
})

