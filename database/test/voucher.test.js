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

    test('insert correct voucher non-reoccuring data return statuscode 200 and success 1', async () => {

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

        const response = await request(app).post('/api/user/voucher').send(voucherData);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test('insert correct voucher occuring data return statuscode 200 and success 1', async () => {

        const start = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const end = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // input for voucher
        // leave code null
        const voucherData = {
            offeredBy: restaurantId,
            discount: 50,
            startOffer: start,
            endOffer: end,
            count: 9,
            code: 'ABCD$RE'
        }

        const response = await request(app).post('/api/user/voucher').send(voucherData);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        // check on whether reoccuring field is equal to the initial count at count field
        const voucherId = response.body.results[0].insertId
        const [searchResponse] = await poolPromise.execute(`select * from Voucher where id = ?`, [voucherId])
        const reoccuringCount = searchResponse[0].reoccuring
        console.log(reoccuringCount)
        expect(reoccuringCount).toBe(9)
    })
})
