const express = require('express');
const fetch = require('node-fetch');
const app = express()
const port = 4000;
const base64 = require('base-64');

let username = 'Администратор';
let password = '2013';

// let headers = { 'Authorization': 'Basic ' + base64.encode(username + ":" + password) };
let headers = { 'Authorization': 'Basic 0JDQtNC80LjQvdC40YHRgtGA0LDRgtC+0YA6MjAxMw=='}

app.get('/', (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send('Hello, Server!');
});



let uri = 'http://server/1CBase/odata/standard.odata/Catalog_Номенклатура?$top=10&$format=json';


const encodedURI = encodeURI(uri); 


fetch(encodedURI, {
    method:'GET',
    headers: headers,
    }
)
.then(res => res.json())
.then(json => {

    let nomenklatura = []

    json.value.forEach(item => {
        nomenklatura.push(
            {
                'title': item['НаименованиеПолное'],
                'guid' : item['Ref_Key'],
                'isFolder' : item['IsFolder'],
                'sku' : item['Артикул'],
                'weigth' : item['Вес'],
                'type': item['ВидНоменклатуры_Key'],
                'unit': item['ЕдиницаИзмерения_Key'],
                'country': item['СтранаПроисхождения_Key'],
                
            }
        )
    });
    console.log(nomenklatura);
})
.catch(err => {
    console.log(err)
})


const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
});

