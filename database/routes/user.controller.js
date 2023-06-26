import { createAddress, createLogin, createUse, getUsers, getUserByUserId, getLoginByUsername } from "./user.service.js";
import crypto from "crypto";
import { sign  } from "jsonwebtoken";
import 'dotenv/config';

//wrapper functions

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
        //check if password matches
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

function getHashOf(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}