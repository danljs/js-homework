const http = require("http");
const tags = [ "html", "head", "title", "style", "body", "h1", "p", "table", "col", "tr", "th", "a", "br", "td", "u" ];
module.exports = function compare(url) {
  let html = "";
  http.get(url, function (response) {
    response.on('data', function (chunk) {
      html += chunk;
    });

    response.on('end', function (chunk) {
      // console.log(parseHTML(data));
      console.log(parseHTML(html));
      
    });
  });

  // var html = '<html><body><h1>test</h1> some text <div> <p>text</p></div></body></html>';

function parseHTML (html) {
    var nodesStack = [],
        i = 0,
        len = html.length,
        stateFn = parseText,
        parseTree = { cn: [] },
        alphaNumRx = /\w/,
        currentNode = parseTree,
        text = '',
        tag = '',
        newNode;
    
    function parseTag(token) {
        if (token === '/') {
            return parseCloseTag;
        }
        
        i--; //backtrack to first tag character
        return parseOpenTag;
    }
    
    function parseCloseTag(token) {
        if (token === '>') {
            if (currentNode.tag !== tag) {
                throw 'Wrong closed tag at char ' + i;
            }
            
            tag = '';
            
            nodesStack.pop();
            
            currentNode = currentNode.parentNode;
            
            return parseText;            
        }
        
        assertValidTagNameChar(token);
        
        tag += token;
        
        return parseCloseTag;
    }
    
    function parseOpenTag(token) {
        if (token === '>') {
            currentNode.cn.push(newNode = { tag: tag, parentNode: currentNode,  cn: []});
            nodesStack.push(currentNode = newNode);
            
            tag = '';
            
            return parseText;
        }
        
        assertValidTagNameChar(token);
        
        tag += token;
        
        return parseOpenTag;
    }
    
    function parseText(token) {
        if (token === '<') {
            
            if (text) {
                currentNode.cn.push(text);
                text = '';
            }
            
            return parseTag;
        }
        
        text += token;
        
        return parseText;
    }
    
    function assertValidTagNameChar(c) {
        if (!alphaNumRx.test(c)) {
            throw 'Invalid tag name char at ' + i;
        }
    }
    
    for (; i < len; i++) {
        stateFn = stateFn(html[i]);
    }
    
    if (currentNode = nodesStack.pop()) {
        throw 'Unbalanced tags: ' + currentNode.tag + ' is never closed.';
    }
    
    return parseTree;
};

// console.log(parseHTML(html));

}
