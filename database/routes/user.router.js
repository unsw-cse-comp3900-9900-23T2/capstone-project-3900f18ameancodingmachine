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
    logout
} from "./user.controller.js";
import express from 'express';
import { checkToken } from "../auth/tokenvalid.js";
import { verify } from "jsonwebtoken";

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
router.post("/login", login);
router.put("/logout", logout);

router.post("/eatery", createEatery);
router.post("/cuisine", createCuisine);
router.post("/cuisine-offer", createRestaurantCusine);
router.post("/hour", createBusinessHour);
router.post("/posts", createEateryPosts)
router.post("/reviews", createUserReviews)

router.get("/:post", getPostById)
router.get("/:review", getReviewById)

// these routes below are using await/async function
// router.post("/eatery1", createEatery2);
// router.post("/cuisine1", createCuisine2);
// router.post("/cuisine-offer1", createRestaurantCusine2);
// router.post("/hour1", createBusinessHour2);
export { router };


