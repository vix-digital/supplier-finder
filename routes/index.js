var express = require('express')
var router = express.Router()
var supplier_controller = require('../controllers/supplierController.js')

router.get('/', supplier_controller.index)
router.get('/import', supplier_controller.import)

module.exports = router