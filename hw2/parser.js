const http = require('http');
const jsdom = require('jsdom').jsdom;

module.exports = url => new Promise(resolve => http.get(url, res => {
  let html = '';
  res.on('data', chunk => html += chunk);

  res.on('end', () => {
    const doc = jsdom(html);
    const keys = doc.querySelectorAll('tr th');
    const values = doc.querySelectorAll('tr td');
    const rows = [];
    for (let i = 0; i < values.length; i += keys.length) {
      const row = {};
      for (let j = 0; j < keys.length; j += 1) {
        row[keys[j].textContent] = values[i + j].textContent;
      }
      rows.push(row);
    }
    resolve(rows);
  });
}));
