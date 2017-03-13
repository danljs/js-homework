const http = require('http');
const jsdom = require('jsdom').jsdom;
const fs = require('fs');
const path = require('path');
const URL = require('url');
const iconv = require('iconv-lite');
const openurl = require('openurl')

const config_51={
  charset: 'gb2312',
  url: 'http://www.51.ca/service/servicedisplay.php?s=3e47f0d78f126ede021c67a93e7c7d18&serviceid=122',
  list: '.itemListBox #ItemList .item',
  data:[
    { name: 'title', selector: '.itemtitle', type: 'text'},
    { name: 'phone', selector: '.phonebox .phone', type: 'text'},
    { name: 'detail',selector: '.itemtitle', type: 'link', data: [
      { name: 'person', selector: 'h3 a'},
      { name: 'website', selector: 'h3 a'},
      { name: 'address', selector: 'h3 a'},
      { name: 'keyword', selector: 'h3 a'},
      { name: 'images', selector: 'h3 a'},
    ]},
  ]
};

const config_yb={
  charset: 'utf-8',
  url: 'http://info.yorkbbs.ca/eat/kitchen',
  list: '#content_list .mainList-item',
  data:[
    { name: 'title', selector: '.item-cont h2 a', type: 'text'},
    { name: 'phone', selector: '.item-cont-pin .item-cont-phone', type: 'text'},
    { name: 'detail',selector: '.item-cont h2 a', type: 'link', data: [
      { name: 'person', selector: 'h3 a', type: 'text'},
      { name: 'website', selector: 'h3 a', type: 'text'},
      { name: 'address', selector: 'h3 a', type: 'text'},
      { name: 'keyword', selector: 'h3 a', type: 'text'},
      { name: 'images', selector: 'h3 a', type: 'image'},
    ]}
  ]
};

// const config = config_51;
const config = config_yb;

const data_dir = path.join(__dirname, '/data');
let init = () => {
  return new Promise(resolve => {
    fs.stat(data_dir, err => {
      if (!!err && err.code === 'ENOENT') {
        fs.mkdir(data_dir, err1 => {
          if (err1) return console.error(err1);
        });
      }
      resolve();
    });
  });
}

let fetch = () => {
  const options = URL.parse(config.url);
  options.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
  };
  return new Promise((resolve, reject) => 
    http.get(options, res => {
      let arrBuf = [];
      let bufLength = 0;
      res.on('data', chunk => {
        arrBuf.push(chunk);
        bufLength += chunk.length;
      })
      .on('end', () => {
        let chunkAll = Buffer.concat(arrBuf, bufLength);
        let strJson = iconv.decode(chunkAll, config.charset);
        resolve(strJson);
      });
    }).on('error', err => reject(err))
  );
}
let load = html => {
  return new Promise((resolve, reject) => {
    jsdom.env(html, ['http://code.jquery.com/jquery.js'], (err, doc) => {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });
}
let parse = doc =>{
  return new Promise((resolve, reject) => {
    const $ = doc.$;
    const items = $(config.list);
    let rows = [];
    for (let i = 0; i < items.length; i++) {
      let row = {};
      config.data.map(c => {
        switch (c.type) {
          case 'link':
            row[c.name] = $(c.selector, items[i]).attr('href');
            break;
          case 'image':
            // row[c.name] = $(c.selector, items[i]).text();
            // break;
          case 'text':
          default:
            row[c.name] = $(c.selector, items[i]).text();
        }
        
      })
      rows.push(row);
    }
    resolve(rows);
  });
}
let downImg = imgurl => {
  return new Promise(resolve => {
    http.get(imgurl, res => {
      var imgData = '';
      res.setEncoding('binary');
      res.on('data', chunk => imgData += chunk);
      res.on('end', () => resolve(imgData));
    });
  });
}
let saveImage = data => {
  return new Promise(resolve => {
    fs.writeFile(`${data_dir}/`, data, 'binary', err => {
      if (err) return console.log(err);
      resolve('image saved!');
    });
  });
}

let save = data => {
  return new Promise(resolve => {
    fs.writeFile(`${data_dir}/data.json`, JSON.stringify(data), err => {
      if (err) return console.log(err);
      openurl.open(`${data_dir}/data.json`);
      resolve('saved!');
    });
  });
}
module.exports = function (){
  init().then(fetch).then(load).then(parse).then(save).then(result=>console.log(result), err=>console.log(err));
}