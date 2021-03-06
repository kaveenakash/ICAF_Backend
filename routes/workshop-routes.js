const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const workshopController = require('../controllers/workshop-controller')
const checkAuth = require('../middleware/check-auth')

const fileUpload = require('../middleware/file-upload')
//  router.get('/',(req,res,next) =>{
//      console.log('Get request in place')
//      res.json({message:"It Works"})
//  })

//  router.get('/:pid',(req,res,next) =>{
//      const placeId = req.params.id;

//      console.log(placeId)
//      return res.json({message:"Hello"})
//  })

// router.post('/login',userController.login)

//Validation
//  router.post('/',check('title').not().isEmpty(),check('description).isLength({min:5}),controller)


router.post('/workshop-signUp',fileUpload.single('document'),workshopController.WorkShopSignUp)
router.get('/get-workshop-data',workshopController.GetAllWorkshopData)
router.put('/workshop-approve',workshopController.ApproveWorkshop)
router.delete('/workshop-delete',workshopController.DeleteWorkshop)
router.get('/workshop-approved',workshopController.GetAllApprovedWorkshops)


//This route below routes check is available token
router.use(checkAuth)

router.get('/protected',(req,res) =>{
    return res.status(200).json({
        message:"Hello"
    })
})
http://localhost:9090/api/workshop/workshop-approved

module.exports = router;
