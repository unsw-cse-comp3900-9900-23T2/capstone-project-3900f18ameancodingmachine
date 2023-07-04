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
    getDecryptedToken,
} from "./user.controller.js";
import express from 'express';
import { checkToken } from "../auth/tokenvalid.js";

const router = express.Router();

//if a route requires an authenticated user with access to a token
//use the checktoken as the middlewear function like so
// e.g. router.METHOD("/someRoute", checkToken, function)

//these two routes return and insertId in the response, use this to create the user
router.post("/account", createAccountInfo); // create success
router.post("/address", createAddressInfo);  // create success

router.post("/user", createUser); //create success 
router.get("/userall", getAllUsers); //get success
router.get("/:id", getUserById) // get success
router.post("/login", login); //login success
router.put("/logout", logout); //logout success

router.post("/eatery", createEatery); // success
router.post("/cuisine", createCuisine); // success
router.post("/cuisine-offer", createRestaurantCusine); //success
router.post("/hour", createBusinessHour); // ok
router.post("/posts", createEateryPosts) // ok
router.post("/reviews", createUserReviews) // ok

router.get("/post/:id", getPostById) // ok
router.get("/review/:id", getReviewById) // ok
router.get("/cuisine/:id", getCuisineById) //ok
router.get("/eatery/:id", getEateryByLogin) // ok

router.get("/", checkToken, getDecryptedToken);

// these routes below are using await/async function
// router.post("/eatery1", createEatery2);
// router.post("/cuisine1", createCuisine2);
// router.post("/cuisine-offer1", createRestaurantCusine2);
// router.post("/hour1", createBusinessHour2);
export { router };


