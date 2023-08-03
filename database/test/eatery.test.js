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

describe("/eatery", () => {

    test("eatery registration should return statuscode 200 and success of 1", async () => {
        // register eatery login
        let response = await request(app).post("/api/user/account").send(eateryLoginData)
        const eateryLoginId = response.body.data.insertId
       
        // create address   
        response = await request(app).post('/api/user/address').send(data)
        const addressId = response.body.data.insertId

        // create eatery account
        const eateryAccount = {
            name: "another restaurant",
            addressId: addressId, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            loginId: eateryLoginId, 
            url: "www.anotherrestaurant.com",
        }

        response = await request(app).post("/api/user/eatery").send(eateryAccount);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test("register the same eatery with the same info twice should not return success 1", async () => {
        // register eatery login
        let response = await request(app).post("/api/user/account").send(eateryLoginData)
        const eateryLoginId = response.body.data.insertId
       
        // create address   
        response = await request(app).post('/api/user/address').send(data)
        const addressId = response.body.data.insertId

        // create eatery account
        const eateryAccount = {
            name: "another restaurant",
            addressId: addressId, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            loginId: eateryLoginId, 
            url: "www.anotherrestaurant.com",
        }

        response = await request(app).post("/api/user/eatery").send(eateryAccount);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        // duplicate account
        const response2 = await request(app).post("/api/user/eatery").send(eateryAccount);
        expect(response2.statusCode).toBe(409);
        expect(response2.body.success).toBe(0);
    })

})



describe("/hour", () => {
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

    test("input business hour return statuscode 200 and success 1", async () => {

        //  insert business hour
        const hourData = {
            restaurantId: restaurantId,
            day: "mon",
            open: "09:00",
            close: "17:00"
        }

        const response = await request(app).post('/api/user/hour').send(hourData)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

    })

    test("input business hour twice will just update the business hour", async () => {

        //  insert business hour
        const hourData = {
            restaurantId: restaurantId,
            day: "mon",
            open: "09:00",
            close: "17:00"
        }

        let response = await request(app).post('/api/user/hour').send(hourData)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)

        // insert another business hour
        const hourData2 = {
            restaurantId: restaurantId,
            day: "mon",
            open: "10:00",
            close: "18:00"
        }

        response = await request(app).post('/api/user/hour').send(hourData2)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
        expect(response.body.message).toBe("business hours updated")
    })

})

describe("/eatery/description", () => {

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
            description: "another description",
        }

        response = await request(app).post("/api/user/eatery").send(eateryAccount);
        restaurantId = response.body.results.insertId
    })

    test("update description would return statuscode 200 and success 1", async () => {

        const response = await request(app).put("/api/user/eatery/description").send({
            restaurantId: restaurantId,
            description: "hello there"
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })

    test("get description would return statuscode 200 and success 1", async () => {

        const response = await request(app).get(`/api/user/eatery/description/${restaurantId}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })

    test("get description with invalid id would return statuscode 404 and success 0", async () => {
        const noId = restaurantId + 1
        const response = await request(app).get(`/api/user/eatery/description/${noId}`)

        expect(response.statusCode).toBe(404)
        expect(response.body.success).toBe(0)
    })
})

describe("/eatery/all", () => {
    
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

    test("getting all eateries should just return statuscode 200 and success of 1", async () => {
        let response = await request(app).get("/api/user/eatery/all").send({
            restaurantId: restaurantId
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })

    test("input 1 restaurant return only 1 restaurant", async () => {

        let response = await request(app).get("/api/user/eatery/all").send({
            restaurantId: restaurantId
        })

        expect(response.body.results.length).toBe(1)
    })

})

