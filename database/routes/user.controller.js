import { createAddress, createLogin, createUse, getUsers, getUserByUserId, getLoginByUsername, createEateryAccount, insertNewCuisineName, insertNewCuisineName2 } from "./user.service.js";
import { poolPromise } from "../db-config/db_connection.js";
import crypto from "crypto";
import pkg from "jsonwebtoken";
import 'dotenv/config';

const { sign } = pkg;

//Controller functions

//create account in LoginInfo table
export function createAccountInfo(req, res) {
    const body = req.body
    body.password = getHashOf(body.password);
    createLogin(body, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        })
    })
}

//create address in Address table
export function createAddressInfo(req, res) {
    const body = req.body
    createAddress(body, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        })
    })
}

//create User in UserAccount table
export function createUser(req, res) {
    const body = req.body
    createUse(body, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        })
    })
}

//get user by userId
export function getUserById(req, res) {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        if (!results) {
            return res.status(404).json({
                success: 0,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        })
    })
}

//get all existing users
export function getAllUsers(req, res) {
    getUsers((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        })
    });
}

//user obtains token here
export function login(req, res) {
    const body = req.body;
    getLoginByUsername(body.login, (err, results) => {
        if (err) {
            console.log(err);
        }
        if (!results) {
            return res.json({
                success: 0,
                data: "Invalid username or password"
            });
        }
        //check if hashed password matches
        const result = getHashOf(body.password) === results.password;
        if(result) {
            results.password = undefined;
            const jsonwebtoken = sign({result: results}, process.env.SECRET, {
                expiresIn: "1h"
            });
            return res.json({
                success: 1,
                message: "Login Success!",
                token: jsonwebtoken
            });
        } else {
            return res.json({
                success: 0,
                data: "Invalid username or Pass"
            });
        }
    });
}

export function createEatery(req,res) {
    const body = req.body;
    createEateryAccount(body, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database conenction error"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        })
    })
}

// async function
export async function createEatery2(req, res) {
    try {
        const body = req.body;
        const name = body.name;
        const query = `insert into EateryAccount(name, address, phone, email, login, url) values (?, ?, ?, ?, ?, ?)`;
        const values = [body.name, body.address, body.phone, body.email, body.login, body.url];
        const [result] = await poolPromise.execute(query,values);
        return res.status(200).json({
            success: 1,
            results: result
        });
    } catch (err) {
        return res.status(500).json({
            success: 0,
            results: 'Database Connection Error'
        })
    }
}

export async function createCuisine2(req, res) {
    try {
        const body = req.body;
        const name = body.name;
        const query = `insert into Cuisine(name) values (?)`;
        const [result] = await poolPromise.execute(query,[name]);
        return res.status(200).json({
            success: 1,
            results: result
        });
    } catch (err) {
        return res.status(500).json({
            success: 0,
            results: 'Database Connection Error'
        });
    }
}

// ignore this for now
export function createCuisine1(req,res) {
    const body = req.body;
    return insertNewCuisineName2(body);
}

//Used to hash the password for security
function getHashOf(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}