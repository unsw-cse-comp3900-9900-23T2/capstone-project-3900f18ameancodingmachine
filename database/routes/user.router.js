import { createAccountInfo, 
    createAddressInfo, 
    createUser, 
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
    createSubscribedTo,
    showSubscribedEateries,
    getEateryFiltered,
    forgottenPasswordReset,
} from "./user.controller.js";
import express from 'express';
import { checkToken } from "../auth/tokenvalid.js";
import { createVoucher, getCuisines, getEateries, updateDescription, createEatery, createEateryDietary } from "./restaurant.controller.js";
import { passwordRecovery } from "../nodemailer/config.js";
import { verfiyResetCode } from "../nodemailer/pass_reset.js";

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
router.get("/eatery/find", getEateryFiltered) 
router.get("/eatery/all", getEateries);
router.post("/eatery/dietary", createEateryDietary)
router.post("/cuisine", createCuisine); 
router.post("/cuisine-offer", createRestaurantCusine); 
router.post("/hour", createBusinessHour); 
router.post("/posts", createEateryPosts); 
router.post("/reviews", createUserReviews);
router.post("/subscribe", createSubscribedTo); 

router.get("/post/:id", getPostById) 
router.get("/review/:id", getReviewById)
router.get("/cuisine/:id", getCuisineById)
router.get("/eatery/cuisines", getCuisines) 
router.get("/eatery/:id", getEateryById)
router.get("/subscribe/:id", showSubscribedEateries)

router.post("/voucher", createVoucher)
router.put("/eatery/description", updateDescription)

// check account based on loginid
router.get("/eatery/login/:id", getEateryByLogin)

//Password reset
router.post("/reset", passwordRecovery);
router.get("/checkreset/:login/:code", verfiyResetCode);
router.post("/resetpassword", forgottenPasswordReset);

router.get("/", checkToken, getToken);

export { router };


