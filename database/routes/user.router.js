import { createAccountInfo, createAddressInfo, createUser, getAllUsers, getUserById, login } from "./user.controller.js";
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
export { router };


