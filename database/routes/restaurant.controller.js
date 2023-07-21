import { getEateriesBySearchString, getEateriesByDiet, getEateriesByCuisine, createNewVoucher, getAllCuisines, getAllEateries, updateExistingDescription, createEateryAccount, createRestaurantDietary, getAllEateryVouchers } from './restaurant.service.js'
import axios from 'axios'
import 'dotenv/config';

export async function createVoucher (req, res) {
    try {
        const body = req.body
        console.log(body)
        const result = await createNewVoucher(body)
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function updateDescription (req, res) {
    try {
        const body = req.body
        const result = await updateExistingDescription(body)
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function getEateryVouchers (req, res) {
    try {
        const id = req.params.id;
        const results = await getAllEateryVouchers(id)
        return res.status(200).json(results)    
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })    
    }
}

export async function getCuisines (req, res) {
    try {
        const results = await getAllCuisines()
        console.log(results)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: 'Database conenction error'
        })
    }
}

export async function getEateries (req, res) {
    try {
        const results = await getAllEateries()
        console.log(results)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: 'Database connection error'
        })
    }
}

export async function createEatery (req, res) {
    try {
        const body = req.body
        const result = await createEateryAccount(body)
        if (result.success === 0) {
            return res.status(400).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
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
        const string = req.query.string == "empty" ? req.query.string : null;
        const cuisine = req.query.cuisine == "empty" ? req.query.cuisine : null;
        const diet = req.query.diet == "empty" ? req.query.diet : null;
        const address = req.query.address == "empty" ? req.query.address : null;
        const distance = req.query.distance == "empty" ? req.query.distance : null;

        let cuisineMatch = (await getEateriesByCuisine(cuisine)).results
        let dietMatch = (await getEateriesByDiet(diet)).results
        let stringMatch = (await getEateriesBySearchString(string)).results   

        const intersection = cuisineMatch.filter(
            cuisineElement => {
                const cuisineId = cuisineElement.id;
                return dietMatch.some(dietElement => dietElement.id === cuisineId)
                    && stringMatch.some(stringElement => stringElement.id === cuisineId)
            }
        )
        let result = intersection
        //address only works if distance is also provided
        if (body.address && body.distance) {   
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
