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
    await db_clear()
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

describe('/posts', () => {
    let eateryLoginId;
    let addressId;
    let restaurantId;
    let eateryAccount;
    let postData;

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

        postData = {
            postedBy: restaurantId,
            title: "first post",
            content: "this is the first post"
        }
    })

    test('create post will have statuscode 200 and success of 1', async () => {
        const response = await request(app).post('/api/user/posts').send(postData)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test('finding a post with valid restaurantId will return statuscode 200 and success of 1', async () => {
        let response = await request(app).post('/api/user/posts').send(postData)

        response = await request(app).get(`/api/user/post/${restaurantId}`)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test('finding a post but no post found will return statuscode 404 and success 0', async () => {
        const noId = restaurantId - 1
        const response = await request(app).get(`/api/user/post/${noId}`)
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(0);
    })

    test('finding 1 post', async () => {
        let response = await request(app).post('/api/user/posts').send(postData)

        response = await request(app).get(`/api/user/post/${restaurantId}`)
        expect(response.body.data.length).toBe(1)
    })
})

describe('/likes', () => {
    let userLoginId;
    let eateryLoginId;
    let addressId;
    let eateryAccountId;
    let userAccountId;

    beforeEach(async () => {
        let response = await request(app).post("/api/user/account").send(userLoginData)
        userLoginId = response.body.data.insertId

        // register eatery
        response = await request(app).post("/api/user/account").send(eateryLoginData)
        eateryLoginId = response.body.data.insertId

        response = await request(app).post('/api/user/address').send(data)
        addressId = response.body.data.insertId

        // create user account, leaves address
        const userAccount = {
            first: "first",
            last: "last",
            loginId: userLoginId,
            addressId: addressId //fake
         }
 
        // create eatery account, leaves address
        const eateryAccount = {
            name: "another restaurant",
            addressId: addressId, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            loginId: eateryLoginId, 
            url: "www.anotherrestaurant.com",
        }
       
        response = await request(app).post("/api/user/eatery").send(eateryAccount)
        eateryAccountId = response.body.results.insertId

        response = await request(app).post("/api/user/user").send(userAccount)
        userAccountId = response.body.data.insertId
    })

    test('like a post will return statuscode 200 and success of 1', async () => {
        const postData = {
            postedBy: eateryAccountId,
            title: "first post",
            content: "this is the first post"
        }

        let response = await request(app).post('/api/user/posts').send(postData)
        const postId = response.body.data.insertId

        response = await request(app).put('/api/user/user/likes').send({ postId: postId })
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test('like the post will increse the amount of likes by 1', async () => {
        const postData = {
            postedBy: eateryAccountId,
            title: "first post",
            content: "this is the first post"
        }

        let response = await request(app).post('/api/user/posts').send(postData)
        const postId = response.body.data.insertId

        response = await request(app).put('/api/user/user/likes').send({ postId: postId })
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        let findQuery = `select likes from Posts where id = ?`

        response = await poolPromise.execute(findQuery, [postId])
        expect(response[0][0].likes).toBe(1)
    })
})