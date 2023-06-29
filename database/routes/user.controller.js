
import { createAddress, 
    createLogin, 
    createUse, 
    createPosts, 
    createReviews,
    createSubscribedTo, 
    getUsers,
    getUserByUserId, 
    getLoginByUsername, 
    createEateryAccount, 
    insertNewCuisineName, 
    insertCuisineFromRestaurant, 
    insertHourFromRestaurant, 
    getCuisineFromCuisineId,
    getPostByPostId, 
    getReviewByReviewId 
} from "./user.service.js";
import crypto from "crypto";
import pkg from "jsonwebtoken";
import 'dotenv/config';

const { sign } = pkg;

//used to store invalidated tokens once a user logs-out
export let tokenBlackList = [];

//Controller functions
//async functions are written function2

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

export function createUserReviews(req, res) {
    const body = req.body
    createReviews(body, (err, results) => {
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

export function createEateryPosts(req, res) {
    const body = req.body
    body.password = getHashOf(body.password);
    createNewPost(body, (err, results) => {
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

export function createSubscribedTo(req, res) {
    const body = req.body
    body.password = getHashOf(body.password);
    createSubscribedTo(body, (err, results) => {
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
    });
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
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        if (!results) {
            return res.json({
                success: 0,
                data: "Invalid username or password"
            });
        }

        //check if hashed password matches
        const result = getHashOf(body.password) === results.password;

        if (result) {
            results.password = undefined;
            const jsonwebtoken = sign({result: results}, process.env.SECRET, {expiresIn: "1h"});
            //provide user with a cookie containing A token
            res.cookie('token', jsonwebtoken,{
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
            });
            //confirm success
            return res.status(200).json({
                success: 1,
                data: "Login successful"
            });
        } else {
            return res.json({
                success: 0,
                data: "Invalid username or password"
            });
        }
    });
}

export function logout(req, res) {
    const token = req.cookies.token;
    if (token) {
        tokenBlackList.push(token);
        return res.json({
            success: 1,
            message: "You've been logged-out!"
        });
    } else {
        return res.json({
            success:0,
            message: "Not logged-in!"
        });
    }
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

export function createCuisine(req,res) {
    const body = req.body;
    insertNewCuisineName(body, (err, results) => {
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

export function getCuisineById(req, res) {
    const id = req.params.id
    getCuisineFromCuisineId(id, (err, results) => {
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
                message: "Cuisine not found"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        });
    });
}

export function getPostById(req, res) {
    const id = req.params.id
    getPostByPostId(id, (err, results) => {
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
                message: "Post not found"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        });
    });
}

export function getReviewById(req, res) {
    const id = req.params.id
    getReviewByReviewId(id, (err, results) => {
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
                message: "Review not found"
            });
        }
        return res.status(200).json({
            success: 1,
            data: results
        });
    });
}

export function createRestaurantCusine(req, res) {
    const body = req.body;
    insertCuisineFromRestaurant(body, (err, results) => {
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

export function createBusinessHour(req, res) {
    const body = req.body;
    insertHourFromRestaurant(body, (err, results) => {
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
        });
    });
}

//Used to hash the password for security
function getHashOf(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}