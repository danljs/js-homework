const http = require('http');
const jsdom = require('jsdom').jsdom;
const fs = require('fs');
const path = require('path');

const url = 'http://web-aaronding.rhcloud.com/employee.html';
const keys = ['First Name', 'Last Name', 'Extension', 'Cell Number', 'Alternative NumberEmergency Only', 'Title'];
const key = 'E-mail Address';
const data_dir = path.join(__dirname, '/data');
const today = new Date().toISOString().slice(0, 10);

function Diff() {}

Diff.prototype.isChanged = function (o, n) {
  for (let i = 0; i < keys.length; i++) {
    if (o[keys[i]] !== n[keys[i]]) return true;
  }
  return false;
}

Diff.prototype.init = function () {
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

Diff.prototype.compare = function (oldData, newData) {
  const result = { added: [], deleted: [], modified: [] };
  const oldDataObj = {};
  oldData.map(o => oldDataObj[o[key]] = o);
  newData.map(n => {
    const o = oldDataObj[n[key]];
    if (!o) {
      result.added.push(n);
    } else {
      if (this.isChanged(o, n)) result.modified.push({ before: o, after: n });
      delete oldDataObj[n[key]];
    }
  });
  result.deleted.push(oldDataObj);
  return result;
}

Diff.prototype.fetch = function () {
  return new Promise(resolve => http.get(url, res => {
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
}

Diff.prototype.save = function (data) {
  return new Promise(resolve => {
    fs.writeFile(`${data_dir}/${today}.json`, JSON.stringify(data), err => {
      if (err) return console.log(err);
      resolve(data);
    });
  });
}

Diff.prototype.output = function (newData, last) {
  fs.readFile(`${data_dir}/${last}.json`, (err, oldData) => {
    if (err) return console.log(err);
    const result = this.compare(JSON.parse(oldData, 'utf8'), newData);
    console.log('---added---');
    console.log(result.added);
    console.log('---deleted---');
    console.log(result.deleted);
    console.log('---modified---');
    console.log(result.modified);
  });
}

module.exports = function (last) {
  const d = new Diff();
  d.init()
  .then(() => d.fetch())
  .then(data => d.save(data))
  .then(data => d.output(data, last));
}
