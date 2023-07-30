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

describe('/comment', () => {
    let userLoginId;
    let eateryLoginId;
    let addressId;
    let restaurantId;
    let userId;
    let eateryAccount;
    let postId;

    beforeEach(async () => {
        let response = await request(app).post("/api/user/account").send(eateryLoginData)
        eateryLoginId = response.body.data.insertId

        response = await request(app).post("/api/user/account").send(userLoginData)
        userLoginId = response.body.data.insertId
       
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

        // create user account
        const userAccount = {
            first: "first",
            last: "last",
            loginId: userLoginId,
            addressId: addressId //fake
         }

        response = await request(app).post("/api/user/eatery").send(eateryAccount);
        restaurantId = response.body.results.insertId

        response = await request(app).post("/api/user/user").send(userAccount)
        userId = response.body.data.insertId

        const postData = {
            postedBy: restaurantId,
            title: "first post",
            content: "this is the first post"
        }

        response = await request(app).post('/api/user/posts').send(postData)
        postId = response.body.data.insertId
    })

    afterEach(async () => {
        let query = `delete from LoginInfo`
        let res = await poolPromise.execute(query)
        query = `delete from Posts`
        res = await poolPromise.execute(query)
        query = `delete from PostComments`
        res = await poolPromise.execute(query)
    })

    test('write comment will return statuscode 200 and success of 1', async () => {
        const commentData = {
            userId: userId,
            postId: postId,
            comment: "first comment"
        }

        const response = await request(app).post("/api/user/user/comment").send(commentData);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test('user can write multiple comments', async () => {
        const commentData = {
            userId: userId,
            postId: postId,
            comment: "first comment"
        }

        let response = await request(app).post("/api/user/user/comment").send(commentData);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        const commentData2 = {
            userId: userId,
            postId: postId,
            comment: "second comment"
        }

        response = await request(app).post("/api/user/user/comment").send(commentData2);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })
})