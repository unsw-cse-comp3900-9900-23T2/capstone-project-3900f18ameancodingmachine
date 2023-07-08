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
        const query = `delete from EateryAccount`
        const res = await poolPromise.execute(query)
    })

    test("eatery registration should return statuscode 200 and success of 1", async () => {
        const response = await request(app).post("/api/user/eatery").send(data);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test("register the same eatery with the same info twice should not return success 1", async () => {
        const response = await request(app).post("/api/user/eatery").send(data);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        const response2 = await request(app).post("/api/user/eatery").send(data);
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

describe("/cuisine-offer", () => {
    const cuisineData = {
        name: "new cuisine" //fake
    }

    const restaurantData = {
        name: "another restaurant",
        address: 0, //fake
        phone: "0493186858",
        email: "anotherrestaurant@gmail.com",
        login: 0, //fake
        url: "www.anotherrestaurant.com",
    }

    // have better method but this is guaranteed
    afterEach(async () => {
        let query = `delete from CuisineOffer`;
        let res = await poolPromise.execute(query)
        query = `delete from Cuisines`
        res = await poolPromise.execute(query)
        query = `delete from EateryAccount`
        res = await poolPromise.execute(query)
    })

    test("restaurant linking to a cuisine would have statuscode 200 and success of 1", async () => {
        // make new cuisine
        let  response = await request(app).post('/api/user/cuisine').send(cuisineData)
        const cuisineId = response.body.results.insertId
        
        // create the new eatery
        response = await request(app).post('/api/user/eatery').send(restaurantData)
        const restaurantId = response.body.results.insertId

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

describe("/hour", () => {
    const data = {
        name: "another restaurant",
        address: 0, //fake
        phone: "0493186858",
        email: "anotherrestaurant@gmail.com",
        login: 0, //fake
        url: "www.anotherrestaurant.com",
    }

    afterEach(async () => {
        let query = `delete from BusinessHour`;
        let res = await poolPromise.execute(query)
        query = `delete from EateryAccount`
        res = await poolPromise.execute(query)
    })

    test("input business hour return statuscode 200 and success 1", async () => {
        // create the new eatery
        let response = await request(app).post('/api/user/eatery').send(data)
        const restaurantId = response.body.results.insertId

        //  insert business hour
        const hourData = {
            restaurantId: restaurantId,
            day: "mon",
            open: "09:00",
            close: "17:00"
        }

        response = await request(app).post('/api/user/hour').send(hourData)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

    })

})

describe('/voucher', () => {
    const restaurantData = {
        name: "another restaurant",
        address: 0, //fake
        phone: "0493186858",
        email: "anotherrestaurant@gmail.com",
        login: 0, //fake
        url: "www.anotherrestaurant.com",
    }

    afterEach(async () => {
        let query = `delete from Voucher`
        let res = await poolPromise.execute(query)
        query = `delete from EateryAccount`
        res = await poolPromise.execute(query)
    })

    test('insert correct voucher data return statuscode 200 and success 1', async () => {
        // create the new eatery
        let response = await request(app).post('/api/user/eatery').send(restaurantData)
        const restaurantId = response.body.results.insertId

        const start = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const end = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // input for voucher
        // leave description and code null
        const voucherData = {
            offeredBy: restaurantId,
            startOffer: start,
            endOffer: end
        }

        const result = await request(app).post('/api/user/voucher').send(voucherData);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })
})
