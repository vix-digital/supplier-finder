var csvFilePath = 'import/digital-outcomes-suppliers.csv'
var csv = require('csvtojson')

var supplier_model = require('../models/supplierModel')

exports.index = function(req, res) {
    var prefix = req.query.prefix

    function getTitle(prefix) {
        return prefix ? 'Suppliers starting with ' + prefix : 'Supplier Finder'
    }

    var title = getTitle(prefix)
    var categories = listCategories()
    var regex = getStartsWithRegex(prefix)

    findAll(regex)
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
            (err) => {
                res.render('503')
            }
        )

}

function listCategories() {
    const CATEGORIES = [
        'A','B','C','D','E','F','G','H','I','J',
        'K','L','M','N','O','P','Q','R','S','T',
        'U','V','W','X','Y','Z','1-9'
    ]

    return CATEGORIES
}

/* Find All Suppliers
 * Accepts an optional regex to filter name by
 * Returns all suppliers in alphabetical order
 */
function findAll(regex) {    
    return new Promise(
        (resolve, reject) => {
            supplier_model.find({name: { $regex: regex, $options: 'm' }}, null, {sort: {name: 1}}, function(err, suppliers) {
                if (err) {
                    return reject(err)
                }
                return resolve(suppliers)
            })
        }
    )
}

exports.import = function(req, res) {
    importAll()
        .then(
            function(suppliers) {
                saveAll(suppliers)
                    .then(
                        function() {
                            res.status(200).json("Successfully imported data.")
                        }
                    )
                    .catch(
                        (err) => {
                            res.status(500).json("Error importing data.")
                        }
                    )
            }
        )
        .catch(
            (err) => {
                res.status(500).json("Error importing data." )
            }
        )
}

function importAll() {
    return new Promise(
        (resolve, reject) => {
            csv({
                noheader:true,
                headers: [
                    'name',
                    'capability.performance_analysis_and_data',
                    'capability.security',
                    'capability.service_delivery',
                    'capability.software_development',
                    'capability.support_and_operations',
                    'capability.testing_and_auditing',
                    'capability.user_experience_and_design',
                    'capability.user_research',
                    'location.remote_working',
                    'location.scotland',
                    'location.north_east_england',
                    'location.north_west_england',
                    'location.yorkshire_and_the_humber',
                    'location.east_midlands',
                    'location.west_midlands',
                    'location.east_of_england',
                    'location.wales',
                    'location.london',
                    'location.south_east_england',
                    'location.south_west_england',
                    'location.northern_ireland'
                ]
            })
                .fromFile(csvFilePath)
                .on('end_parsed', (data) => {
                    suppliers = data.slice(3)
                    return resolve(suppliers)
                })
                .on('error', (err) => {
                    return reject(err)
                })
        }
    )
}

function saveAll(collection) {
    return new Promise(
        (resolve, reject) => {
            supplier_model.create(collection, function(err, collection) {
                if (err) {
                    return reject(err)
                }
                return resolve()
            })
        }
    )
}

function getStartsWithRegex(prefix) {
    let regex = ''
    if (prefix) {
        if (prefix == '1-9') {
            prefix = '[1-9]'
        }
        regex = new RegExp('^' + prefix)
    }
    return regex
}