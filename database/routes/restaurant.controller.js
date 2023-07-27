import { 
    getEateriesBySearchString, 
    getEateriesByDiet, 
    getEateriesByCuisine, 
    createNewVoucher, 
    getAllCuisines, 
    getAllEateries, 
    updateExistingDescription, 
    createEateryAccount, 
    createRestaurantDietary, 
    getAllEateryVouchers,
    storeEateryProfileImg
 } from './restaurant.service.js'
import axios from 'axios'
import 'dotenv/config';

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns result called from service function with statuscode 200
 * @returns object with success: 0 and database connection error with statuscode 500
 */
export async function createVoucher (req, res) {
    try {
        const body = req.body
        const result = await createNewVoucher(body)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns result called from service function with statuscode 200
 * @returns object with success: 0 and database connection error with statuscode 500
 */
export async function updateDescription (req, res) {
    try {
        const body = req.body
        const result = await updateExistingDescription(body)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns result called from service function with statuscode 200
 * @returns object with success: 0 and database connection error with statuscode 500
 */
export async function getEateryVouchers (req, res) {
    try {
        const id = req.params.id;
        const results = await getAllEateryVouchers(id)
        return res.status(200).json(results)    
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })    
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns result called from service function with statuscode 200
 * @returns object with success: 0 and database connection error with statuscode 500
 */
export async function getCuisines (req, res) {
    try {
        const results = await getAllCuisines()
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: 'Database conenction error'
        })
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns result called from service function with statuscode 200
 * @returns object with success: 0 and database connection error with statuscode 500
 */
export async function getEateries (req, res) {
    try {
        const results = await getAllEateries()
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns result called from service function with statuscode 200
 * @returns object with success: 0 and duplicate record message with statuscode 409
 * @returns object with success: 0 and database connection error with statuscode 500
 */
export async function createEatery (req, res) {
    try {
        const body = req.body
        const result = await createEateryAccount(body)
        if (result.success === 0) {
            return res.status(409).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({
            success: 0,
            message: 'Database conenction error'
        })
    }
}

//use google's distance matrix API to obtain distance in km
async function getDistanceBetweenAddresses(address1, address2) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/distancematrix/json',
        {
          params: {
            origins: address1,
            destinations: address2,
            key: process.env.GOOGLE_API_KEY,
          },
        }
      )
  
      const distance = response.data.rows[0].elements[0].distance.value/1000
      return distance
    } catch (error) {
      console.error('Error fetching distance:', error.message)
      return -1
    }
}

//search functionality
export async function getSearchResults(req, res) {
    try {
        const string = req.query.string
        const cuisine = req.query.cuisine
        const diet = req.query.diet
        const address = req.query.address
        const distance = req.query.distance

        let cuisineMatch = (await getEateriesByCuisine(cuisine)).results
        let dietMatch = (await getEateriesByDiet(diet)).results
        let stringMatch = (await getEateriesBySearchString(string)).results   

        const intersection = cuisineMatch.filter(
            cuisineElement => {
                const cuisineId = cuisineElement.id;
                //an eatery may have multiple cuisine and diet types
                const cuisineName = cuisineElement.cuisine;
                const cuisineDiet = cuisineElement.diet;
                return dietMatch.some(dietElement => dietElement.id === cuisineId && dietElement.cuisine === cuisineName && dietElement.diet === cuisineDiet)
                    && stringMatch.some(stringElement => stringElement.id === cuisineId && stringElement.cuisine === cuisineName && stringElement.diet === cuisineDiet)
            }
        )
        let result = intersection
        //address only works if distance is also provided
        if (address && distance) {   
            result = intersection.filter(async element => await getDistanceBetweenAddresses((element.street + ', ' + element.suburb + ', ' + element.region), address) <= distance)
        }
        return res.status(200).json({
            success: 1,
            results: result
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: 0,
            message: 'Database conenction error'
        }) 
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns result called from service function with statuscode 200
 * @returns object with success: 0 and duplicate record message with statuscode 409
 * @returns object with success: 0 and database connection error with statuscode 500
 */
export async function createEateryDietary (req, res) {
    try {
        const body = req.body
        const result = await createRestaurantDietary(body)
        return res.status(200).json(result)
    } catch (err) {
        // duplicate record error is 1062
        if (err.errno === 1062) {
            return res.status(409).json({
                success: 0,
                message: 'Entered duplicate record'
            })
        }
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function storeEateryProfileImgController (req, res) {
    // console.log(req.file)
    // console.log(req.body)
    // return res.status(200).json({
    //     success: 1,
    //     result: req.file
    // })
    try {
        const result = await storeEateryProfileImg(req.file.path, req.body.restaurantId)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}
