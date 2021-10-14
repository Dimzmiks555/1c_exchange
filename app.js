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



fs.watch('//SERVER/webdata', (eventType, filename) => {
    console.log(`event type is: ${eventType}`);
    if (filename && eventType == 'change') {

      if (filename.search('import') != -1) {
        console.log('Товар')
        console.log(`filename provided: ${filename} ${new Date().toLocaleTimeString()}`);


      fs.readFile(`//SERVER/webdata/${filename}`, (err, data) => {
          console.log(err)
          parser.parseString(data, (err, result) => {
              console.log(result['КоммерческаяИнформация'])
              fetch('http://admin.stroitelstore.ru/1c_exchange/', {
                  body: JSON.stringify(result['КоммерческаяИнформация']),
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json; charset=utf-8' },
              })
              .then(response => {
                  console.log(response)
                  console.log(response.headers)
                  console.log(response.body)
              })
              .catch(error => {
                  console.log(error)
              })
          })
      })

      } else if (filename.search('offers') != -1) {
        console.log('Предложения')
        console.log(`filename provided: ${filename} ${new Date().toLocaleTimeString()}`);


        fs.readFile(`//SERVER/webdata/${filename}`, (err, data) => {
            console.log(err)
            parser.parseString(data, (err, result) => {
                console.log(result['КоммерческаяИнформация'])
                fetch('http://admin.stroitelstore.ru/1c_exchange/prices_and_counts', {
                    body: JSON.stringify(result['КоммерческаяИнформация']),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                })
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
            })
        })

      }


    } else {
      console.log('filename not provided');
    }
  });


const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
});

