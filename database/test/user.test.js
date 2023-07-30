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

    afterEach(async () => {
        const query = "delete from LoginInfo"
        const res = await poolPromise.execute(query)
    })

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

    afterEach(async () => {
        const query = "delete from LoginInfo"
        const res = await poolPromise.execute(query)
    })

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

    afterEach(async () => {
        const query = `delete from Address`
        const res = await poolPromise.execute(query)
    })

    test("address should return status code 200", async () => {
        const response = await request(app).post('/api/user/address').send(data)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(1)
    })
})

describe("/reviews", () => {

    afterEach(async () => {
        let query = `delete from LoginInfo`;
        let res = await poolPromise.execute(query)
        query = `delete from Reviews`;
        res = await poolPromise.execute(query)
        query = `delete from Address`;
        res = await poolPromise.execute(query)
        query = `delete from UserAccount`;
        res = await poolPromise.execute(query)
        query = `delete from EateryAccount`;
        res = await poolPromise.execute(query)
    })

    test("user review a restaurant, when search for the review, return statuscode 200 and success 1", async () => {
        // register user
        let response = await request(app).post("/api/user/account").send(userLoginData)
        const userLoginId = response.body.data.insertId

        // register eatery
        response = await request(app).post("/api/user/account").send(eateryLoginData)
        const eateryLoginId = response.body.data.insertId
       
        // create address   
        response = await request(app).post('/api/user/address').send(data)
        console.log(response.body.data.insertId)
        const addressId = response.body.data.insertId

        // create user account, leaves address
        const userAccount = {
           first: "first",
           last: "last",
           loginId: userLoginId,
           addressId: addressId //fake
        }

        // create eatery account
        const eateryAccount = {
            name: "another restaurant",
            addressId: addressId, //fake
            phone: "0493186858",
            email: "anotherrestaurant@gmail.com",
            loginId: eateryLoginId, 
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

describe('/subscribe', () => {

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

    afterEach(async () => {
        let query = `delete from LoginInfo`
        let res = await poolPromise.execute(query)
        query = `delete from UserAccount`;
        res = await poolPromise.execute(query);
        query = `delete from EateryAccount`;
        res = await poolPromise.execute(query);
        query = `delete from Address`;
        res = await poolPromise.execute(query);
    })

    test("user subscribe to registered restaurant", async () => {
        const subscribeData = {
            userId: userAccountId,
            restaurantId: eateryAccountId
        }

        let response = await request(app).put("/api/user/subscribe").send(subscribeData)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })

    test("finding what eateries the user is subscribed to", async () => {

        const subscribeData = {
            userId: userAccountId,
            restaurantId: eateryAccountId
        }

        let response = await request(app).put("/api/user/subscribe").send(subscribeData)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);

        let [res] = await poolPromise.execute(`select * from userSubscription where userId = ?`, [userAccountId])
        expect(res.length).toBe(1)

        response = await request(app).get(`/api/user/subscribe/${userAccountId}`)
        // console.log(response)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })
})

describe('/posts', () => {
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
        let res = await poolPromise.execute(query)
        query = `delete from Posts`
        res = await poolPromise.execute(query)
    })

    test('create post will have statuscode 200 and success of 1', async () => {
        const postData = {
            postedBy: restaurantId,
            title: "first post",
            content: "this is the first post"
        }

        const response = await request(app).post('/api/user/posts').send(postData)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(1);
    })


})

/**
 * test case:
 * 1. find based of restaurant name
 * 2. find based on location
 * 3. find based on cuisine
 * 4. find based on dietary restrictions
 * 5. one wrong info
 * 6. name of search is subset of restaurant name
*/
// describe("/eatery/find", () => {

//     const addressData = {
//         street: "unicorn street",
//         suburb: "dirtland",
//         region: "NSW",
//         postcode: "2025"
//     }

//     const cuisineData = {
//         name: "japanese"
//     }

//     beforeEach(async () => {
//         let  response = await request(app).post('/api/user/cuisine').send(cuisineData)
//         const cuisineId = response.body.data.insertId

//         response = await request(app).post("/api/user/address").send(addressData)
//         const eateryAddressId = response.body.data.insertId

//         const restaurantData = {
//             name: "another restaurant",
//             addressId: eateryAddressId,
//             phone: "0493186858",
//             email: "anotherrestaurant@gmail.com",
//             loginId: 0, //fake 
//             url: "www.anotherrestaurant.com",
//         }

//         // create the new eatery
//         response = await request(app).post('/api/user/eatery').send(restaurantData)
//         const restaurantId = response.body.results.insertId

//         const offerData = {
//             restaurantId: restaurantId,
//             cuisineId: cuisineId
//         }

//         // make cuisine offer from restaurant
//         response = await request(app).post('/api/user/cuisine-offer').send(offerData)
//         let restriction = "gluten free"
//         let query = `insert into DietaryRestrictions(restriction) values (?)`
//         let res = await poolPromise.execute(query, [restriction])
//         const dietId = res[0].insertId
//         query = `insert into provideDietary(restaurantId, dietId) values (?,?)`
//         await poolPromise.execute(query, [restaurantId, dietId])
//     })
    
//     afterEach(async() => {
//         let query = `delete from CuisineOffer`
//         let res = await poolPromise.execute(query)
//         query = `delete from LoginInfo`
//         res = await poolPromise.execute(query)
//         query = `delete from Address`;
//         res = await poolPromise.execute(query);
//         query = `delete from EateryAccount`;
//         res = await poolPromise.execute(query);
//         query = `delete from Cuisines`;
//         res = await poolPromise.execute(query);
//         query = `delete from DietaryRestrictions`;
//         res = await poolPromise.execute(query);
//         query = `delete from provideDietary`;
//         res = await poolPromise.execute(query);
//     })

//     test("find based on restaurant name", async () => {
//         const query = {
//             name: "another restaurant"
//         }
        
//         let response = await request(app).get('/api/user/eatery/find').query(query)

//         // if 200 it found something, else it becomes 404
//         expect(response.statusCode).toBe(200);
//         expect(response.body.success).toBe(1);
//         expect(response.body.results.length).toBe(1)
//     })

//     test("find based on location / suburb", async () => {
//         const query = {
//             location: "dirtland"
//         }
        
//         let response = await request(app).get('/api/user/eatery/find').query(query)

//         // if 200 it found something, else it becomes 404
//         expect(response.statusCode).toBe(200);
//         expect(response.body.success).toBe(1);
//         expect(response.body.results.length).toBe(1)
//     })

//     test("find based on cuisine", async () => {
//         const query = {
//             cuisine: "japanese"
//         }
        
//         let response = await request(app).get('/api/user/eatery/find').query(query)

//         // if 200 it found something, else it becomes 404
//         expect(response.statusCode).toBe(200);
//         expect(response.body.success).toBe(1);
//         expect(response.body.results.length).toBe(1)
//     })
    
//     test("find based on dietary restrictions", async () => {
//         const query = {
//             restriction: "gluten free"
//         }
        
//         let response = await request(app).get('/api/user/eatery/find').query(query)

//         // if 200 it found something, else it becomes 404
//         expect(response.statusCode).toBe(200);
//         expect(response.body.success).toBe(1);
//         expect(response.body.results.length).toBe(1)
//     })

//     test("one wrong information should return no results", async () => {
//         const query = {
//             name: "a restaurant",
//             restriction: "gluten free"
//         }
        
//         let response = await request(app).get('/api/user/eatery/find').query(query)

//         // if 200 it found something, else it becomes 404
//         expect(response.statusCode).toBe(404);
//         expect(response.body.success).toBe(0);
//     })

//     test("find based on subset of restaurant name", async () => {
//         const query = {
//             name: "restaurant"
//         }
        
//         let response = await request(app).get('/api/user/eatery/find').query(query)

//         // if 200 it found something, else it becomes 404
//         expect(response.statusCode).toBe(200);
//         expect(response.body.success).toBe(1);
//         expect(response.body.results.length).toBe(1)
//     })
    
// })


