var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const suppliers = [
    { id: 1, name: "VIX Digital", service: "Digital Outcomes" },
    { id: 2, name: "Example 2", service: "Digital Outcomes" },
    { id: 3, name: "Example 3", service: "Digital Outcomes" },
  ];

  res.render('suppliers', { title: 'Suppliers', suppliers: suppliers });
});

module.exports = router;