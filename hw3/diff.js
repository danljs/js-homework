const http = require('http');
const jsdom = require('jsdom').jsdom;
const fs = require('fs');
const path = require('path');
const URL = require('url');
const openurl = require('openurl')

const url = 'http://web-aaronding.rhcloud.com/employee.html';
const keys = ['First Name', 'Last Name', 'Extension', 'Cell Number', 'Alternative NumberEmergency Only', 'Title'];
const key = 'E-mail Address';
const data_dir = path.join(__dirname, '/data');
const today = new Date().toISOString().slice(0, 10);

module.exports = function diff() {
  return {
    init() {
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
    },
    fetch() {
      const options = URL.parse(url);
      options.headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
      };
      return new Promise(resolve => http.get(options, res => {
        let html = '';
        res.on('data', chunk => html += chunk)
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
    },
    save(cur) {
      return new Promise(resolve => {
        fs.writeFile(`${data_dir}/${today}.json`, JSON.stringify(cur), err => {
          if (err) return console.log(err);
          // openurl.open(`${data_dir}/${today}.json`);
          resolve();
        });
      });
    },
    load() {
      return new Promise(resolve => {
        fs.readdir(data_dir, (err, items) => {
          items.sort();
          fs.readFile(`${data_dir}/${items.pop()}`, (err, last) => {
            if (err) return console.log(err);
            resolve(JSON.parse(last, 'utf8'));
          });
        });
      });
    },
    compare(last, cur) {
      function isChanged(o, n) {
        for (let i = 0; i < keys.length; i += 1) {
          if (o[keys[i]] !== n[keys[i]]) return true;
        }
        return false;
      }

      const result = { added: [], deleted: [], modified: [] };
      const lastObj = {};
      last.map(o => lastObj[o[key]] = o);
      cur.map(n => {
        const o = lastObj[n[key]];
        if (!o) {
          result.added.push(n);
        } else {
          if (isChanged(o, n)) result.modified.push({ before: o, after: n });
          delete lastObj[n[key]];
        }
      });
      result.deleted.push(lastObj);
      return result;
    },
    run() {
      Promise.all([this.init(), this.fetch(), this.load()])
      .then(data => {
        let [, cur, last] = data;
        const result = this.compare(last, cur);
        console.log('---added---');
        console.log(result.added);
        console.log('---deleted---');
        console.log(result.deleted);
        console.log('---modified---');
        console.log(result.modified);
        this.save(cur);
      });
    },
  }
}
