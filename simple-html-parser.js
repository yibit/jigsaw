
var input= `
<ul style="width:100px;">
 <li></li>
</ul>
`

var max = 100;
var nodes = [];
var pendingTag = [];

    debugger;
findNextNode(input, 0);
console.log(nodes);




function findNextNode(input, from) {
    for (var i = from; i < input.length; i++) {
        if (input[i] == '<') {
            if (input[i+1] == '/') {
                // closing tag
            } else {
                // a new child tag
                findNode(input, i);
            }
            return i;
        } else if (input[i].match(/"|'/)) {
            i = findQuoteEnd(input, i + 1, input[i]);
        }
    }



    // input = input.substring(from);
    // var tagStart = input.match(/<.+?\s+|>/);
    // var tagStartPos = tagStart ? tagStart.index : input.length;
    // var quoteStart = input.match(/"|'/);
    // var quoteStartPos = quoteStart ? quoteStart.index : input.length;

    // if (tagStartPos < quoteStartPos) {
    //     findNode(input, tagStartPos, tagStart[0]);
    // } else if (quoteStartPos < tagStartPos) {
    //     var quoteInfo = findQuote(input, quoteStartPos);
    //     if (quoteInfo) {
    //         findNextNode(input, quote.index);
    //     }
    // } else {
    //     // the end
    // }
    // return tagStart;
}

function isClosingTag(input, from) {
    input.substring(from).match(/<\/.+?\s*>/);
}

function findTagEnd(input, from) {
    var tagEnd = input.length;
    for (var i = from; i < input.length; i++) {
        if (input[i] == '>') {
            tagEnd = i;
            break;
        }
    }
    return tagEnd;
}

function findNode(input, from) {
    var sub = input.substring(from);
    var match = sub.match(/<(.+?)\s/);
    var tagName = match ? match[1] : sub;
    var node = new Node(tagName);
    pendingTag.push(node);

    var start = from + tagName.length;
    while(true) {
        var attr = findAttribute(input, start);
        if (!attr) {
            break;
        }
        node.attributes.push(attr);
        start = attr.endIndex + 1;
    }

    var lastAttr = node.attributes[node.attributes.length - 1];
    var idx = findTagEnd(input, lastAttr.endIndex);
    if (idx !== input.length) {
        var nextTagStart = findNextNode(input, idx + 1);
        node.innerHtml = input.substring(from, nextTagStart);
        pendingTag.pop(node);
        if (pendingTag.length == 0) {
            nodes.push(node);
        }
    } else {
        node.innerHtml = input.substring(from);
    }

}

function findAttribute(input, from) {
    var nameEndIndex = findAttributeNameEnd(input, from);
    for (var i = nameEndIndex; i < input.length; i++) {
        if (input[i] == '=') {
            var name = input.slice(from, i);
            var quoteStart = findQuoteStart(input, i+1);
            var endIndex = quoteStart ? findQuoteEnd(input, quoteStart.index + 1, quoteStart.quote) : i;
            var value = quoteStart ? input.slice(i + 1, endIndex) : undefined;
            return {name: name, value: value, startIndex: from, endIndex: endIndex};
        } else if (input[i] == '>') {
            var name = input.slice(from, i).trim();
            var value = undefined;
            return name ? {name: name, value: value, startIndex: from, endIndex: endIndex} : null;
        }
    }

}

function findAttributeNameEnd(input, from) {
    for (var i = from; i < input.length; i++) {
        if (input[i] == '=' || input[i] == '>' || input[i] == ' ') {
            return i;
        }
    }
    return input.length;
}

function findQuoteStart(input, from) {
    for (var i = from; i < input.length; i++) {
        var match = input[i].match(/"|'/);
        if (match) {
            return {index:i, quote: match[0]};
        }
    }
    return null;
}

function findQuoteEnd(input, from, quote) {
    for (var i = from; i < input.length; i++) {
        if (input[i] == '\\') {
            // 跳过转义符
            i++;
        }
        if (input[i] == quote) {
            return i;
        }
    }
    return input.length;
}

function Node(tag) {
    this.tag = tag;
    this.attributes = [];
    this.innerHtml = '';
}

// String host = '10.10.10.10:3424';
// int index = host.indexOf(':');
// String ip = host.substring(0, index);
// String port = host.substring(index+1);