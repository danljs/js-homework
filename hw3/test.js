const http = require('http');
const jsdom = require('jsdom').jsdom;
const fs = require('fs');
const path = require('path');

((url, keys, key, last) => {
  const parser = () => new Promise(resolve => http.get(url, res => {
    let html = '';
    res
    .on('data', chunk => html += chunk)
    .on('end', () => {
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
      for (let i = 0; i < keys.length; i++) {
        if (o[keys[i]] !== n[keys[i]]) {
          return true;
        }
      }
      return false;
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

  const data_dir = path.join(__dirname, '/data');
  !fs.existsSync(data_dir) ? fs.mkdirSync(data_dir) : '';

  const today = new Date().toISOString().slice(0, 10);

  const output = e1 => {
    const oldData = `${data_dir}/${last}.json`;
    fs.exists(oldData, exists => {
      if (!exists) {
        return console.log('Nothing Changed!');
      }

      let contents = '';
      fs.createReadStream(oldData)
      .on('data', chunk => contents += chunk)
      .on('end', () => console.log(compare(JSON.parse(contents, 'utf8'), e1)));
    });
  };

  parser().then(e1 => {
    const wstream = fs.createWriteStream(`${data_dir}/${today}.json`);
    wstream.on('finish', () => output(e1));
    wstream.write(JSON.stringify(e1))
    wstream.end();
  });
})(
  'http://web-aaronding.rhcloud.com/employee.html',
  ['First Name', 'Last Name', 'Extension', 'Cell Number', 'Alternative NumberEmergency Only', 'Title'],
  'E-mail Address',
  '2017-01-25'
);
