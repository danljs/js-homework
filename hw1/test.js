let compare = require('./compare');
let oldData = [
    {
      "firstName": "Tom",
      "lastName": "Zhang",
      "ext": "1001",
      "cell": "416-000-0000",
      "alt": "",
      "title": "Manager",
      "email": "tomz@jsrocks.com"
    },
    {
      "firstName": "Peter",
      "lastName": "Wang",
      "ext": "1003",
      "cell": "647-222-2222",
      "alt": "416-333-3333",
      "title": "QA",
      "email": "peterw@jsrocks.com"
    },
    {
      "firstName": "Peter1",
      "lastName": "Wang",
      "ext": "1003",
      "cell": "647-222-2222",
      "alt": "416-333-3333",
      "title": "QA",
      "email": "peterw@jsrocks.com"
    }
  ],
  newData = [
    {
      "firstName": "Tom",
      "lastName": "Zhang",
      "ext": "1001",
      "cell": "416-000-0000",
      "alt": "416-456-4567",
      "title": "Manager",
      "email": "tomz@jsrocks.com"
    },
    {
      "firstName": "Peter",
      "lastName": "Wang",
      "ext": "1003",
      "cell": "647-222-2222",
      "alt": "416-333-3333",
      "title": "QA",
      "email": "peterw@jsrocks.com"
    },
    {
      "firstName": "Daniel",
      "lastName": "Liu",
      "ext": "1003",
      "cell": "647-888-2222",
      "alt": "416-999-3333",
      "title": "QA",
      "email": "daniell@jsrocks.com"
    }
  ];
let result = compare(oldData, newData);
console.log(result);