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
