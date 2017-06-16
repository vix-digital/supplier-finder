var csvFilePath = 'import/digital-outcomes-suppliers.csv'
var csv = require('csvtojson')
var _ = require('lodash')

var supplier_model = require('../models/supplierModel')

exports.index = function(req, res) {
    var prefixInput = req.query.prefix
    var filtersInput = req.cookies.filters
    var templateData = getSupplierTemplateData(prefixInput, filtersInput)

    findAll(templateData.filters)
        .then(
            function(suppliers) {
                templateData.suppliers = suppliers
                res.render('index', templateData)
            })
        .catch(
            (err) => {
                res.render('503')
            }
        )
}

function getSupplierTemplateData(prefixInput, filtersInput) {
    var templateData = {}

    templateData.categories = listCategories()
    templateData.prefix = getPrefix(prefixInput, templateData.categories)
    templateData.title = getTitle(templateData.prefix)
    templateData.filters = getFilters(filtersInput)

    var regex = getStartsWithRegex(templateData.prefix)
    if (regex) {
        templateData.filters.name = regex
    }

    return templateData
}

function listCategories() {
    const CATEGORIES = [
        'A','B','C','D','E','F','G','H','I','J',
        'K','L','M','N','O','P','Q','R','S','T',
        'U','V','W','X','Y','Z','1-9'
    ]

    return CATEGORIES
}

function getPrefix(query, categories) {
    var prefix;

    // query is not in categories list
    if (categories.indexOf(query) == -1) {
        return prefix
    }

    prefix = query;
    return prefix
}

function getTitle(prefix) {
    return prefix ? 'Suppliers starting with ' + prefix : 'Supplier Finder'
}

function getFilters(filters) {
    var defaults = {}
    var availableFilters = [
        "capability.user_research",
        "capability.user_experience_and_design",
        "capability.testing_and_auditing",
        "capability.support_and_operations",
        "capability.software_development",
        "capability.service_delivery",
        "capability.security",
        "capability.performance_analysis_and_data",
        "location.remote_working"
    ]

    if (!filters) {
        return defaults
    }
    else {

        // remove any filters that are not available
        _.each(filters, function(value, key) {
            if (availableFilters.indexOf(key) == -1) {
                delete filters[key]
            }
        })

        return filters
    }
}

function getStartsWithRegex(prefix) {
    var regex;

    if (prefix) {
        if (prefix == '1-9') {
            prefix = '[1-9]'
        }
        regex = new RegExp('^' + prefix)
    }
    
    return regex
}

/* Find All Suppliers
 * Accepts template data and returns suppliers
 * Returns suppliers in alphabetical order
 */
function findAll(filters) {
    return new Promise(
        (resolve, reject) => {
            supplier_model.find(filters)
                .collation({locale: "en"})
                .sort({name: 'asc'})
                .exec(function(err, suppliers) {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(suppliers)
                })
        }
    )
}

exports.results = function(req, res) {
    var prefixInput = req.body.prefix
    var filtersInput = req.body.filters
    var templateData = getSupplierTemplateData(prefixInput, filtersInput)

    // set the current state of the filters
    res.cookie('filters', templateData.filters)

    findAll(templateData.filters)
        .then(
            function(suppliers) {
                res.render('suppliers/_results', {
                    suppliers: suppliers
                })
            })
        .catch(
            (err) => {
                res.render('503')
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