var express = require('express')
var router = express.Router()
var supplier_controller = require('../controllers/supplierController.js')

router.get('/', supplier_controller.index)

module.exports = router