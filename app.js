const express = require('express');
const fetch = require('node-fetch');
const app = express()
const port = 5000;
const base64 = require('base-64');
const fs = require('fs')
const xml2js = require('xml2js')

let parser = new xml2js.Parser();

app.get('/', (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send('Hello, Server!');
});

fs.readFile('//SERVER/webdata/import1_1.xml', (err, data) => {
    console.log(err)
    parser.parseString(data, (err, result) => {
        console.log(result);
        fs.writeFile('import.txt', JSON.stringify(result), () => {})
        console.log('Done');
    })
})

fs.readFile('//SERVER/webdata/offers1_1.xml', (err, data) => {
    console.log(err)
    parser.parseString(data, (err, result) => {
        console.log(result);
        fs.writeFile('offers.txt', JSON.stringify(result), () => {})
        console.log('Done');
    })
})




const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
});

