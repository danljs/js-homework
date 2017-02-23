const http = require('http');
const jsdom = require('jsdom').jsdom;
const fs = require('fs');
const path = require('path');
const URL = require('url');

const url = 'http://www.51.ca/service/';

let fetch = () => {
  const options = URL.parse(url);
  options.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
  };
  return new Promise((resolve, reject) => 
    http.get(options, res => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => resolve(html));
    }).on('error', err => reject(err))
  );
}

let parse = html => {
  return new Promise((resolve, reject) => {
    // const doc = jsdom(html);
    jsdom.env(html, ["http://code.jquery.com/jquery.js"], (err, window) => {
      if (err) {
        reject(err);
      } else {
        resolve(window);
      }
    });
  });
}
    // const names = doc.querySelectorAll('tr th');
    // const values = doc.querySelectorAll('tr td');
    // const rows = [];
    // for (let i = 0; i < values.length; i += names.length) {
    //   const row = {};
    //   for (let j = 0; j < names.length; j += 1) {
    //     row[names[j].textContent] = values[i + j].textContent;
    //   }
    //   rows.push(row);
    // }
    //console.log(rows);
  //   resolve(html);
  // });

module.exports = function (){
  fetch().then(parse).then(result=>console.log(result), err=>console.log(err));
}