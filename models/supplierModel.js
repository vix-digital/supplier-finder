var mongoose = require('mongoose');

var supplierSchema = mongoose.Schema({
    name: String,
    capability: {
        performance_analysis_and_data: String,
        security: String,
        service_delivery: String,
        software_development: String,
        support_and_operations: String,
        testing_and_auditing: String,
        user_experience_and_design: String,
        user_research: String,
    },
    location: {
        remote_working: String,
        scotland: String,
        north_east_england: String,
        north_west_england: String,
        yorkshire_and_the_humber: String,
        east_midlands: String,
        west_midlands: String,
        east_of_england: String,
        wales: String,
        london: String,
        south_east_england: String,
        south_west_england: String,
        northern_ireland: String
    }
})

module.exports = mongoose.model('Supplier', supplierSchema);
