const express = require('express');
const fetch = require('node-fetch');
const app = express()
const port = 4000;
const base64 = require('base-64');



// let headers = { 'Authorization': 'Basic ' + base64.encode(username + ":" + password) };
let headers = { 'Authorization': 'Basic 0JDQtNC80LjQvdC40YHRgtGA0LDRgtC+0YA6MjAxMw=='}

app.get('/', (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send('Hello, Server!');
});


let uriNom = 'http://server/1CBase/odata/standard.odata/Catalog_Номенклатура?$top=10000&$format=json';
let uriPrice = 'http://server/1CBase/odata/standard.odata/InformationRegister_ЦеныНоменклатуры?$top=10000&$format=json';
let uriAmount = 'http://server/1CBase/odata/standard.odata/AccumulationRegister_ТоварыНаСкладах?$top=10000&$format=json';


const NomEncodedURI = encodeURI(uriNom); 
const PriceEncodedURI = encodeURI(uriPrice); 
const AmountEncodedURI = encodeURI(uriAmount);

fetch(NomEncodedURI, {
    
    method:'GET',
    headers: headers,

})
.then(res => res.json())
.then(json => {

    let data = json.value

    let filteredData = data.filter(item => item['IsFolder'] != true)

    let nomenklatura = [];

    filteredData.forEach(item => {

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
                'parent_key' : item['Parent_Key']
            }
        )
    });
    console.log(nomenklatura.length);
})
.catch(err => {
    console.log(err)
})

fetch(PriceEncodedURI, {
    
    method:'GET',
    headers: headers,

})
.then(res => res.json())
.then(json => {

    let prices = [];

    json.value.forEach(item => {
        prices.push(...item['RecordSet'])
    })

    prices.forEach(item => {
        let date = new Date(item["Period"]);
        item.Fulldate = date.getTime()
    })

    prices.sort((a, b) => {
        return b.Fulldate - a.Fulldate;
    })



    console.log(prices.length)
})
.catch(err => {
    console.log(err)
})

fetch(AmountEncodedURI, {
    
    method:'GET',
    headers: headers,

})
.then(res => res.json())
.then(json => {
    let amounts = [];

    json.value.forEach(item => {
        amounts.push(...item['RecordSet'])
    })

    amounts.forEach(item => {
        let date = new Date(item["Period"]);
        item.Fulldate = date.getTime()
    })

    amounts.sort((a, b) => {
        return b.Fulldate - a.Fulldate;
    })

    console.log(amounts.length)
})
.catch(err => {
    console.log(err)
})

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
});

