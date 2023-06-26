import { getLoginByUsername, createAccountInfo, createAddressInfo, createUser, getAllUsers, getUserById, login } from "./user.controller.js";
import express from 'express';

const router = express.Router();
//these two routes return and insertId in the response, use this to create the user
router.post("/account", createAccountInfo);
router.post("/address", createAddressInfo);

router.post("/user", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById)
router.post("/login", login);
export { router };


