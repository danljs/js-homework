let parser = require('./parser');

let result = parser('http://web-aaronding.rhcloud.com/employee.html').then(
  e1 => console.log(e1)
);
