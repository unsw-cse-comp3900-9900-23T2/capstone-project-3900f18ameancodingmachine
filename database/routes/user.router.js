import { createAccountInfo, 
    createAddressInfo, 
    createUser, 
    createEatery, 
    getAllUsers, 
    getUserById, 
    login,
    getPostById,
    getReviewById, 
    createCuisine, 
    createBusinessHour, 
    createRestaurantCusine, 
    createEateryPosts, 
    createUserReviews, 
    logout,
    getCuisineById,
    getEateryByLogin,
    getEateryById,
    getToken,
} from "./user.controller.js";
import express from 'express';
import { checkToken } from "../auth/tokenvalid.js";

const router = express.Router();

//if a route requires an authenticated user with access to a token
//use the checktoken as the middlewear function like so
// e.g. router.METHOD("/someRoute", checkToken, function)

//these two routes return and insertId in the response, use this to create the user
router.post("/account", createAccountInfo); 
router.post("/address", createAddressInfo); 

router.post("/user", createUser); 
router.get("/userall", getAllUsers); 
router.get("/:id", getUserById) 
router.post("/login", login); 
router.put("/logout", logout); 

router.post("/eatery", createEatery); 
router.post("/cuisine", createCuisine); 
router.post("/cuisine-offer", createRestaurantCusine); 
router.post("/hour", createBusinessHour); 
router.post("/posts", createEateryPosts) 
router.post("/reviews", createUserReviews) 

router.get("/post/:id", getPostById) 
router.get("/review/:id", getReviewById)
router.get("/cuisine/:id", getCuisineById) 
router.get("/eatery/:id", getEateryById)

// check account based on loginid
router.get("/eatery/login/:id", getEateryByLogin)

router.get("/", checkToken, getToken);

export { router };


