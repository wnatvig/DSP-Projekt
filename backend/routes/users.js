//imports
const express = require("express");
const router = express.Router();
const { createUser} = require('../services/dbFunctions');

router.post('/', async (req, res)=>{
    try{
        const result = await createUser(req.body);
        res.status(201).json({
            success: true,
            data: result
        
            });
        }
    catch(err){
        res.status(500).json({
            success: false,
            error: err.message
            });
        }
    }
);
module.exports = router;




