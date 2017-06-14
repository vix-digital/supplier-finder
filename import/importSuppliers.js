var supplier_controller = require('../controllers/supplierController.js')

console.log('Importing suppliers from csv.');
supplier_controller.import(function(err, message) {
    console.log('done');
    if (err) {
        console.log(err);
    }
    console.log(message)
});