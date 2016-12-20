let compare = require('./compare');

function generateData(num){
  let ret=[];
  for(let i = 0 ; i < num ; i++){
    ret.push({
      "firstName": "firstName" + i,
      "lastName": "lastName" + i,
      "ext": "ext" + i,
      "cell": "cell" + i,
      "alt": "alt" + i,
      "title": "title" + i,
      "email": "email" + i
    });
  }
  return ret;
}

function generateData1(num){
  let ret=[];
  for(let i = 0 ; i < num ; i++){
    ret.push({
      "firstName": "firstName" + (num - i - 1) ,
      "lastName": "lastName" + (num - i - 1),
      "ext": "ext" + (num - i - 1),
      "cell": "cell" + (num - i - 1),
      "alt": "alt" + (num - i - 1),
      "title": "title" + (num - i - 1),
      "email": "email" + (num - i - 1)
    });
  }
  return ret;
}

let number = 100000;
let oldData = generateData1(number);
let newData = generateData(number);
newData.splice(0,1);
newData.splice(8,1,{
  "firstName": "firstName" + "A",
  "lastName": "lastName" + "A",
  "ext": "ext" + "A",
  "cell": "cell" + "A",
  "alt": "alt" + "A",
  "title": "title" + "A",
  "email": "email" + "A"
});

newData.splice(2888,1,{
  "firstName": "firstName" + "A",
  "lastName": "lastName" + "A",
  "ext": "ext" + "A",
  "cell": "cell" + "A",
  "alt": "alt" + "A",
  "title": "title" + "A",
  "email": "email2889"
});

console.time('a');
let result = compare(oldData, newData);
console.timeEnd('a');
console.log(result);