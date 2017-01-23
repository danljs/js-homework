const parser = require('./parser');
const compare = require('../hw1/compare');
const fs = require('fs');

const keys = ['First Name', 'Last Name', 'Extension', 'Cell Number', 'Alternative NumberEmergency Only', 'Title'];
const key = 'E-mail Address';

const data_dir = __dirname + '/data';
!!!fs.existsSync(data_dir) ? fs.mkdirSync(data_dir) : ''

const today = new Date().toISOString().slice(0,10);
let yesterday = new Date();
yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1)).toISOString().slice(0,10);

let result = parser('http://web-aaronding.rhcloud.com/employee.html').then(
  e1 => {
  	fs.writeFileSync(`${data_dir}/${today}.json`, JSON.stringify(e1), 'utf8');
  	let oldData = `${data_dir}/${yesterday}.json`
  	fs.existsSync(oldData) ? 
		console.log(compare(JSON.parse(fs.readFileSync(oldData),'utf8'), e1, key, keys))
		:
		console.log('Nothing Old!');
  }
);

