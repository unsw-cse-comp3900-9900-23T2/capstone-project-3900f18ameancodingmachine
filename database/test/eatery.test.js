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

describe("/eatery", () => {

    afterEach(async () => {
        const query = `delete from LoginInfo`
        await poolPromise.execute(query)
    })

    test("eatery registration should return statuscode 200 and success of 1", async () => {
        // register eatery login
        let response = await request(app).post("/api/user/account").send(eateryLoginData)
        const eateryLoginId = response.body.data.insertId
       
        // create address   
        response = await request(app).post('/api/user/address').send(data)
        console.log(response.body.data.insertId)
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
        console.log(response.body.data.insertId)
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

describe("/cuisine", () => {

    const cuisineData = {
        name: "new cuisine" //fake
    }

    afterEach(async () => {
        const query = `delete from Cuisines`
        await poolPromise.execute(query)
    })

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


    afterEach(async () => {
        let query = `delete from LoginInfo`;
        let res = await poolPromise.execute(query)
        query = `delete from Cuisines`;
        res = await poolPromise.execute(query)
        query = `delete from CuisineOffer`;
        res = await poolPromise.execute(query)
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

    afterEach(async () => {
        let query = `delete from LoginInfo`;
        let res = await poolPromise.execute(query)
        query = `delete from BusinessHour`;
        res = await poolPromise.execute(query)
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

describe('/voucher', () => {

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
    

    afterEach(async () => {
        let query = `delete from Voucher`
        let res = await poolPromise.execute(query)
        query = `delete from LoginInfo`
        res = await poolPromise.execute(query)
    })

    test('insert correct voucher data return statuscode 200 and success 1', async () => {

        const start = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const end = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // input for voucher
        // leave code null
        const voucherData = {
            offeredBy: restaurantId,
            discount: 50,
            startOffer: start,
            endOffer: end,
            count: 1,
            code: 'ABCD'
        }

        console.log(voucherData)

        const response = await request(app).post('/api/user/voucher').send(voucherData);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
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
        }

        response = await request(app).post("/api/user/eatery").send(eateryAccount);
        restaurantId = response.body.results.insertId
    })

    afterEach(async () => {
        let query = `delete from LoginInfo`
        await poolPromise.execute(query)
    })


    test("update description would return statuscode 200 and success 1", async () => {

        const response = await request(app).put("/api/user/eatery/description").send({
            restaurantId: restaurantId,
            description: "hello there"
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })
})

// describe("/eatery/all", () => {
//     const restaurantData = {
//         name: "another restaurant",
//         addressId: 0, //fake
//         phone: "0493186858",
//         email: "anotherrestaurant@gmail.com",
//         loginId: 0, //fake
//         url: "www.anotherrestaurant.com",
//     }

//     afterEach(async () => {
//         let query = `delete from EateryAccount`
//         let res = await poolPromise.execute(query)
//     })

//     test("getting all eateries should just return statuscode 200 and success of 1", async () => {
//         let response = await request(app).post('/api/user/eatery').send(restaurantData)
//         const restaurantId = response.body.results.insertId
//         response = await request(app).get("/api/user/eatery/all").send({
//             restaurantId: restaurantId,
//             description: "hello there"
//         })

//         expect(response.statusCode).toBe(200)
//         expect(response.body.success).toBe(1)
//     })

//     test("input 1 restaurant return only 1 restaurant", async () => {
//         let response = await request(app).post('/api/user/eatery').send(restaurantData)
//         const restaurantId = response.body.results.insertId

//         response = await request(app).get("/api/user/eatery/all").send({
//             restaurantId: restaurantId,
//             description: "hello there"
//         })

//         expect(response.body.results.length).toBe(1)
//     })

// })

// test cases:
// 1. search based on name
// 2. search based on suburb
// 3. search based on cuisine
// 4. maybe a mix
// describe("/eatery/find", () => {
//     const restaurantData1 = {
//         name: "restaurant 1",
//         addressId: 0, //fake
//         phone: "0493186858",
//         email: "restaurant1@gmail.com",
//         loginId: 0, //fake
//         url: "www.restaurant1.com",
//     }

//     const restaurantData2 = {
//         name: "restaurant 2",
//         addressId: 0, //fake
//         phone: "0493186858",
//         email: "restaurant2@gmail.com",
//         loginId: 0, //fake
//         url: "www.restaurant1.com",
//     }

//     const restaurantData3 = {
//         name: "restaurant 3",
//         addressId: 0, //fake
//         phone: "0493186858",
//         email: "restaurant3@gmail.com",
//         loginId: 0, //fake
//         url: "www.restaurant3.com",
//     }

//     afterEach(async () => {
//         let query = `delete from EateryAccount`
//         let res = await poolPromise.execute(query)
//     })
// })
