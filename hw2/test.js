let parser = require('./parser');
let compare = require('../hw1/compare');
const keys = ['First Name', 'Last Name', 'Extension', 'Cell Number', 'Alternative NumberEmergency Only', 'Title'];
const key = 'E-mail Address';
let result = parser('http://web-aaronding.rhcloud.com/employee.html').then(
  e1 => {
  	//console.log(e1);
	console.log(compare(e1, e1, key, keys));
  }
);
