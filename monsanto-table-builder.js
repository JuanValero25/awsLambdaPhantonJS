'use strict';
var Table = require('table-builder');

const monsantoTableBuilder = (cssClassMap , data, headers) =>{
    let tableRenderd = new Table({'class': 'operational-year-main-table', 'cellspacing':'0'})
        .setHeaders(headers) // see above json headers section
        .setData(data) // see above json data section
        .render();

    let finalTable = tableRenderd;
    cssClassMap.forEach( (value, key) => {
        finalTable=finalTable.replace(new RegExp(key, 'g'), value);
    });
    return finalTable;
}


module.exports =  monsantoTableBuilder;



