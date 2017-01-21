const http = require('http');
const jsdom = require('jsdom').jsdom;

module.exports = url => new Promise(resolve => http.get(url, res => {
  let html = '';
  res.on('data', chunk => html += chunk);

  res.on('end', () => {
    const doc = jsdom(html);
    const keys = doc.querySelectorAll('tr th');
    const values = doc.querySelectorAll('tr td');
    let json = '[';
    for (let i = 0; i < values.length; i * keys.length) {
      json += '{';
      for (let j = 0; j < keys.length; j++, i++) {
        json += `"${keys[j].textContent}":"${values[i].textContent}",`;
      }
      json = `${json.slice(0, -1)}},`;
    }
    json = `${json.slice(0, -1)}]`;

    resolve(json);
  });
}));
