import { createAccountInfo, createAddressInfo, createUser, createEatery, getAllUsers, getUserById, login, createCuisine, createBusinessHour, createRestaurantCusine, createNewPost, createReviews, createSubscribedTo, getPostById, getReviewById } from "./user.controller.js";
import { createBusinessHour2, createCuisine2, createEatery2, createRestaurantCusine2 } from "./user.service2.js";
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

router.post("/eatery", createEatery);
router.post("/cuisine", createCuisine);
router.post("/cuisine-offer", createRestaurantCusine);
router.post("/hour", createBusinessHour);
router.post("/posts", createNewPost)
router.post("/reviews", createReviews)
router.post("/subscribe", createSubscribedTo)

router.get("/:post", getPostById)
router.get("/:review", getReviewById)

// these routes below are using await/async function
router.post("/eatery1", createEatery2);
router.post("/cuisine1", createCuisine2);
router.post("/cuisine-offer1", createRestaurantCusine2);
router.post("/hour1", createBusinessHour2);
export { router };


