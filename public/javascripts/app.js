$('#supplier-search').on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('search submit');
});