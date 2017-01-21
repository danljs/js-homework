const http = require('http');
const jsdom = require('jsdom').jsdom;

module.exports = url => new Promise(resolve => {
  http.get(url, response => {
    let html = '';
    response.on('data', chunk => html += chunk);

    response.on('end', () => {
      const doc = jsdom(html);
      const headers = doc.querySelectorAll('tr th');
      const keys = [];
      for (let i = 0; i < headers.length; i++) {
        keys.push([headers[i].textContent]);
      }

      const cells = doc.querySelectorAll('tr td');
      let json = '[';
      for (let i = 0; i < cells.length; i * keys.length) {
        json += '{';
        for (let j = 0; j < keys.length; j++, i++) {
          json += `" ${keys[j]} ":"${cells[i].textContent}",`;
        }
        json = `${json.slice(0, -1)}},`;
      }
      json = `${json.slice(0, -1)}]`;

      resolve(json);
    });
  });
});
