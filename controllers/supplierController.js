var supplier_model = require('../models/supplierModel')

function listCategories() {
    const CATEGORIES = [
        'A','B','C','D','E','F','G','H','I','J',
        'K','L','M','N','O','P','Q','R','S','T',
        'U','V','W','X','Y','Z','1-9'
    ]

    return CATEGORIES
}

function findAll() {
    return new Promise(
        (resolve, reject) => {
            supplier_model.find({}, function(err, suppliers) {
                if (err) {
                    return reject(err)
                }
                return resolve(suppliers)
            })
        }
    )
}

exports.index = function(req, res) {
    var prefix = req.query.prefix

    function getTitle(prefix) {
        return prefix ? 'Suppliers starting with ' + prefix : 'Supplier Finder'
    }

    var title = getTitle(prefix);
    var categories = listCategories()

    findAll()
        .then(
            function(suppliers) {
                res.render('index', {
                    title: title,
                    categories: categories,
                    current: prefix,
                    suppliers: suppliers
                })
            })
        .catch(
            (reason) => {
                console.error(reason);
                res.render('503')
            }
        )

}