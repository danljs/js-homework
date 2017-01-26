const http = require('http');
const jsdom = require('jsdom').jsdom;
const fs = require('fs');

((url, keys, key, last) => {
  const data_dir = __dirname + '/data';
  !!!fs.existsSync(data_dir) ? fs.mkdirSync(data_dir) : '';

  const today = new Date().toISOString().slice(0, 10);

  const parser = url => new Promise(resolve => http.get(url, res => {
    let html = '';
    res.on('data', chunk => html += chunk);

    res.on('end', () => {
      const doc = jsdom(html);
      const names = doc.querySelectorAll('tr th');
      const values = doc.querySelectorAll('tr td');
      const rows = [];
      for (let i = 0; i < values.length; i += names.length) {
        const row = {};
        for (let j = 0; j < names.length; j += 1) {
          row[names[j].textContent] = values[i + j].textContent;
        }
        rows.push(row);
      }
      resolve(rows);
    });
  }));

  const compare = (oldData, newData) => {
    const result = { added: [], deleted: [], modified: [] };
    const oldDataObj = {};

    const isChanged = (o, n) => {
      for (let i = 0; i < keys.length; i++){
        if (o[keys[i]] !== n[keys[i]]) {
          return true ;
        }
      }
      return false ;
    };

    oldData.map(o => oldDataObj[o[key]] = o);

    newData.map(n => {
      const o = oldDataObj[n[key]];
      if (!o) {
        result.added.push(n);
      } else {
        isChanged(o, n) ? result.modified.push({ before: o, after: n }) : '';
        delete oldDataObj[n[key]];
      }
    });

    result.deleted.push(oldDataObj);

    return result;
  }

  parser(url).then(
    e1 => {
      fs.writeFile(`${data_dir}/${today}.json`, JSON.stringify(e1), 'utf8', err => {
        if (err) {
          return console.log(err);
        }

        const oldData = `${data_dir}/${last}.json`;
        fs.exists(oldData, exists => {
          if (exists) {
            fs.readFile(oldData, (err, contents) => {
              if (err) {
                return console.log(err);
              }
              console.log(compare(JSON.parse(contents, 'utf8'), e1))
            });
          } else {
            console.log('Nothing Changed!');
          }
        });
      });
    }
  );
})(
  'http://web-aaronding.rhcloud.com/employee.html',
  ['First Name', 'Last Name', 'Extension', 'Cell Number', 'Alternative NumberEmergency Only', 'Title'],
  'E-mail Address',
  '2017-01-25'
);

