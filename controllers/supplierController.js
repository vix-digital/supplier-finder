var supplier_model = require('../models/supplierModel')

exports.index = function(req, res) {
    var prefix = req.query.prefix

    function getTitle(prefix) {
        return prefix ? 'Suppliers starting with ' + prefix : 'Supplier Finder';
    }

    var title = getTitle(prefix);
    var categories = supplier_model.listCategories()
    var suppliers = supplier_model.findAll()

    res.render('index', {
        title: title,
        categories: categories,
        current: prefix,
        suppliers: suppliers
    })

}