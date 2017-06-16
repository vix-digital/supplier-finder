var supplierFilterForm = $('#supplier-filter');
var supplierFilterCheckbox = $('#supplier-filter .checkbox')
var resetFilterLink = $('#reset-filter-link')

resetFilterLink.click(function(e) {
    e.preventDefault();
    e.stopPropagation();

    // disable checkboxes
    $('#supplier-filter .checkbox input').prop('checked', false);

    // construct payload
    var prefix = getPrefix()
    var templateData = getSuppliersListTemplateData(prefix)

    // update suppliers list
    renderSuppliersList(templateData);
})

// fetches the users percieved prefix
function getPrefix() {
    var prefix = $('#atoz-list li.selected').text()
    return prefix
}

// constructs a template data payload for the suppliers template
function getSuppliersListTemplateData(prefix, filters) {
    var payload = {}

    if (prefix) {
        payload.prefix = prefix;
    }

    if (filters) {
        payload.filters = filters;
    }

    return payload
}

supplierFilterCheckbox.on('change', function(e) {
    e.preventDefault();
    e.stopPropagation();
    supplierFilterForm.submit();
});

supplierFilterForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    // get filters from formData
    var formData = supplierFilterForm.serializeArray();
    var filters = {}
    formData.forEach(function(filter) {
        filters[filter.name] = filter.value
    });

    // construct payload
    prefix = getPrefix()
    var templateData = getSuppliersListTemplateData(prefix, filters)

    // update suppliers list
    renderSuppliersList(templateData);
});



// get template and append to results body
function renderSuppliersList(templateData) {
    var resultsBody = $('#supplier-results');
    getSupplierResultsTemplate(templateData, function(err, template) {
        if (!err) {
            resultsBody.html(template);
            resultsBody.hide().fadeIn();
        }
    });
}

function getSupplierResultsTemplate(templateData, callback) {
    $.post('/results', templateData, function(template, response, xhr) {
        if (response == "success") {
            callback(null, template);
        }
        else {
            var err = new Error('Error retrieving results template.');
            callback(err, null);
        }
    });
}