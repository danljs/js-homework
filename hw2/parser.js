const http = require('http');
const jsdom = require('jsdom').jsdom;

module.exports = url => new Promise(resolve => http.get(url, res => {
  let html = '';
  res.on('data', chunk => html += chunk);

  res.on('end', () => {
    const doc = jsdom(html);
    //html = html.toLowerCase();
    //const doc = jsdom(html.slice(html.indexOf('<table'), html.indexOf('</table>') + 8));
    const keys = doc.querySelectorAll('tr th');
    const values = doc.querySelectorAll('tr td');
    const rows = [];
    for (let i = 0; i < values.length / keys.length; i++) {
      const row = {};
      for (let j = 0; j < keys.length; j++) {
        row[keys[j].textContent] = values[(i * keys.length) + j].textContent;
      }
      rows.push(row);
    }
    resolve(rows);
  });
}));
