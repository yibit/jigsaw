
var input= `
<ul>
  <li *ngFor="let i of [1,2,3,4,5]">
  {{this.dataBus.text}}:  {{i}}
  </li>
    
<span>{{this.dataBus.text}}</span>
<span>{{this.dataBus.text123.bdfd}}</span>

  <hr *ngFor="let i of [1,2,3,4,5]" style="padding: 8px">
<span>{{this.dataBus.text}}</span>
<span>{{this.dataBus.text123.bdfd}}</span>
</ul>
`

var pos = 0;
while(true) {
    var tagStart = matchWithIndex(input, /<.+?\s+/, pos);
    var tagStartPos = tagStart ? tagStart.index : input.length;
    var quoteStart = matchWithIndex(input, /"|'/, pos);
    var quoteStartPos = quoteStart ? quoteStart.index : input.length;

    if (tagStartPos < quoteStartPos) {
        findTagEnd(input, tagStartPos + tagStart[0].length);
    } else if (quoteStartPos < tagStartPos) {

    } else {
        break;
    }

}


function findTagEnd(input, from) {
    var tagEnd = input.length;
    for (var i = from; i < input.length; i++) {
        if (input[i] == '>') {
            tagEnd = i;
            break;
        }
        if (input[i].match(/"|'/)) {
            i = findQuoteEnd(input, i + 1);
        }
    }

}

function findAttribute(input, from) {
    var nameEndIndex = findAttributeNameEnd(input, from);
    for (var i = nameEndIndex; i < input.length; i++) {
        if (input[i] == '=') {
            var name = input.slice(from, i);
            var quoteStart = findQuoteStart(input, i);
            if (quoteStart) {

            }
            var endIndex = quoteStart ? findQuoteEnd(input, quoteStart.index, quoteStart.quote) : ;
            var value = input.slice(i + 1, endIndex);
            return {name: name, value: value, startIndex: from, endIndex: endIndex};
        } else if (input[i] == '>') {
            var name = input.slice(from, i);
            var value = undefined;
            var endIndex = i;
            return {name: name, value: value, startIndex: from, endIndex: endIndex};
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
        if (input[i].match(/"|'/)) {
            return {index: i, quote: input[i]};
        }
    }
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