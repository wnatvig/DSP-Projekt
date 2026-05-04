//imports
const express = require("express");
const router = express.Router();
const {createUser, getUser, removeUser} = require('../services/dbFunctions');


router.post('/createUser', async (req, res)=>{
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

router.get('/getUser', async (req, res)=>{
    try{
        const result = await getUser(req.body);
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
});

router.delete('/deleteUser', async (req, res)=>{
    try{
        const result = await removeUser(req.body);
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


//mall
// router.('/', async (req, res)=>{
//     try{
//         const result = await (req.body);
//         res.status(201).json({
//             success: true,
//             data: result
        
//             });
//         }
//     catch(err){
//         res.status(500).json({
//             success: false,
//             error: err.message
//             });
//         }
//     }
// );

module.exports = router;




